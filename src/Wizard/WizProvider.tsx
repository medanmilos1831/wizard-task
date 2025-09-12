import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createWizard } from "./createWizard";
import { IWizardConfig } from "./types";
import { EVENTS } from "./contants";

const WizContext = createContext<any>(undefined);

const WizProvider = ({
  children,
  config,
  onFinish,
}: {
  children: React.ReactNode;
  config: IWizardConfig;
  onFinish: (stepData: Record<string, any>, success: () => void) => void;
}) => {
  const [entity] = useState(() => {
    return createWizard(config, onFinish);
  });
  useEffect(() => {
    entity.wizardInstance.onFinish = onFinish;
  }, [onFinish]);
  return <WizContext.Provider value={entity}>{children}</WizContext.Provider>;
};

const useOnStepChange = () => {
  const { wizardInstance } = useContext(WizContext);
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe(
        EVENTS.ON_STEP_CHANGE,
        () => {
          callback();
        }
      );
    },
    () => {
      return wizardInstance?.activeStep.name;
    }
  );
};

const useOnSuccess = () => {
  const { wizardInstance } = useContext(WizContext);
  return useSyncExternalStore(
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

const useOnReset = () => {
  const { wizardInstance } = useContext(WizContext);
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe(EVENTS.ON_RESET, () => {
        callback();
      });
    },
    () => {
      return wizardInstance?.activeStep;
    }
  );
};

const useOnStepComplete = () => {
  const { wizardInstance } = useContext(WizContext);
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe(
        EVENTS.ON_STEP_COMPLETE,
        () => {
          callback();
        }
      );
    },
    () => {
      return wizardInstance?.activeStep.isComplete;
    }
  );
};

const useStepState = (selector: any) => {
  const { wizardInstance } = useContext(WizContext);
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
        wizardInstance!.activeStep.setState(value);
        return value;
      });
    },
    nextStep: () => {
      wizardInstance?.activeStep.onNextStep();
    },
  };
};

const useClient = () => {
  const { client } = useContext(WizContext);
  return client;
};

export {
  useClient,
  useOnReset,
  useOnStepChange,
  useOnStepComplete,
  useOnSuccess,
  useStepState,
  WizProvider,
};
