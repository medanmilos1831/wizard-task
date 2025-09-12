import type { IWizardConfig } from "./types";
import { WizardInstance } from "./WizardInstance";

class WizzardClient extends WizardInstance {
  constructor(config: IWizardConfig) {
    super(config);
  }

  api = {
    goToStep: (name: string) => this.goToStep(name, true),
    reset: () => this.reset(),
    getStepsStateMap: () => {
      const allStepStates: { [key: string]: any } = {};
      Object.keys(this.visibleStepsMap).forEach((stepKey) => {
        try {
          allStepStates[stepKey] = this.visibleStepsMap[stepKey].state;
        } catch (error) {
          // Failed to get state for step
          allStepStates[stepKey] = null;
        }
      });
      return allStepStates;
    },
    getVisibleSteps: () => {
      const visibleStepsList = Object.keys(this.visibleStepsMap);
      if (!visibleStepsList.length) return [];
      return visibleStepsList.map((stepName: string) => ({
        stepName,
        isComplete: this.visibleStepsMap[stepName]?.isComplete || false,
      }));
    },
    nextStep: () => {
      this.activeStep.onNextStep();
    },

    getStepState: () => {
      return this.activeStep.state;
    },

    getActiveStepName: () => {
      return this.activeStep.name;
    },

    updateVisibleSteps: this.updateVisibleSteps,

    prevStep: () => {
      this.activeStep.onPrevStep();
    },

    setState: (value: any) => {
      this.activeStep.setState(value);
    },

    getState: () => {
      return this.activeStep.state;
    },

    getVisibleStepsKeys: () => {
      return Object.keys(this.visibleStepsMap);
    },

    getInitialComplete: () => this.activeStep.initialComplete,

    getNumberOfCompletedSteps: () => {
      return Object.values(this.visibleStepsMap).filter(
        (step: any) => step.isComplete
      ).length;
    },

    getAheadSteps: () => {
      if (!Object.keys(this.visibleStepsMap) || !this.activeStep) return [];
      const currentIndex = Object.keys(this.visibleStepsMap).indexOf(
        this.activeStep.name
      );
      const aheadSteps = Object.keys(this.visibleStepsMap).slice(
        currentIndex + 1
      );
      return aheadSteps.map((stepName: string) => ({
        stepName,
        stepInstance: this.visibleStepsMap[stepName],
        isComplete: this.visibleStepsMap[stepName]?.isComplete || false,
      }));
    },
    setStepComplete: () => this.activeStep.setStepComplete(),

    getStepData: this.activeStep.getStepData,

    getPrevStepData: this.activeStep.getPrevStepData,

    getIsFirst: this.getIsFirst,

    getIsLast: this.getIsLast,

    getStateByStepName: (name: string) => this.visibleStepsMap[name]?.state,
  };
}

export { WizzardClient };
