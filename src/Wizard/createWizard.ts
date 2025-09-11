import { Client } from "./Client";
import type { IWizardConfig, IWizardInstance } from "./types";
import { WizardInstance } from "./WizardInstance";

/**
 * Creates a wizard instance with React hooks for state management
 * This is the main factory function that sets up the wizard system
 *
 * @param config - Initial wizard configuration containing steps and settings
 * @returns Object containing wizard hooks and components for React integration
 */
const createWizard = (config: IWizardConfig) => {
  const wizardInstance: IWizardInstance | undefined = new WizardInstance({
    config,
    onFinish: () => {},
  });
  return {
    instance: wizardInstance,
    client: new Client(wizardInstance),
  };
};

export { createWizard };
