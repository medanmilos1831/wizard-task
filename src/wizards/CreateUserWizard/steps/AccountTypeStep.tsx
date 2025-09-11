import { AnswerList } from "../components";
import { Row } from "antd";
import type { PropsWithChildren } from "react";
import { data } from "../../../mock";
import { useModal } from "../../../context/ModalProvider";
import { WarningModal } from "../components/modals";
import type { IStepInstance } from "../../../Wizard/types";
import { useStepState, useWizardClient } from "../createUserWizzard";

/**
 * AccountTypeStep component for selecting account type
 * Handles account type selection with validation and warning modal
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @returns JSX element representing the account type selection step
 */
const AccountTypeStep = ({ children }: PropsWithChildren) => {
  const { state, setState } = useStepState((state: any) => state);
  // Use client methods directly
  const client = useWizardClient();
  const setStepComplete = client.setStepComplete;
  const getInitialComplete = client.getInitialComplete;
  const updateVisibleSteps = client.updateVisibleSteps;
  const onNextStep = client.onNextStep;
  const getAheadSteps = client.getAheadSteps;
  const { open, close } = useModal();
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={data.accountType}
          id={state?.id}
          onAnswerClick={(item) => {
            // Check if user is trying to select the same option they already selected
            if (item.id != state?.id && getInitialComplete()) {
              // Show warning modal for same selection
              open(
                () => (
                  <WarningModal
                    onConfirm={() => {
                      // Get all ahead steps and reset them
                      const aheadSteps = getAheadSteps();
                      aheadSteps.forEach(
                        ({ stepInstance }: { stepInstance: IStepInstance }) => {
                          stepInstance.reset();
                        }
                      );

                      // Update visible steps to only show accountType and plan
                      updateVisibleSteps(["accountType", "plan"]);
                      // Move to next step
                      onNextStep();
                      // Close the modal
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
            // Mark step as complete and update state with selected item
            setStepComplete();
            setState((prev: any) => {
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
