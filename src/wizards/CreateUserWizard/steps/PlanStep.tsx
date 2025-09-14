import { AnswerList } from "../components";
import { Row } from "antd";
import { type PropsWithChildren } from "react";
import { WarningModal } from "../components/modals";
import type { IStepInstance } from "../../../Wizard/Entities/Step";
import { useModal } from "../../../context/ModalProvider";
import { useWizardClient, useStepState } from "../../../Wizard/Provider";

const PlanStep = ({ children }: PropsWithChildren) => {
  const { state, setState } = useStepState((state: any) => {
    return state;
  });

  const wizzardClient = useWizardClient();
  const { completeStep, reset, initialComplete } =
    wizzardClient.getCurrentStep();

  const { open, close } = useModal();
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={[
            ...wizzardClient.getStepState("accountType").plan,
            { id: "all", name: "All Plans", isExtraInfoRequired: false },
          ]}
          id={state?.id}
          onAnswerClick={(item) => {
            if (item.id != state?.id && initialComplete) {
              open(
                () => (
                  <WarningModal
                    onConfirm={() => {
                      const aheadSteps = wizzardClient.getUpcomingSteps();
                      aheadSteps.forEach(
                        ({ stepInstance }: { stepInstance: IStepInstance }) => {
                          reset();
                        }
                      );
                      if (item.id === "all") {
                        wizzardClient.updateVisibleSteps([
                          "accountType",
                          "plan",
                          "addPlan",
                          "information",
                        ]);
                        wizzardClient.navigateToStep("addPlan");
                      } else {
                        wizzardClient.updateVisibleSteps([
                          "accountType",
                          "plan",
                          "information",
                        ]);
                        wizzardClient.navigateToStep("information");
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
            completeStep();
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
