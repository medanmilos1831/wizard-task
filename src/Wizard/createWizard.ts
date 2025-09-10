import { useEffect } from "react";
import type { IWizardConfig, IWizardInstance, WizardClient } from "./types";
import { useStepState } from "./hooks/useStepState";
import { WizardInstance } from "./WizardInstance";
import { useWatchWizard } from "./hooks/useWatch";
import { Client } from "./Client";

/**
 * Creates a wizard instance with React hooks for state management
 * This is the main factory function that sets up the wizard system
 *
 * @param config - Initial wizard configuration containing steps and settings
 * @returns Object containing wizard hooks and components for React integration
 */
const createWizard = (config: IWizardConfig) => {
  const wizardInstance: IWizardInstance | undefined = new WizardInstance({
    config,
    onFinish: () => {},
  });
  /**
   * Internal hook for watching wizard state changes and triggering re-renders
   * Subscribes to various wizard events to keep React components in sync
   * This ensures the UI updates when wizard state changes
   */
  const useWatch = () => {
    useWatchWizard(wizardInstance, "ON_RESET", (wizardInstance: any) => {
      return wizardInstance.activeStep;
    });
    useWatchWizard(wizardInstance, "ON_SUCCESS", (wizardInstance: any) => {
      return wizardInstance.isSuccess;
    });
    useWatchWizard(wizardInstance, "ON_STEP_CHANGE", (wizardInstance: any) => {
      return wizardInstance?.activeStep.name;
    });
  };

  return {
    useWatchWizard: (event: string, callback: (wizardInstance: any) => any) => {
      return useWatchWizard(wizardInstance, event, callback);
    },
    /** Hook for accessing and updating step state with selector function */
    useStepState: <T>(selector: (state: Record<string, any>) => T) =>
      useStepState(selector, wizardInstance),
    /** Client object with all wizard methods and computed values */
    client: new Client(wizardInstance),
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
