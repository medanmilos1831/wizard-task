import { useModal } from "../../../../../context/ModalProvider";
import { useOnStepComplete, useWizzard } from "../../../../../Wizard/Provider";
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
  const client = useWizzard();
  // Use client methods directly
  const onNextStep = client.nextStep;
  const onPrevStep = client.prevStep;
  const getStepState = client.getStepState;
  const activeStepName = client.getActiveStepName();
  const updateVisibleSteps = client.updateVisibleSteps;
  const isFirst = client.getIsFirst();
  const isLast = client.getIsLast();
  const reset = client.reset;
  const nummberOfCompletedSteps = client.getNumberOfCompletedSteps();
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
            onPrevStep();
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
              () =>
                (
                  <ResetWarning
                    onConfirm={() => {
                      reset();
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
