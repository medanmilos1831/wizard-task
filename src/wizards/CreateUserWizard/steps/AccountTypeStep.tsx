import { Row } from "antd";
import type { PropsWithChildren } from "react";
import { data } from "../../../mock";

import { AnswerList } from "../components";
import { IStepInstance } from "src/Wizard/types";

interface AccountTypeStepProps extends PropsWithChildren {
  activeStep: IStepInstance;
}

const AccountTypeStep = ({ children, activeStep }: AccountTypeStepProps) => {
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={data.accountType}
          id={activeStep.getStepData()?.id}
          isLocked={activeStep.isComplete}
          onAnswerClick={(item) => {
            if (item.id === activeStep.getStepData()?.id) {
              return;
            }
            activeStep.setState((prev) => {
              return {
                ...prev,
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

export { AccountTypeStep };
