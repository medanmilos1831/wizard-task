import { EventManager } from "./EventManager";
import type { IWizardConfig, SetupWizardResult, IStepInstance } from "./types";
import { setupWizardInstance } from "./utils";
import { EVENTS } from "./contants";

/**
 * Main wizard instance that manages the entire wizard flow
 * Handles step navigation, state management, and event dispatching
 *
 * This class is the core of the wizard system and manages:
 * - Step navigation (next, previous, go to specific step)
 * - Step state management and persistence
 * - Event system for React integration
 * - Visibility control of wizard steps
 */
class WizardInstance {
  /** Event manager for handling wizard events and React integration */
  eventManager = new EventManager();
  /** Currently active step instance */
  activeStep: IStepInstance<any>;
  /** Map of all step instances by step name */
  stepsMap: { [key: string]: IStepInstance<any> };
  /** Map of currently visible step instances */
  visibleStepsMap: { [key: string]: IStepInstance<any> };
  /** Initial configuration for reset functionality */
  __INIT__: IWizardConfig;
  /** List of currently visible step names */
  visibleStepsList: string[];
  /** List of all step names */
  allStepsList: string[];
  /** Current index in the visible steps list */
  currentVisibleIndex: number;
  /** Whether the current step is the last visible step */
  isLast: boolean;
  /** Whether the current step is the first visible step */
  isFirst: boolean;
  /** Callback function called when wizard is completed */
  onFinish: (
    stepData: { [stepName: string]: any },
    success: () => void
  ) => void;
  /** Whether the wizard has been successfully completed */
  isSuccess: boolean = false;
  constructor({
    config,
    onFinish,
  }: {
    config: IWizardConfig;
    onFinish: (
      stepData: { [stepName: string]: any },
      success: () => void
    ) => void;
  }) {
    this.__INIT__ = structuredClone(config);
    const result = setupWizardInstance({
      config,
      eventManager: this.eventManager,
    });
    this.activeStep = result.activeStep;
    this.stepsMap = result.stepsMap;
    this.visibleStepsMap = result.visibleStepsMap;
    this.visibleStepsList = result.visibleStepsList;
    this.allStepsList = result.allStepsList;
    this.currentVisibleIndex = result.currentVisibleIndex;
    this.isLast = result.isLast;
    this.isFirst = result.isFirst;
    this.onFinish = onFinish;
    this.eventManager.subscribe(EVENTS.ON_STEP_NEXT, () => {
      this.nextStep();
    });
    this.eventManager.subscribe(EVENTS.ON_STEP_PREV, () => {
      this.prevStep();
    });
  }
  /**
   * Updates the visible steps and resets non-visible step instances
   * @param newSteps - Array of step names that should be visible
   */
  updateVisibleSteps = (newSteps: string[]) => {
    try {
      // Validate input
      if (!Array.isArray(newSteps)) {
        throw new Error("updateVisibleSteps: newSteps must be an array");
      }

      if (newSteps.length === 0) {
        throw new Error("updateVisibleSteps: newSteps cannot be empty");
      }

      // Create new visibleStepsMap based on the provided array
      this.visibleStepsMap = {};
      newSteps.forEach((stepName: string) => {
        if (this.stepsMap[stepName]) {
          this.visibleStepsMap[stepName] = this.stepsMap[stepName];
        } else {
          // Step not found in stepsMap
        }
      });

      // Reset step instances that are not in the new visibility map
      Object.keys(this.stepsMap).forEach((stepName: string) => {
        if (!newSteps.includes(stepName)) {
          try {
            this.stepsMap[stepName].reset();
          } catch (error) {
            // Failed to reset step
          }
        }
      });

      // Update visibleStepsList with the new steps array
      this.visibleStepsList = newSteps;

      // Recalculate currentVisibleIndex
      this.currentVisibleIndex = this.visibleStepsList.indexOf(
        this.activeStep.name
      );

      // Recalculate isFirst and isLast
      this.isFirst = this.currentVisibleIndex === 0;
      this.isLast =
        this.currentVisibleIndex === this.visibleStepsList.length - 1;
    } catch (error) {
      // Error updating visible steps
      // Dispatch error event
      this.eventManager.dispatch({
        type: "WIZARD_ERROR",
        payload: { error, method: "updateVisibleSteps" },
      });
    }
  };

