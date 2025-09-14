import { EVENTS } from "../../contants";
import { EventManager } from "../../EventManager";
import type { IStepInstance } from "../Step";
import { StepInstance } from "../Step/StepInstance";
import type { IWizardConfig } from "./wizard.types";

class WizardInstance {
  eventManager = new EventManager();
  currentStep: IStepInstance;
  stepsConfiguration: { [key: string]: IStepInstance } = {};
  visibleStepsMap: { [key: string]: IStepInstance } = {};
  isLastStep: boolean = false;
  isFirstStep: boolean = false;
  isCompleted: boolean = false;

  private __INIT__: IWizardConfig;
  constructor(private config: IWizardConfig) {
    this.__INIT__ = structuredClone(config);
    config.stepsKeys.forEach((stepKey) => {
      this.stepsConfiguration[stepKey] = new StepInstance(stepKey);
    });
    this.currentStep = this.stepsConfiguration[this.config.activeStep];
    this.visibleStepsMap = {};
    this.config.visibleSteps.forEach((stepKey) => {
      this.visibleStepsMap[stepKey] = this.stepsConfiguration[stepKey];
    });
  }
  handleStepChange = (direction: "next" | "prev") => {
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentIndex = visibleStepsList.indexOf(this.currentStep.name);

    const targetIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;
    const targetStepName = visibleStepsList[targetIndex];
    if (direction === "next" && !targetStepName) {
      this.eventManager.dispatch({
        type: EVENTS.ON_FINISH,
        payload: this,
      });
      return;
    }
    if (direction === "prev" && !targetStepName) {
      return;
    }
    this.currentStep.initialComplete = true;
    this.navigateToStep(targetStepName);
  };

  navigateToStep = (stepName: string) => {
    if (!stepName) {
      return;
    }
    const stepInstance = this.visibleStepsMap[stepName];
    this.currentStep = stepInstance;
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(stepName);
    this.isFirstStep = currentVisibleIndex === 0;
    this.isLastStep = currentVisibleIndex === visibleStepsList.length - 1;
    this.eventManager.dispatch({
      type: "CHANGED_STEP",
      payload: stepName,
    });
  };

  updateVisibleSteps = (newSteps: string[]) => {
    this.visibleStepsMap = {};
    newSteps.forEach((stepName: string) => {
      if (this.stepsConfiguration[stepName]) {
        this.visibleStepsMap[stepName] = this.stepsConfiguration[stepName];
      }
    });

    // Reset step instances that are not in the new visibility map
    Object.keys(this.stepsConfiguration).forEach((stepName: string) => {
      if (!newSteps.includes(stepName)) {
        try {
          this.stepsConfiguration[stepName].reset();
        } catch (error) {
          // Failed to reset step
        }
      }
    });

    // Recalculate isFirstStep and isLastStep based on new visibleStepsMap
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(this.currentStep.name);

    this.isFirstStep = currentVisibleIndex === 0;
    this.isLastStep = currentVisibleIndex === visibleStepsList.length - 1;
  };
  resetWizard = () => {
    // Reset to initial configuration
    this.config = structuredClone(this.__INIT__);

    // Recreate stepsConfiguration
    this.stepsConfiguration = {};
    this.config.stepsKeys.forEach((stepKey) => {
      this.stepsConfiguration[stepKey] = new StepInstance(stepKey);
    });

    // Set current step
    this.currentStep = this.stepsConfiguration[this.config.activeStep];

    // Recreate visibleStepsMap
    this.visibleStepsMap = {};
    this.config.visibleSteps.forEach((stepKey) => {
      this.visibleStepsMap[stepKey] = this.stepsConfiguration[stepKey];
    });

    // Reset flags
    this.isFirstStep = false;
    this.isLastStep = false;
    this.isCompleted = false;

    // Recalculate isFirstStep and isLastStep
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(this.currentStep.name);
    this.isFirstStep = currentVisibleIndex === 0;
    this.isLastStep = currentVisibleIndex === visibleStepsList.length - 1;

    this.eventManager.dispatch({
      type: EVENTS.ON_RESET,
    });
  };

  completeWizard = () => {
    this.isCompleted = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_SUCCESS,
    });
  };
}

export { WizardInstance };
