import {
  useWizardClient,
  useWatchWizard,
} from "../../../../../Wizard/WizzardProvider";
import { useModal } from "../../../../../context/ModalProvider";
import { ResetWarning } from "../../modals";
import styles from "./controlsButton.module.css";

const Controls = ({
  isForm = false,
  nextButtonLabel,
  isLoading,
}: {
  isForm?: boolean;
  nextButtonLabel?: string;
  isLoading?: boolean;
}) => {
  // Use client methods directly
  const client = useWizardClient();
  const onNextStep = client.onNextStep;
  const onPrevStep = client.onPrevStep;
  const getStepState = client.getStepState;
  const activeStepName = client.getActiveStepName();
  const updateVisibleSteps = client.updateVisibleSteps;
  const isFirst = client.getIsFirst();
  const isLast = client.getIsLast();
  const reset = client.reset;
  const nummberOfCompletedSteps = client.getNumberOfCompletedSteps();
  const isStepComplete = useWatchWizard(
    "ON_STEP_COMPLETE",
    (wizardInstance: any) => {
      return wizardInstance?.activeStep.isComplete;
    }
  );
  const { open, close } = useModal();
  return (
    <div className={styles.controlsContainer}>
      <button
        className={`${styles.controlButton} ${styles.secondary}`}
        type="button"
        disabled={isFirst}
        onClick={() => {
          onPrevStep();
        }}
      >
        Previous
      </button>
      <button
        className={`${styles.controlButton} ${styles.primary}`}
        type={isForm ? "submit" : "button"}
        disabled={!isStepComplete || isLoading}
        onClick={
          isForm
            ? undefined
            : () => {
                if (activeStepName === "plan") {
                  const state = getStepState();
                  if (state.id === "all") {
                    updateVisibleSteps([
                      "accountType",
                      "plan",
                      "addPlan",
                      "information",
                    ]);
                    onNextStep();
                  } else {
                    updateVisibleSteps(["accountType", "plan", "information"]);
                    onNextStep();
                  }
                } else {
                  onNextStep();
                }
              }
        }
      >
        {nextButtonLabel || (isLast ? "Submit" : "Next")}
      </button>
      {nummberOfCompletedSteps > 0 && (
        <button
          className={`${styles.controlButton} ${styles.danger}`}
          type="button"
          onClick={() => {
            open(
              () => (
                <ResetWarning
                  onConfirm={() => {
                    reset();
                    close();
                  }}
                  onCancel={() => close()}
                />
              ),
              {
                centered: true,
              }
            );
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};

export { Controls };
