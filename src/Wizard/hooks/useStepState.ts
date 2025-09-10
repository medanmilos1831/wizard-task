import { useState } from "react";

export const useStepState = (selector: any, wizardInstance: any) => {
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
