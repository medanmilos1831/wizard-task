import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";
import { EVENTS } from "./contants";

const Context = createContext<any>(undefined);

const Provider = ({
  children,
  value,
  onFinish,
}: PropsWithChildren<{
  value: any;
  onFinish: (stepsStateMap: any, success: () => void) => void;
}>) => {
  useEffect(() => {
    value.eventManager.subscribe(EVENTS.ON_LAST_STEP, () => {
      onFinish(value.api.getStepsStateMap(), value.success);
    });
  });
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useOnSuccess = () => {
  const instance = useContext(Context) as any;
  return useSyncExternalStore(
    (callback) => {
      return instance.eventManager.subscribe(EVENTS.ON_SUCCESS, () => {
        callback();
      });
    },
    () => {
      return instance.isSuccess;
    }
  );
};

const useWizzard = () => {
  const context = useContext(Context);
  return context.api;
};

const useOnStepChange = () => {
  const instance = useContext(Context) as any;
  return useSyncExternalStore(
    (callback) => {
      return instance.eventManager.subscribe(
        "CHANGED_STEP",
        ({ detail }: any) => {
          callback();
        }
      );
    },
    () => {
      return instance.activeStep.name;
    }
  );
};

const useOnReset = () => {
  const instance = useContext(Context) as any;
  return useSyncExternalStore(
    (callback) => {
      return instance.eventManager.subscribe(EVENTS.ON_RESET, () => {
        callback();
      });
    },
    () => {
      return instance.activeStep.name;
    }
  );
};

const useOnStepComplete = () => {
  const instance = useContext(Context) as any;

  return useSyncExternalStore(
    (callback) => {
      return instance.eventManager.subscribe(EVENTS.ON_STEP_COMPLETE, () => {
        callback();
      });
    },
    () => {
      return instance.activeStep.isComplete;
    }
  );
};

const useStepState = (selector: any) => {
  const instance = useContext(Context) as any;
  const [state, setState] = useState(() => {
    return selector(
      instance.activeStep.state,
      (() => {
        const visibleStepsStates: { [key: string]: any } = {};
        const visibleStepsList = Object.keys(instance.visibleStepsMap);
        visibleStepsList.forEach((stepName: string) => {
          if (stepName !== instance.activeStep.name) {
            const stepInstance = instance.stepsMap[stepName];
            if (stepInstance) {
              visibleStepsStates[stepName] = stepInstance.state;
            }
          }
        });
        return visibleStepsStates;
      })()
    );
  });

  return {
    state,
    setState(callback: (state: any) => any) {
      setState((prev: any) => {
        const value = callback(prev);
        instance.activeStep.setState(value);
        return value;
      });
    },
    nextStep: () => {
      instance.activeStep.onNextStep();
    },
  };
};
export {
  Provider,
  useWizzard,
  useOnStepChange,
  useOnStepComplete,
  useOnReset,
  useStepState,
  useOnSuccess,
};
