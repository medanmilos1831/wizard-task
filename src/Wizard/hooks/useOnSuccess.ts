import { useSyncExternalStore } from "react";

const useOnSuccess = (wizardInstance: any) => {
  useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe("ON_SUCCESS", () => {
        callback();
      });
    },
    () => {
      return wizardInstance?.isSuccess;
    }
  );
};

export { useOnSuccess };
