import { useEffect, useState, useSyncExternalStore } from "react";
import { WizardInstance } from "./WizardInstance";
import { EVENTS } from "./contants";
import type { IWizardConfig, IWizardInstance, WizardClient } from "./types";

/**
 * Creates a wizard instance with React hooks for state management
 * @param config - Initial wizard configuration
 * @param onStepChange - Callback function for step changes
 * @returns Object containing wizard hooks and components
 */
const createWizard = (config: IWizardConfig, onStepChange: any) => {
  let wizardInstance: IWizardInstance | undefined = undefined;
  /**
   * Hook for watching wizard state changes and triggering re-renders
   * Subscribes to various wizard events to keep React components in sync
   */
  const useWatch = () => {
    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(
          EVENTS.STEP_CHANGED,
          () => {
            callback();
          }
        );
      },
      () => {
        return wizardInstance?.activeStep.state;
      }
    );
    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(
          EVENTS.STEP_DATA_SET,
          () => {
            callback();
          }
        );
      },
      () => {
        return wizardInstance?.activeStep.getStepData();
      }
    );
    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(
          EVENTS.STEP_COMPLETED,
          () => {
            callback();
          }
        );
      },
      () => {
        return wizardInstance?.isSuccess;
      }
    );
    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(EVENTS.ON_RESET, () => {
          callback();
        });
      },
      () => {
        return wizardInstance?.isSuccess;
      }
    );

    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(EVENTS.ON_RESET, () => {
          callback();
        });
      },
      () => {
        return wizardInstance?.activeStep;
      }
    );
    useSyncExternalStore(
      (callback) => {
        return wizardInstance!.eventManager.subscribe(EVENTS.ON_SUCCESS, () => {
          callback();
        });
      },
      () => {
        return wizardInstance?.isSuccess;
      }
    );
  };
  return {
    /**
     * React component that provides wizard state to children
     * @param props - Component props
     * @param props.children - Render function that receives wizard client props
     * @param props.options - Configuration options for the wizard
     * @param props.options.onFinish - Callback function called when wizard is completed
     * @returns Rendered children with wizard state
     */
    WizardHander({
      children,
      options,
    }: {
      children: (props: WizardClient) => React.ReactNode;
      options: {
        onFinish: (success: () => void, stepData: any) => void;
      };
    }) {
      const [_] = useState(() => {
        wizardInstance = new WizardInstance(config, onStepChange, options);
      });

      useEffect(() => {
        if (wizardInstance) {
          wizardInstance.onFinish = options.onFinish;
        }
      });

      if (!wizardInstance) {
        throw new Error("Wizard instance not initialized");
      }

      const { __INIT__, eventManager, ...rest } = wizardInstance;
      useWatch();
      return children(rest);
    },
  };
};

export { createWizard };
