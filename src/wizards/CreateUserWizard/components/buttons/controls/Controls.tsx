import { useModal } from "../../../../../context/ModalProvider";
import {
  useOnStepComplete,
  useWizardClient,
} from "../../../../../Wizard/Provider";
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
  const wizzardClient = useWizardClient();

  const { isFirst, isLast, name, state, isComplete } =
    wizzardClient.getCurrentStep();

  // Use client methods directly

  const isStepComplete = useOnStepComplete();
  const { open, close } = useModal();
  return (
    <div className={styles.controlsContainer}>
      {!isFirst && (
        <button
          className={`${styles.controlButton} ${styles.secondary}`}
          type="button"
          disabled={isFirst}
          onClick={() => {
            wizzardClient.navigateToPreviousStep();
          }}
        >
          Previous
        </button>
      )}
      <button
        className={`${styles.controlButton} ${styles.primary}`}
        type={isForm ? "submit" : "button"}
        disabled={!isStepComplete || isLoading}
        onClick={
          isForm
            ? undefined
            : () => {
                if (name === "plan") {
                  if (state.id === "all") {
                    wizzardClient.updateVisibleSteps([
                      "accountType",
                      "plan",
                      "addPlan",
                      "information",
                    ]);
                    wizzardClient.navigateToNextStep();
                  } else {
                    wizzardClient.updateVisibleSteps([
                      "accountType",
                      "plan",
                      "information",
                    ]);
                    wizzardClient.navigateToNextStep();
                  }
                } else {
                  wizzardClient.navigateToNextStep();
                }
              }
        }
      >
        {nextButtonLabel || (isLast ? "Submit" : "Next")}
      </button>
      {wizzardClient.getCompletedStepsCount() > 0 && (
        <button
          className={`${styles.controlButton} ${styles.danger}`}
          type="button"
          onClick={() => {
            open(
              () =>
                (
                  <ResetWarning
                    onConfirm={() => {
                      wizzardClient.resetWizard();
                      close();
                    }}
                    onCancel={() => close()}
                  />
                ) as any,
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
