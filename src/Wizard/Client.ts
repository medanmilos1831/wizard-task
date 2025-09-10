class Client {
  private wizardInstance: any;
  constructor(wizardInstance: any) {
    this.wizardInstance = wizardInstance;
  }
  /** Gets visible steps with completion status */
  getVisibleSteps = () => {
    if (!this.wizardInstance?.visibleStepsList) return [];
    return this.wizardInstance.visibleStepsList.map((stepName: string) => ({
      stepName,
      isComplete: this.wizardInstance?.stepsMap[stepName]?.isComplete || false,
    }));
  };
  /** Navigates to a specific step */
  goToStep = (stepName: string) => {
    try {
      if (!stepName || typeof stepName !== "string") {
        throw new Error("goToStep: stepName must be a non-empty string");
      }
      this.wizardInstance?.goToStep(stepName);
    } catch (error) {
      // Error handled silently
    }
  };
  /** Gets number of completed steps */
  getNumberOfCompletedSteps = () => {
    if (!this.wizardInstance) return 0;
    return Object.values(this.wizardInstance.stepsMap).filter(
      (step: any) => step.isComplete
    ).length;
  };
  /** Gets current step completion status */
  getIsComplete = () => this.wizardInstance?.activeStep.isComplete || false;
  /** Gets current active step name */
  getActiveStepName = () => this.wizardInstance?.activeStep.name || null;
  /** Moves to next step */
  onNextStep = () => this.wizardInstance?.activeStep.onNextStep();
  /** Moves to previous step */
  onPrevStep = () => this.wizardInstance?.activeStep.onPrevStep();
  /** Sets step state */
  setState = (value: any) => this.wizardInstance?.activeStep.setState(value);
  /** Gets current step completion status */
  getIsStepComplete = () => this.wizardInstance?.activeStep.isComplete || false;
  /** Gets current step visibility */
  getIsStepVisible = () => this.wizardInstance?.activeStep.isVisible || false;
  /** Marks current step as complete */
  setStepComplete = () => {
    this.wizardInstance?.activeStep.setStepComplete();
  };
  /** Gets initial completion status */
  getInitialComplete = () =>
    this.wizardInstance?.activeStep.initialComplete || false;
  /** Gets step changed status */
  getIsStepChanged = () => this.wizardInstance?.activeStep.isChanged || false;
  /** Sets step changed status */
  setIsStepChanged = (isChanged: boolean) =>
    this.wizardInstance?.activeStep.setIsChanged(isChanged);
  /** Checks if current step is first */
  getIsFirst = () => this.wizardInstance?.isFirst || false;
  /** Checks if current step is last */
  getIsLast = () => this.wizardInstance?.isLast || false;
  /** Checks if wizard is successful */
  getIsSuccess = () => this.wizardInstance?.isSuccess || false;
  /** Resets the entire wizard */
  reset = () => this.wizardInstance?.reset();
  /** Marks wizard as successful */
  success = () => this.wizardInstance?.success();
  /** Gets state by step name */
  getStateByStepName = (name: string) =>
    this.wizardInstance?.stepsMap[name]?.state || null;
  /** Gets current step state */
  getStepState = () => this.wizardInstance?.activeStep.state || null;
  /** Gets previous step state */
  getPrevStepState = () => this.wizardInstance?.activeStep.prevState || null;
  /** Gets previous state */
  getPrevState = () => this.wizardInstance?.activeStep.prevState || null;
  /** Gets previous state by step name */
  getPrevStateByStepName = (name: string) =>
    this.wizardInstance?.stepsMap[name]?.prevState || null;
  /** Gets changed status by step name */
  getIsChangedByStepName = (name: string) =>
    this.wizardInstance?.stepsMap[name]?.isChanged || false;
  /** Sets changed status by step name */
  setIsChangedByStepName = (name: string, isChanged: boolean) => {
    this.wizardInstance?.stepsMap[name]?.setIsChanged(isChanged);
  };
  /** Updates visible steps */
  updateVisibleSteps = (newSteps: string[]) => {
    try {
      if (!Array.isArray(newSteps)) {
        throw new Error("updateVisibleSteps: newSteps must be an array");
      }
      this.wizardInstance?.updateVisibleSteps(newSteps);
    } catch (error) {
      // Error handled silently
    }
  };
  /** Gets all steps ahead of current step */
  getAheadSteps = () => {
    if (
      !this.wizardInstance?.visibleStepsList ||
      !this.wizardInstance?.activeStep
    )
      return [];
    const currentIndex = this.wizardInstance.visibleStepsList.indexOf(
      this.wizardInstance.activeStep.name
    );
    const aheadSteps = this.wizardInstance.visibleStepsList.slice(
      currentIndex + 1
    );
    return aheadSteps.map((stepName: string) => ({
      stepName,
      stepInstance: this.wizardInstance!.stepsMap[stepName],
      isComplete: this.wizardInstance!.stepsMap[stepName]?.isComplete || false,
    }));
  };
}

export { Client };
