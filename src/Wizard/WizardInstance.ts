import { EVENTS } from "./contants";
import { EventManager } from "./EventManager";
import { setupWizardInstance } from "./utils";
import type { IStepInstance, IWizardConfig, IWizardInstance } from "./types";

/**
 * Main wizard instance that manages the entire wizard flow
 * Handles step navigation, state management, and event dispatching
 */
class WizardInstance implements IWizardInstance {
  /** Currently active step in the wizard */
  activeStep: IStepInstance;
  /** Map of all step instances by their names */
  stepsMap: { [key: string]: IStepInstance };
  /** Array of step keys in order */
  stepsKeys: string[];
  /** Whether the current step is the last step */
  isLast: boolean;
  /** Whether the current step is the first step */
  isFirst: boolean;
  /** Whether the wizard has been completed successfully */
  isSuccess: boolean = false;
  /** Array of currently visible step instances */
  visibleSteps: IStepInstance[] = [];
  /** Array of currently visible step keys */
  visibleStepsKeys: string[] = [];
  /** Event manager for handling wizard events */
  eventManager: EventManager = new EventManager();
  /** Callback function called when step changes */
  onStepChange: any;
  /** Callback function called when wizard is finished */
  onFinish: (success: () => void, stepData: any) => void;
  /** Initial configuration used for resetting */
  __INIT__: IWizardConfig;
  /**
   * Creates a new wizard instance
   * @param config - Initial wizard configuration
   * @param onStepChange - Callback function for step changes
   * @param options - Additional options for the wizard
   * @param options.onFinish - Callback function called when wizard is completed
   */
  constructor(
    config: IWizardConfig,
    { onStepChange }: any,
    options: {
      onFinish: (success: () => void, stepData: any) => void;
    }
  ) {
    this.onFinish = options.onFinish;
    this.onStepChange = onStepChange;
    this.__INIT__ = structuredClone(config);
    const setupResult = setupWizardInstance(config, this.eventManager);
    this.stepsMap = setupResult.stepsMap;
    this.activeStep = setupResult.activeStep;
    this.stepsKeys = setupResult.stepsKeys;
    this.visibleStepsKeys = setupResult.visibleStepsKeys;
    this.visibleSteps = setupResult.visibleSteps;
    this.isLast = setupResult.isLast;
    this.isFirst = setupResult.isFirst;
    this.isSuccess = false;
  }

  /**
   * Gets all completed steps (steps with data that are not the current step)
   * @returns Array of completed step instances
   */
  getCompletedSteps = (): IStepInstance[] => {
    return this.visibleSteps.filter(
      (step) => !!step.getStepData() && step.name !== this.activeStep.name
    );
  };

  /**
   * Moves to the next step in the wizard
   * Marks current step as complete and updates navigation state
   */
  nextStep = () => {
    if (this.isLast) {
      this.onFinish(
        this.success,
        (() => {
          const stepData: any = {};
          this.visibleSteps.forEach((step) => {
            stepData[step.name] = step.getStepData();
          });
          return stepData;
        })()
      );
      return;
    }

    // Mark current step as complete when moving to next
    this.activeStep.completeStep();

    this.onStepChange({
      activeStep: this.activeStep,
      updateVisibleSteps: this.updateVisibleSteps,
      visibleStepsKeys: this.visibleStepsKeys,
      instance: this,
    });

    const currentVisibleIndex = this.visibleSteps.indexOf(this.activeStep);
    const nextVisibleStep = this.visibleSteps[currentVisibleIndex + 1];
    this.activeStep = nextVisibleStep;
    const currentStepIndex = this.stepsKeys.indexOf(this.activeStep.name);
    this.isLast = currentStepIndex === this.stepsKeys.length - 1;
    this.isFirst = currentStepIndex === 0;

    this.eventManager.dispatch({
      type: "STEP_CHANGED",
      payload: this,
    });
  };
  /**
   * Updates the visible steps based on the provided callback
   * @param callback - Function that returns new visible steps configuration
   */
  updateVisibleSteps = (
    callback: (currentState: {
      visibleStepsKeys: string[];
      stepsKeys: string[];
    }) => { visibleStepsKeys: string[] }
  ) => {
    const currentState = {
      visibleStepsKeys: this.visibleSteps.map((step) => step.name),
      stepsKeys: this.stepsKeys,
    };

    const result = callback(currentState);

    // Update isVisible flags in stepsMap
    Object.keys(this.stepsMap).forEach((stepKey) => {
      this.stepsMap[stepKey].setIsVisible(
        result.visibleStepsKeys.includes(stepKey)
      );
    });

    // Recalculate visibleSteps array
    this.visibleSteps = Object.values(this.stepsMap).filter(
      (step) => step.isVisible
    );
  };
  /**
   * Moves to the previous step in the wizard
   * Updates navigation state without marking steps as complete
   */
  prevStep = () => {
    const currentVisibleIndex = this.visibleSteps.indexOf(this.activeStep);
    const prevVisibleStep = this.visibleSteps[currentVisibleIndex - 1];
    this.activeStep = prevVisibleStep;
    const currentStepIndex = this.stepsKeys.indexOf(this.activeStep.name);
    this.isLast = currentStepIndex === this.stepsKeys.length - 1;
    this.isFirst = currentStepIndex === 0;

    this.eventManager.dispatch({
      type: "STEP_CHANGED",
      payload: this,
    });
  };
  /**
   * Gets the data for a specific step by name
   * @param name - Name of the step to get data for
   * @returns The step data or undefined if step doesn't exist
   */
  getStates = (name: string) => {
    return this.stepsMap[name].getStepData();
  };
  /**
   * Navigates to a specific step by key
   * Only allows navigation to steps that have data
   * @param stepKey - Key of the step to navigate to
   */
  goToStep = (stepKey: string) => {
    const targetStep = this.stepsMap[stepKey];

    if (targetStep.getStepData()) {
      this.activeStep = targetStep;
      const currentStepIndex = this.stepsKeys.indexOf(this.activeStep.name);
      this.isLast = currentStepIndex === this.stepsKeys.length - 1;
      this.isFirst = currentStepIndex === 0;

      this.eventManager.dispatch({
        type: "STEP_CHANGED",
        payload: this,
      });
    }
  };
  /**
   * Marks the wizard as successfully completed
   * Dispatches success event and updates internal state
   */
  success = () => {
    this.isSuccess = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_SUCCESS,
      payload: this,
    });
  };
  /**
   * Resets the wizard to its initial state
   * Reinitializes all steps and clears all data
   */
  reset = () => {
    this.__INIT__ = structuredClone(this.__INIT__);
    const setupResult = setupWizardInstance(this.__INIT__, this.eventManager);
    this.stepsMap = setupResult.stepsMap;
    this.activeStep = setupResult.activeStep;
    this.stepsKeys = setupResult.stepsKeys;
    this.visibleSteps = setupResult.visibleSteps;
    this.isLast = setupResult.isLast;
    this.isFirst = setupResult.isFirst;
    this.isSuccess = false;
    this.eventManager.dispatch({
      type: EVENTS.ON_RESET,
      payload: this,
    });
  };
}

export { WizardInstance };
