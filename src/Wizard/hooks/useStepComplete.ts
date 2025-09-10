import { useSyncExternalStore } from "react";

export const useStepComplete = (wizardInstance: any) => {
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe("ON_STEP_COMPLETE", () => {
        callback();
      });
    },
    () => {
      return wizardInstance?.activeStep.isComplete;
    }
  );
};
