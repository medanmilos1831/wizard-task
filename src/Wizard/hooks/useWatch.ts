import { useSyncExternalStore } from "react";

const useWatchWizard = (
  wizardInstance: any,
  event: string,
  callback: (wizardInstance: any) => any
) => {
  return useSyncExternalStore(
    (callback) => {
      return wizardInstance!.eventManager.subscribe(event, () => {
        callback();
      });
    },
    () => {
      return callback(wizardInstance);
    }
  );
};

export { useWatchWizard };
