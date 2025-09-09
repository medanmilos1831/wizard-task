import { Row } from "antd";
import { type PropsWithChildren } from "react";
import { IStepInstance } from "src/Wizard/types";
import { AnswerList } from "../components";

interface PlanStepProps extends PropsWithChildren {
  activeStep: IStepInstance;
  getStates: (name: string) => any;
}

const PlanStep = ({ children, activeStep, getStates }: PlanStepProps) => {
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={[
            ...getStates("accountType").plan,
            { id: "all", name: "All Plans", isExtraInfoRequired: false },
          ]}
          id={activeStep.getStepData()?.id}
          isLocked={activeStep.isComplete}
          onAnswerClick={(item) => {
            activeStep.setState((data) => {
              return {
                ...data,
                ...item,
              };
            });
          }}
        />
      </Row>
      {children}
    </>
  );
};

export { PlanStep };
