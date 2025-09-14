import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";
import { EVENTS } from "./contants";
import { createWizard } from "./createWizard";

const Context = createContext<ReturnType<typeof createWizard> | undefined>(
  undefined
);

const Provider = ({
  children,
  value,
  onFinish,
}: PropsWithChildren<{
  value: ReturnType<typeof createWizard>;
  onFinish: (
    stepsStateMap: { [key: string]: any },
    success: () => void
  ) => void;
}>) => {
  useEffect(() => {
    const unsubscribe = value.subscribe(EVENTS.ON_FINISH, () => {
      onFinish(value.getAllStepsState(), value.completeWizard);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useOnSuccess = () => {
  const instance = useContext(Context)!;
  return useSyncExternalStore(
    (callback) => {
      return instance.subscribe(EVENTS.ON_SUCCESS, () => {
        callback();
      });
    },
    () => {
      return instance.isWizardCompleted();
    }
  );
};

const useWizardClient = () => {
  const context = useContext(Context)!;
  return context;
};

const useOnStepChange = () => {
  const instance = useContext(Context)!;
  return useSyncExternalStore(
    (callback) => {
      return instance.subscribe("CHANGED_STEP", ({ detail }: any) => {
        callback();
      });
    },
    () => {
      return instance.getCurrentStep().name;
    }
  );
};

const useOnReset = () => {
  const instance = useContext(Context)!;
  return useSyncExternalStore(
    (callback) => {
      return instance.subscribe(EVENTS.ON_RESET, () => {
        callback();
      });
    },
    () => {
      return instance.getCurrentStep().name;
    }
  );
};

const useOnStepComplete = () => {
  const instance = useContext(Context)!;

  return useSyncExternalStore(
    (callback) => {
      return instance.subscribe(EVENTS.ON_STEP_COMPLETE, () => {
        callback();
      });
    },
    () => {
      return instance.getCurrentStep().isComplete;
    }
  );
};

const useStepState = (selector: any) => {
  const instance = useContext(Context)!;
  const [state, setState] = useState(() => {
    return selector(instance.getCurrentStep().state);
  });

  return {
    state,
    setState(callback: (state: any) => any) {
      setState((prev: any) => {
        const value = callback(prev);
        instance.getCurrentStep().setState(value);
        return value;
      });
    },
  };
};
export {
  Provider,
  useWizardClient,
  useOnStepChange,
  useOnStepComplete,
  useOnReset,
  useStepState,
  useOnSuccess,
};
