import styles from "./navigation.module.css";
import type { IStepInstance } from "@wizard/types";
import { STEP_NAMES } from "../../constants";

interface NavigationProps {
  visibleSteps: IStepInstance[];
  activeStep: IStepInstance;
  stepsMap: { [key: string]: IStepInstance };
  goToStep: (stepName: string) => void;
}

export const Navigation = ({
  visibleSteps,
  activeStep,
  stepsMap,
  goToStep,
}: NavigationProps) => {
  return (
    <div className={styles.navigation}>
      {visibleSteps.map((step, index: number) => {
        const isActive = step === activeStep;
        const isCompleted = !!stepsMap[step.name]?.getStepData();

        let className = styles.navigationItem;
        if (isActive) {
          className += ` ${styles.active}`;
        } else if (isCompleted) {
          className += ` ${styles.completed}`;
        } else {
          className += ` ${styles.inactive}`;
        }

        return (
          <div
            key={step.name}
            className={styles.navigationStep}
            onClick={() => {
              if (isCompleted && !isActive) {
                goToStep(step.name);
              }
            }}
            style={{ cursor: isCompleted && !isActive ? "pointer" : "default" }}
          >
            <div className={className}>
              {isCompleted ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className={styles.stepName}>
              {STEP_NAMES[step.name] || step.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
