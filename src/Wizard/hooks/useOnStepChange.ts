import { useSyncExternalStore } from "react";

export const useOnStepChange = (wizardInstance: any) => {
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe("ON_STEP_CHANGE", () => {
        callback();
      });
    },
    () => {
      return wizardInstance?.activeStep.name;
    }
  );
};
