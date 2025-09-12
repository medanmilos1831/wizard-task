import { EVENTS } from "./contants";
import { EventManager } from "./EventManager";
import { StepInstance } from "./StepInstance";
import type { IWizardConfig } from "./types";

class WizardInstance {
  private eventManager = new EventManager();
  public activeStep: any;
  private stepsMap: any = {};
  protected visibleStepsMap: any;
  private isLast: boolean = false;
  private isFirst: boolean = false;
  private isSuccess: boolean = false;

  private __INIT__: any;
  constructor(private config: IWizardConfig) {
    this.__INIT__ = structuredClone(config);
    this.config.stepsKeys.forEach((stepKey) => {
      this.stepsMap[stepKey] = new StepInstance(this.eventManager, stepKey);
    });
    this.activeStep = this.stepsMap[this.config.activeStep];
    this.visibleStepsMap = {};
    this.config.visibleSteps.forEach((stepKey) => {
      this.visibleStepsMap[stepKey] = this.stepsMap[stepKey];
    });
    this.eventManager.subscribe(EVENTS.ON_STEP_CHANGE, ({ detail }) => {
      this.changeStep(detail);
    });
  }
  changeStep = (detail: "next" | "prev") => {
    const currentIndex = Object.values(this.visibleStepsMap).indexOf(
      this.activeStep
    );
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    let name;
    if (detail === "next") {
      const nextStepName =
        currentIndex < visibleStepsList.length - 1
          ? visibleStepsList[currentIndex + 1]
          : null;
      const nextStepInstance = nextStepName
        ? this.visibleStepsMap[nextStepName]
        : null;
      const nextStepNameValue = nextStepInstance ? nextStepInstance.name : null;
      name = nextStepNameValue;
    } else if (detail === "prev") {
      const prevStepName =
        currentIndex > 0 ? visibleStepsList[currentIndex - 1] : null;
      const prevStepInstance = prevStepName
        ? this.visibleStepsMap[prevStepName]
        : null;
      const prevStepNameValue = prevStepInstance ? prevStepInstance.name : null;
      name = prevStepNameValue;
    }
    this.goToStep(name);
  };

  goToStep = (stepName: string, force: boolean = false) => {
    if (this.isLast && !force) {
      this.eventManager.dispatch({
        type: EVENTS.ON_LAST_STEP,
        payload: this,
      });
      return;
    }
    if (!stepName) {
      return;
    }
    const stepInstance = this.visibleStepsMap[stepName];
    this.activeStep = stepInstance;
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(stepName);
    this.isFirst = currentVisibleIndex === 0;
    this.isLast = currentVisibleIndex === visibleStepsList.length - 1;
    this.eventManager.dispatch({
      type: "CHANGED_STEP",
      payload: stepName,
    });
  };

  updateVisibleSteps = (newSteps: string[]) => {
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

    // Recalculate isFirst and isLast based on new visibleStepsMap
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(this.activeStep.name);

    this.isFirst = currentVisibleIndex === 0;
    this.isLast = currentVisibleIndex === visibleStepsList.length - 1;
  };
  getIsFirst = () => {
    return this.isFirst;
  };
  getIsLast = () => {
    return this.isLast;
  };
  reset = () => {
    // Reset to initial configuration
    this.config = structuredClone(this.__INIT__);

    // Recreate stepsMap
    this.stepsMap = {};
    this.config.stepsKeys.forEach((stepKey) => {
      this.stepsMap[stepKey] = new StepInstance(this.eventManager, stepKey);
    });

    // Set active step
    this.activeStep = this.stepsMap[this.config.activeStep];

    // Recreate visibleStepsMap
    this.visibleStepsMap = {};
    this.config.visibleSteps.forEach((stepKey) => {
      this.visibleStepsMap[stepKey] = this.stepsMap[stepKey];
    });

    // Reset flags
    this.isFirst = false;
    this.isLast = false;
    this.isSuccess = false;

    // Recalculate isFirst and isLast
    const visibleStepsList = Object.keys(this.visibleStepsMap);
    const currentVisibleIndex = visibleStepsList.indexOf(this.activeStep.name);
    this.isFirst = currentVisibleIndex === 0;
    this.isLast = currentVisibleIndex === visibleStepsList.length - 1;

    this.eventManager.dispatch({
      type: EVENTS.ON_RESET,
      payload: this,
    });
  };

  success = () => {
    this.isSuccess = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_SUCCESS,
    });
  };
}

export { WizardInstance };