  /**
   * Moves to the next step in the wizard flow
   * If on the last step, triggers the onFinish callback
   */
  nextStep = () => {
    try {
      const currentIndex = this.visibleStepsList.indexOf(this.activeStep.name);

      if (currentIndex === -1) {
        throw new Error("nextStep: Current step not found in visibleStepsList");
      }

      if (this.isLast) {
        // this.success();
        // Collect all step states by key
        const allStepStates: { [key: string]: any } = {};
        Object.keys(this.stepsMap).forEach((stepKey) => {
          try {
            allStepStates[stepKey] = this.stepsMap[stepKey].state;
          } catch (error) {
            // Failed to get state for step
            allStepStates[stepKey] = null;
          }
        });

        this.onFinish(allStepStates, this.success);
        return;
      }

      if (currentIndex < this.visibleStepsList.length - 1) {
        const nextStepName = this.visibleStepsList[currentIndex + 1];
        const nextStepInstance = this.stepsMap[nextStepName];

        if (nextStepInstance) {
          this.activeStep = nextStepInstance;
          this.currentVisibleIndex = currentIndex + 1;
          this.isLast = currentIndex + 1 === this.visibleStepsList.length - 1;
          this.isFirst = false;
        } else {
          throw new Error(
            `nextStep: Next step '${nextStepName}' not found in stepsMap`
          );
        }
      }

      this.eventManager.dispatch({
        type: EVENTS.ON_STEP_CHANGE,
        payload: this,
      });
    } catch (error) {
      // Error moving to next step
      this.eventManager.dispatch({
        type: "WIZARD_ERROR",
        payload: { error, method: "nextStep" },
      });
    }
  };

  /**
   * Moves to the previous step in the wizard flow
   * Resets current step state if it hasn't been initially completed
   */
  prevStep = () => {
    const currentIndex = this.visibleStepsList.indexOf(this.activeStep.name);
    if (currentIndex > 0) {
      const prevStepName = this.visibleStepsList[currentIndex - 1];
      const prevStepInstance = this.stepsMap[prevStepName];

      if (prevStepInstance) {
        this.activeStep = prevStepInstance;
        this.currentVisibleIndex = currentIndex - 1;
        this.isFirst = currentIndex - 1 === 0;
        this.isLast = false;
      }
    }
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_CHANGE,
      payload: this,
    });
  };

  /**
   * Navigates to a specific step by name
   * @param stepName - Name of the step to navigate to
   */
  goToStep = (stepName: string) => {
    try {
      // Validate input
      if (!stepName || typeof stepName !== "string") {
        throw new Error("goToStep: stepName must be a non-empty string");
      }

      // Check if step exists in visible steps
      if (!this.visibleStepsList.includes(stepName)) {
        throw new Error(`goToStep: Step '${stepName}' is not visible`);
      }

      // Check if step exists in steps map
      const stepInstance = this.stepsMap[stepName];
      if (!stepInstance) {
        throw new Error(
          `goToStep: Step '${stepName}' does not exist in stepsMap`
        );
      }

      // Update active step
      this.activeStep = stepInstance;

      // Update current visible index
      this.currentVisibleIndex = this.visibleStepsList.indexOf(stepName);

      // Update isFirst and isLast flags
      this.isFirst = this.currentVisibleIndex === 0;
      this.isLast =
        this.currentVisibleIndex === this.visibleStepsList.length - 1;

      // Dispatch step change event
      this.eventManager.dispatch({
        type: EVENTS.ON_STEP_CHANGE,
        payload: this,
      });
    } catch (error) {
      // Error navigating to step
      this.eventManager.dispatch({
        type: "WIZARD_ERROR",
        payload: { error, method: "goToStep", stepName },
      });
    }
  };

  /**
   * Marks the wizard as successfully completed
   * Triggers the success event
   */
  success = () => {
    this.isSuccess = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_SUCCESS,
    });
  };

  /**
   * Resets the wizard to its initial state
   * Recreates all step instances and resets all state
   */
  reset = () => {
    this.__INIT__ = structuredClone(this.__INIT__);
    const result = setupWizardInstance({
      config: this.__INIT__,
      eventManager: this.eventManager,
    });

    this.activeStep = result.activeStep;
    this.stepsMap = result.stepsMap;
    this.visibleStepsMap = result.visibleStepsMap;
    this.visibleStepsList = result.visibleStepsList;
    this.allStepsList = result.allStepsList;
    this.currentVisibleIndex = result.currentVisibleIndex;
    this.isLast = result.isLast;
    this.isFirst = result.isFirst;
    this.isSuccess = false;

    this.eventManager.dispatch({
      type: EVENTS.ON_RESET,
      payload: this,
    });
  };
}

export { WizardInstance };
