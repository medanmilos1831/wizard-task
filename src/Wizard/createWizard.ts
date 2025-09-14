import { EVENTS } from "./contants";
import type { IStepInstance } from "./Entities/Step";
import type { IWizardConfig } from "./Entities/Wizzard";
import { WizardInstance } from "./Entities/Wizzard/WizardInstance";

function createWizard(config: IWizardConfig) {
  const wizzard = new WizardInstance(config);
  return {
    getCurrentStep: () => {
      return {
        name: wizzard.currentStep.name,
        state: wizzard.currentStep.state,
        isComplete: wizzard.currentStep.isComplete,
        initialComplete: wizzard.currentStep.initialComplete,
        prevState: wizzard.currentStep.prevState,
        isFirst: wizzard.isFirstStep,
        isLast: wizzard.isLastStep,
        reset: wizzard.currentStep.reset,
        setState: (value: any) => wizzard.currentStep.setState(value),
        completeStep: () => {
          wizzard.currentStep.setStepComplete();
          wizzard.eventManager.dispatch({
            type: EVENTS.ON_STEP_COMPLETE,
          });
        },
      };
    },

    navigateToStep: (stepName: string) => {
      wizzard.navigateToStep(stepName);
    },

    getAllStepsState: () => {
      const allStepStates: { [key: string]: any } = {};
      Object.keys(wizzard.visibleStepsMap).forEach((stepKey) => {
        try {
          allStepStates[stepKey] = wizzard.visibleStepsMap[stepKey].state;
        } catch (error) {
          allStepStates[stepKey] = null;
        }
      });
      return allStepStates;
    },

    getStepsConfiguration: () => wizzard.stepsConfiguration,

    getVisibleStepsList: () => {
      const visibleStepsList = Object.keys(wizzard.visibleStepsMap);
      if (!visibleStepsList.length) return [];
      return visibleStepsList.map((stepName: string) => ({
        stepName,
        isComplete: wizzard.visibleStepsMap[stepName]?.isComplete || false,
      }));
    },

    navigateToPreviousStep: () => {
      wizzard.handleStepChange("prev");
    },

    navigateToNextStep: () => {
      wizzard.handleStepChange("next");
    },

    updateVisibleSteps: (newSteps: string[]) => {
      wizzard.updateVisibleSteps(newSteps);
    },

    isWizardCompleted: () => wizzard.isCompleted,

    getVisibleStepNames: () => Object.keys(wizzard.visibleStepsMap),

    getCompletedStepsCount: () => {
      return Object.values(wizzard.visibleStepsMap).filter(
        (step: IStepInstance) => step.isComplete
      ).length;
    },

    getUpcomingSteps: () => {
      if (!Object.keys(wizzard.visibleStepsMap) || !wizzard.currentStep)
        return [];
      const currentIndex = Object.keys(wizzard.visibleStepsMap).indexOf(
        wizzard.currentStep.name
      );
      const aheadSteps = Object.keys(wizzard.visibleStepsMap).slice(
        currentIndex + 1
      );
      return aheadSteps.map((stepName: string) => ({
        stepName,
        stepInstance: wizzard.visibleStepsMap[stepName],
        isComplete: wizzard.visibleStepsMap[stepName]?.isComplete || false,
      }));
    },

    getStepState: (stepName: string) =>
      wizzard.visibleStepsMap[stepName]?.state,

    resetWizard: wizzard.resetWizard,

    completeWizard: wizzard.completeWizard,

    subscribe: (event: string, callback: (event: any) => void) => {
      return wizzard.eventManager.subscribe(event, callback);
    },
  };
}

export { createWizard };
