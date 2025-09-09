import { StepInstance } from "./StepInstance";
import { EventManager } from "./EventManager";
import type { IWizardConfig, IStepInstance } from "./types";

/**
 * Sets up a new wizard instance with all necessary configurations
 * Creates step instances, calculates navigation properties, and initializes state
 * @param config - Initial wizard configuration
 * @param eventManager - Event manager for handling wizard events
 * @returns Complete wizard setup with all calculated properties
 */
export function setupWizardInstance(
  config: IWizardConfig,
  eventManager: EventManager
) {
  const stepsMap: { [key: string]: IStepInstance } = {};

  // Initialize steps
  config.stepsKeys.forEach((stepKey) => {
    stepsMap[stepKey] = new StepInstance(stepKey, {
      isVisible: config.visibleSteps.includes(stepKey),
      eventManager: eventManager,
    });
  });

  // Calculate step properties
  const activeStep = stepsMap[config.activeStep];
  const stepsKeys = Object.keys(stepsMap);
  const visibleStepsKeys = Object.keys(stepsMap).filter((stepKey) =>
    config.visibleSteps.includes(stepKey)
  );
  const visibleSteps = Object.values(stepsMap).filter((step) => step.isVisible);
  const currentStepIndex = stepsKeys.indexOf(activeStep.name);
  const isLast = currentStepIndex === stepsKeys.length - 1;
  const isFirst = currentStepIndex === 0;

  return {
    stepsMap,
    activeStep,
    stepsKeys,
    visibleSteps,
    visibleStepsKeys,
    isLast,
    isFirst,
  };
}
