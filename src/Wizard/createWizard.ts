import { useEffect, useState } from "react";
import type { IWizardConfig, IWizardInstance, WizardClient } from "./types";

import { useOnChangeStep } from "./hooks/useOnChangeStep";
import { useOnReset } from "./hooks/useOnReset";
import { useOnStepChange } from "./hooks/useOnStepChange";
import { useOnSuccess } from "./hooks/useOnSuccess";

import { useStepComplete } from "./hooks/useStepComplete";
import { useStepState } from "./hooks/useStepState";
import { WizardInstance } from "./WizardInstance";

/**
 * Creates a wizard instance with React hooks for state management
 * This is the main factory function that sets up the wizard system
 *
 * @param config - Initial wizard configuration containing steps and settings
 * @returns Object containing wizard hooks and components for React integration
 */
const createWizard = (config: IWizardConfig) => {
  let wizardInstance: IWizardInstance | undefined = undefined;
  /**
   * Internal hook for watching wizard state changes and triggering re-renders
   * Subscribes to various wizard events to keep React components in sync
   * This ensures the UI updates when wizard state changes
   */
  const useWatch = () => {
    useOnReset(wizardInstance);
    useOnSuccess(wizardInstance);
    useOnChangeStep(wizardInstance);
  };

  return {
    /** Hook for accessing and updating step state with selector function */
    useStepState: <T>(selector: (state: Record<string, any>) => T) =>
      useStepState(selector, wizardInstance),
    /** Client object with all wizard methods and computed values */
    client: {
      /** Gets visible steps with completion status */
      getVisibleSteps: () => {
        if (!wizardInstance?.visibleStepsList) return [];
        return wizardInstance.visibleStepsList.map((stepName: string) => ({
          stepName,
          isComplete: wizardInstance?.stepsMap[stepName]?.isComplete || false,
        }));
      },
      /** Navigates to a specific step */
      goToStep: (stepName: string) => {
        try {
          if (!stepName || typeof stepName !== "string") {
            throw new Error("goToStep: stepName must be a non-empty string");
          }
          wizardInstance?.goToStep(stepName);
        } catch (error) {
          console.error("client.goToStep: Error:", error);
        }
      },
      /** Gets number of completed steps */
      getNumberOfCompletedSteps: () => {
        if (!wizardInstance) return 0;
        return Object.values(wizardInstance.stepsMap).filter(
          (step: any) => step.isComplete
        ).length;
      },
      /** Gets current step completion status */
      getIsComplete: () => wizardInstance?.activeStep.isComplete || false,
      /** Gets current active step name */
      getActiveStepName: () => wizardInstance?.activeStep.name || null,
      /** Moves to next step */
      onNextStep: () => wizardInstance?.activeStep.onNextStep(),
      /** Moves to previous step */
      onPrevStep: () => wizardInstance?.activeStep.onPrevStep(),
      /** Sets step state */
      setState: (value: any) => wizardInstance?.activeStep.setState(value),
      /** Gets current step completion status */
      getIsStepComplete: () => wizardInstance?.activeStep.isComplete || false,
      /** Gets current step visibility */
      getIsStepVisible: () => wizardInstance?.activeStep.isVisible || false,
      /** Marks current step as complete */
      setStepComplete: () => wizardInstance?.activeStep.setStepComplete(),
      /** Gets initial completion status */
      getInitialComplete: () =>
        wizardInstance?.activeStep.initialComplete || false,
      /** Gets step changed status */
      getIsStepChanged: () => wizardInstance?.activeStep.isChanged || false,
      /** Sets step changed status */
      setIsStepChanged: (isChanged: boolean) =>
        wizardInstance?.activeStep.setIsChanged(isChanged),
      /** Checks if current step is first */
      getIsFirst: () => wizardInstance?.isFirst || false,
      /** Checks if current step is last */
      getIsLast: () => wizardInstance?.isLast || false,
      /** Checks if wizard is successful */
      getIsSuccess: () => wizardInstance?.isSuccess || false,
      /** Resets the entire wizard */
      reset: () => wizardInstance?.reset(),
      /** Marks wizard as successful */
      success: () => wizardInstance?.success(),
      /** Gets state by step name */
      getStateByStepName: (name: string) =>
        wizardInstance?.stepsMap[name]?.state || null,
      /** Gets current step state */
      getStepState: () => wizardInstance?.activeStep.state || null,
      /** Gets previous step state */
      getPrevStepState: () => wizardInstance?.activeStep.prevState || null,
      /** Gets previous state */
      getPrevState: () => wizardInstance?.activeStep.prevState || null,
      /** Gets previous state by step name */
      getPrevStateByStepName: (name: string) =>
        wizardInstance?.stepsMap[name]?.prevState || null,
      /** Gets changed status by step name */
      getIsChangedByStepName: (name: string) =>
        wizardInstance?.stepsMap[name]?.isChanged || false,
      /** Sets changed status by step name */
      setIsChangedByStepName: (name: string, isChanged: boolean) => {
        wizardInstance?.stepsMap[name]?.setIsChanged(isChanged);
      },
      /** Updates visible steps */
      updateVisibleSteps: (newSteps: string[]) => {
        try {
          if (!Array.isArray(newSteps)) {
            throw new Error("updateVisibleSteps: newSteps must be an array");
          }
          wizardInstance?.updateVisibleSteps(newSteps);
        } catch (error) {
          console.error("client.updateVisibleSteps: Error:", error);
        }
      },
      /** Gets all steps ahead of current step */
      getAheadSteps: () => {
        if (!wizardInstance?.visibleStepsList || !wizardInstance?.activeStep)
          return [];
        const currentIndex = wizardInstance.visibleStepsList.indexOf(
          wizardInstance.activeStep.name
        );
        const aheadSteps = wizardInstance.visibleStepsList.slice(
          currentIndex + 1
        );
        return aheadSteps.map((stepName: string) => ({
          stepName,
          stepInstance: wizardInstance!.stepsMap[stepName],
          isComplete: wizardInstance!.stepsMap[stepName]?.isComplete || false,
        }));
      },
    },
    /** Hook for checking if current step is complete */
    useStepComplete: () => useStepComplete(wizardInstance),
    /** Hook for listening to step change events */
    useOnStepChange: () => useOnStepChange(wizardInstance),
    /**
     * React component for wizard navigation (legacy component)
     * @param props - Component props
     * @param props.children - Render function that receives wizard client props
     * @returns Rendered children with wizard state
     * @deprecated Use WizardHander instead
     */
    WizzardNavigation({
      children,
    }: {
      children: (props: WizardClient) => React.ReactNode;
    }) {
      return wizardInstance ? children(wizardInstance) : null;
    },
    /**
     * Main wizard handler component that manages the entire wizard lifecycle
     * @param props - Component props
     * @param props.children - Render function that receives wizard client props
     * @param props.onFinish - Callback function called when wizard is completed
     * @returns Rendered children with wizard state and lifecycle management
     */
    WizardHander({
      children,
      onFinish,
    }: {
      children: (props: WizardClient) => React.ReactNode;
      onFinish: (stepData: Record<string, any>, success: () => void) => void;
    }) {
      const [_] = useState(() => {
        wizardInstance = new WizardInstance({
          config,
          onFinish,
        });
      });
      useEffect(() => {
        if (wizardInstance) {
          wizardInstance.onFinish = onFinish;
        }
      });
      useWatch();
      return wizardInstance ? children(wizardInstance) : null;
    },
  };
};

export { createWizard };
