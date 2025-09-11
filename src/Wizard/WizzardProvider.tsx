import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

const WizzardContext = createContext<any>(null);
const WizzardProvider = ({
  children,
  wizzard,
  onFinish,
}: {
  children: React.ReactNode;
  wizzard: any;
  onFinish: (stepData: Record<string, any>, success: () => void) => void;
}) => {
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

const useWatchWizard = (
  event: string,
  callback: (wizardInstance: any) => any
) => {
  const wizzard = useWizzard();
  return useSyncExternalStore(
    (callback) => {
      return wizzard.instance!.eventManager.subscribe(event, () => {
        callback();
      });
    },
    () => {
      return callback(wizzard.instance);
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
  useWatchWizard,
  useWizardClient,
  WizzardProvider,
  useWizzard,
  useStepState,
};
