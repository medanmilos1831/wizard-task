import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Client } from "./Client";
import type { IWizardConfig, IWizardInstance } from "./types";
import { WizardInstance } from "./WizardInstance";

const createWizard = (config: IWizardConfig) => {
  const wizardInstance: IWizardInstance | undefined = new WizardInstance({
    config,
    onFinish: () => {},
  });
  const client = new Client(wizardInstance);
  const Context = createContext({
    wizardInstance,
    client,
  });
  const useOnStepChange = () => {
    const wizzard = useContext(Context);
    return useSyncExternalStore(
      (callback) => {
        return wizzard.wizardInstance!.eventManager.subscribe(
          "ON_STEP_CHANGE",
          () => {
            callback();
          }
        );
      },
      () => {
        return wizzard.wizardInstance?.activeStep.name;
      }
    );
  };

  const useOnSuccess = () => {
    const wizzard = useContext(Context);
    return useSyncExternalStore(
      (callback) => {
        return wizzard.wizardInstance!.eventManager.subscribe(
          "ON_SUCCESS",
          () => {
            callback();
          }
        );
      },
      () => {
        return wizzard.wizardInstance?.isSuccess;
      }
    );
  };

  const useOnReset = () => {
    const wizzard = useContext(Context);
    return useSyncExternalStore(
      (callback) => {
        return wizzard.wizardInstance!.eventManager.subscribe(
          "ON_RESET",
          () => {
            callback();
          }
        );
      },
      () => {
        return wizzard.wizardInstance?.activeStep;
      }
    );
  };

  const useOnStepComplete = () => {
    const wizzard = useContext(Context);
    return useSyncExternalStore(
      (callback) => {
        return wizzard.wizardInstance!.eventManager.subscribe(
          "ON_STEP_COMPLETE",
          () => {
            callback();
          }
        );
      },
      () => {
        return wizzard.wizardInstance?.activeStep.isComplete;
      }
    );
  };

  const useStepState = (selector: any) => {
    const wizzard = useContext(Context);
    const wizardInstance = wizzard.wizardInstance;

    const [state, setState] = useState(() => {
      return selector(
        wizardInstance?.activeStep.state,
        (() => {
          const visibleStepsStates: { [key: string]: any } = {};
          if (wizardInstance?.visibleStepsList) {
            wizardInstance.visibleStepsList.forEach((stepName: string) => {
              if (stepName !== wizardInstance?.activeStep?.name) {
                const stepInstance = wizardInstance.stepsMap[stepName];
                if (stepInstance) {
                  visibleStepsStates[stepName] = stepInstance.state;
                }
              }
            });
          }
          return visibleStepsStates;
        })()
      );
    });

    return {
      state,
      setState(callback: (state: any) => any) {
        setState((prev: any) => {
          const value = callback(prev);
          wizardInstance.activeStep.setState(value);
          return value;
        });
      },
      nextStep: () => {
        wizardInstance?.activeStep.onNextStep();
      },
    };
  };
  return {
    Wizard: ({
      children,
      onFinish,
    }: {
      children: React.ReactNode;
      onFinish: (stepData: Record<string, any>, success: () => void) => void;
    }) => {
      useEffect(() => {
        if (wizardInstance) {
          wizardInstance.onFinish = onFinish;
        }
      });
      return createElement(Context.Provider, {
        value: { wizardInstance, client },
        children,
      });
    },
    useWizardClient: () => {
      return useContext(Context).client;
    },
    useWizardInstance: () => {
      return useContext(Context).wizardInstance;
    },
    useOnStepChange: () => {
      return useOnStepChange();
    },
    useOnSuccess: () => {
      return useOnSuccess();
    },
    useOnReset: () => {
      return useOnReset();
    },
    useOnStepComplete: () => {
      return useOnStepComplete();
    },
    useStepState: (selector: any) => {
      return useStepState(selector);
    },
  };
};

export { createWizard };
