import { Button } from "antd";
import styles from "./controlsButton.module.css";

import { ResetWarning } from "../../modals";
import { useModal } from "src/context/ModalProvider";
import { IStepInstance } from "src/Wizard/types";
import { WIZARD_STEPS } from "src/wizards/CreateUserWizard/constants";

interface ControlsProps {
  isForm: boolean;
  isFirst: boolean;
  isLast: boolean;
  activeStep: IStepInstance;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
  getCompletedSteps: () => IStepInstance[];
  stepsMap: { [key: string]: IStepInstance };
  isLoading?: boolean;
}

const Controls = ({
  isForm,
  isFirst,
  isLast,
  activeStep,
  prevStep,
  nextStep,
  reset,
  getCompletedSteps,
  stepsMap,
  isLoading = false,
}: ControlsProps) => {
  const { open, close } = useModal();
  return (
    <div className={styles.controlsContainer}>
      {!isFirst && (
        <Button
          className={`${styles.controlButton} ${styles.secondary}`}
          htmlType="button"
          onClick={prevStep}
          disabled={isLoading}
        >
          Previous
        </Button>
      )}
      <Button
        className={`${styles.controlButton} ${styles.primary}`}
        htmlType={isForm ? "submit" : "button"}
        loading={isLoading}
        disabled={
          isLoading ||
          (!activeStep.getStepData() &&
            ![WIZARD_STEPS.ADD_PLAN, WIZARD_STEPS.INFORMATION].includes(
              activeStep.name as any
            ))
        }
        onClick={
          isForm
            ? undefined
            : () => {
                nextStep();
              }
        }
      >
        {isLast ? "Submit" : "Next"}
      </Button>
      {Object.values(stepsMap).some((step) => !!step.getStepData()) && (
        <Button
          className={`${styles.controlButton} ${styles.danger}`}
          htmlType="button"
          disabled={isLoading}
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
        </Button>
      )}
    </div>
  );
};

export { Controls };
