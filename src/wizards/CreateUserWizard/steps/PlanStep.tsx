import { AnswerList } from "../components";
import { Row } from "antd";
import { type PropsWithChildren } from "react";
import { client, useStepState } from "../wiz";
import { WarningModal } from "../components/modals";
import type { IStepInstance } from "../../../Wizard/types";
import { useModal } from "../../../context/ModalProvider";

const PlanStep = ({ children }: PropsWithChildren) => {
  const { state, setState } = useStepState((state: any) => {
    return state;
  });
  const {
    getStateByStepName,
    setStepComplete,
    getInitialComplete,
    getAheadSteps,
    updateVisibleSteps,
    goToStep,
  } = client;
  const { open, close } = useModal();
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={[
            ...getStateByStepName("accountType").plan,
            { id: "all", name: "All Plans", isExtraInfoRequired: false },
          ]}
          id={state?.id}
          onAnswerClick={(item) => {
            if (item.id != state?.id && getInitialComplete()) {
              open(
                () => (
                  <WarningModal
                    onConfirm={() => {
                      const aheadSteps = getAheadSteps();
                      aheadSteps.forEach(
                        ({ stepInstance }: { stepInstance: IStepInstance }) => {
                          stepInstance.reset();
                        }
                      );
                      if (item.id === "all") {
                        updateVisibleSteps([
                          "accountType",
                          "plan",
                          "addPlan",
                          "information",
                        ]);
                        goToStep("addPlan");
                      } else {
                        updateVisibleSteps([
                          "accountType",
                          "plan",
                          "information",
                        ]);
                        goToStep("information");
                      }

                      close();
                    }}
                    onCancel={() => close()}
                  />
                ),
                {
                  centered: true,
                }
              );
              return;
            }
            setStepComplete();
            setState((prev) => {
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

export { PlanStep };
