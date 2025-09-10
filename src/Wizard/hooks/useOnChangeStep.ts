import { useSyncExternalStore } from "react";

const useOnChangeStep = (wizardInstance: any) => {
  useSyncExternalStore(
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

export { useOnChangeStep };
