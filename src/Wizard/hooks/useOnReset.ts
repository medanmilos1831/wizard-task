import { useSyncExternalStore } from "react";

const useOnReset = (wizardInstance: any) => {
  useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe("ON_RESET", () => {
        callback();
      });
    },
    () => {
      return wizardInstance?.activeStep;
    }
  );
};

export { useOnReset };
