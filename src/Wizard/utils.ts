import { EventManager } from "./EventManager";
import { StepInstance } from "./StepInstance";
import type { IWizardConfig, SetupWizardResult } from "./types";

export function setupWizardInstance({
  config,
  eventManager,
}: {
  config: IWizardConfig;
  eventManager: EventManager;
}): SetupWizardResult {
  const stepsMap: { [key: string]: StepInstance<any> } = {};
  if (config.stepsKeys && Array.isArray(config.stepsKeys)) {
    config.stepsKeys.forEach((stepKey: string) => {
      const stepInstance = new StepInstance(stepKey, {
        eventManager: eventManager,
      });

      stepsMap[stepKey] = stepInstance;
    });
  }

  const visibleStepsMap: { [key: string]: StepInstance<any> } = {};
  if (config.visibleSteps && Array.isArray(config.visibleSteps)) {
    config.visibleSteps.forEach((visibleStepKey: string) => {
      if (stepsMap[visibleStepKey]) {
        visibleStepsMap[visibleStepKey] = stepsMap[visibleStepKey];
      }
    });
  }

  return {
    stepsMap,
    visibleStepsMap,
    activeStep: stepsMap[config.activeStep],
    visibleStepsList: Object.values(visibleStepsMap).map((step) => step.name),
    allStepsList: Object.values(stepsMap).map((step) => step.name),
    currentVisibleIndex: Object.values(visibleStepsMap).indexOf(
      stepsMap[config.activeStep]
    ),
    isLast:
      Object.values(visibleStepsMap).indexOf(stepsMap[config.activeStep]) ===
      Object.values(visibleStepsMap).length - 1,
    isFirst:
      Object.values(visibleStepsMap).indexOf(stepsMap[config.activeStep]) === 0,
    isLastStep:
      Object.values(visibleStepsMap).indexOf(stepsMap[config.activeStep]) ===
      Object.values(visibleStepsMap).length - 1,
    isFirstStep:
      Object.values(visibleStepsMap).indexOf(stepsMap[config.activeStep]) === 0,
  };
}
