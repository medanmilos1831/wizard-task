import {
  useClient,
  useOnReset,
  useOnStepChange,
} from "../../../../Wizard/WizProvider";

import styles from "./Navigation.module.css";

export const Navigation = () => {
  const client = useClient();
  const stepname = useOnStepChange();

  useOnReset();
  return (
    <div className={styles.navigation}>
      {client.getVisibleSteps().map((step: any, index: number) => {
        const isActive = step.stepName === stepname;
        const isCompleted = step.isComplete;

        let itemClasses = styles.navigationItem;
        if (isActive) {
          itemClasses += ` ${styles.active}`;
        } else if (isCompleted) {
          itemClasses += ` ${styles.completed}`;
        } else {
          itemClasses += ` ${styles.inactive}`;
        }

        return (
          <div key={step.stepName} className={styles.navigationStep}>
            <button
              className={itemClasses}
              onClick={() => {
                client.goToStep(step.stepName);
              }}
              disabled={!isCompleted && !isActive}
            >
              {isCompleted ? (
                <svg
                  width="18"
                  height="18"
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
            </button>
            <div className={styles.stepName}>
              {(step.stepName === "accountType" && "Account Type") ||
                (step.stepName === "plan" && "Plan") ||
                (step.stepName === "addPlan" && "Add Plan") ||
                (step.stepName === "information" && "Information") ||
                step.stepName}
            </div>
          </div>
        );
      })}
    </div>
  );
};
