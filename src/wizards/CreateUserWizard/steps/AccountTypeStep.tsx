import { AnswerList } from "../components";
import { Row } from "antd";
import type { PropsWithChildren } from "react";
import { data } from "../../../mock";
import { useModal } from "../../../context/ModalProvider";
import { WarningModal } from "../components/modals";

import { useStepState, useWizardClient } from "../../../Wizard/Provider";

/**
 * AccountTypeStep component for selecting account type
 * Handles account type selection with validation and warning modal
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @returns JSX element representing the account type selection step
 */
const AccountTypeStep = ({ children }: PropsWithChildren) => {
  const wizzardClient = useWizardClient();
  const {
    initialComplete,
    completeStep,
    setState: setStepState,
  } = wizzardClient.getCurrentStep();
  const { state, setState } = useStepState((state: any) => state);
  // Use client methods directly
  const { open, close } = useModal();
  return (
    <>
      <Row gutter={24}>
        <AnswerList
          items={data.accountType}
          id={state?.id}
          onAnswerClick={(item) => {
            // Check if user is trying to select the same option they already selected
            if (item.id != state?.id && initialComplete) {
              // Show warning modal for same selection
              open(
                () => (
                  <WarningModal
                    onConfirm={() => {
                      // Get all ahead steps and reset them
                      const aheadSteps = wizzardClient.getUpcomingSteps();
                      aheadSteps.forEach(({ stepInstance }) => {
                        stepInstance.reset();
                      });

                      // Update visible steps to only show accountType and plan
                      wizzardClient.updateVisibleSteps(["accountType", "plan"]);
                      setStepState(item);
                      // Move to next step
                      wizzardClient.navigateToNextStep();
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
            completeStep();
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
