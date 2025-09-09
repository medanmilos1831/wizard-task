import { createWizard } from "src/Wizard";
import { WIZARD_STEPS, ALL_STEPS, INITIAL_VISIBLE_STEPS } from "./constants";

const { WizardHander } = createWizard(
  {
    activeStep: WIZARD_STEPS.ACCOUNT_TYPE,
    stepsKeys: ALL_STEPS,
    visibleSteps: INITIAL_VISIBLE_STEPS,
  },
  {
    onStepChange(data: any) {
      const currentVisibleSteps = data.visibleStepsKeys || [];

      if (data.activeStep.name === WIZARD_STEPS.ACCOUNT_TYPE) {
        const requiredSteps = [WIZARD_STEPS.ACCOUNT_TYPE, WIZARD_STEPS.PLAN];
        const hasAllRequired = requiredSteps.every((step) =>
          currentVisibleSteps.includes(step)
        );

        if (!hasAllRequired) {
          data.updateVisibleSteps((currentState: any) => {
            return {
              visibleStepsKeys: requiredSteps,
            };
          });
        }
      }

      if (data.activeStep.name === WIZARD_STEPS.PLAN) {
        if (data.activeStep.getStepData() === undefined) {
          const requiredSteps = [WIZARD_STEPS.ACCOUNT_TYPE, WIZARD_STEPS.PLAN];
          const hasAllRequired = requiredSteps.every((step) =>
            currentVisibleSteps.includes(step)
          );

          if (!hasAllRequired) {
            data.updateVisibleSteps((currentState: any) => {
              return {
                visibleStepsKeys: requiredSteps,
              };
            });
          }
        } else if (data.activeStep.getStepData().id === "all") {
          const requiredSteps = ALL_STEPS;
          const hasAllRequired = requiredSteps.every((step) =>
            currentVisibleSteps.includes(step)
          );

          if (!hasAllRequired) {
            data.updateVisibleSteps((currentState: any) => {
              return {
                visibleStepsKeys: requiredSteps,
              };
            });
          }
        } else if (data.activeStep.getStepData().id !== "all") {
          const requiredSteps = [
            WIZARD_STEPS.ACCOUNT_TYPE,
            WIZARD_STEPS.PLAN,
            WIZARD_STEPS.INFORMATION,
          ];
          const hasAllRequired = requiredSteps.every((step) =>
            currentVisibleSteps.includes(step)
          );

          if (!hasAllRequired) {
            data.updateVisibleSteps((currentState: any) => {
              return {
                visibleStepsKeys: requiredSteps,
              };
            });
          }
        }
      }
    },
  }
);

export { WizardHander };
