import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createWizard } from "./createWizard";
import { IWizardConfig } from "./types";

const WizzardContext = createContext<any>(null);
const WizzardProvider = ({
  children,
  config,
  onFinish,
}: {
  children: React.ReactNode;
  config: IWizardConfig;
  onFinish: (stepData: Record<string, any>, success: () => void) => void;
}) => {
  const [wizzard] = useState(() => {
    return createWizard(config);
  });
  useEffect(() => {
    if (onFinish) {
      wizzard.instance.onFinish = onFinish;
    }
  });
  return (
    <WizzardContext.Provider value={wizzard}>
      {children}
    </WizzardContext.Provider>
  );
};

const useWizzard = () => {
  return useContext(WizzardContext);
};
const useOnStepChange = () => {
  const wizzard = useWizzard();
  return useSyncExternalStore(
    (callback) => {
      return wizzard.instance!.eventManager.subscribe("ON_STEP_CHANGE", () => {
        callback();
      });
    },
    () => {
      return wizzard.instance?.activeStep.name;
    }
  );
};

const useOnSuccess = () => {
  const wizzard = useWizzard();
  return useSyncExternalStore(
    (callback) => {
      return wizzard.instance!.eventManager.subscribe("ON_SUCCESS", () => {
        callback();
      });
    },
    () => {
      return wizzard.instance?.isSuccess;
    }
  );
};

const useOnReset = () => {
  const wizzard = useWizzard();
  return useSyncExternalStore(
    (callback) => {
      return wizzard.instance!.eventManager.subscribe("ON_RESET", () => {
        callback();
      });
    },
    () => {
      return wizzard.instance?.activeStep.name;
    }
  );
};

const useOnStepComplete = () => {
  const wizzard = useWizzard();
  return useSyncExternalStore(
    (callback) => {
      return wizzard.instance!.eventManager.subscribe(
        "ON_STEP_COMPLETE",
        () => {
          callback();
        }
      );
    },
    () => {
      return wizzard.instance?.activeStep.isComplete;
    }
  );
};

const useWizardClient = () => {
  const wizzard = useWizzard();
  return wizzard.client;
};

const useStepState = (selector: any) => {
  const wizzard = useWizzard();
  const wizardInstance = wizzard.instance;

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
      wizardInstance?.activeStep.onNextStep(state);
    },
  };
};

export {
  useWizardClient,
  WizzardProvider,
  useWizzard,
  useStepState,
  useOnStepChange,
  useOnReset,
  useOnSuccess,
  useOnStepComplete,
};
