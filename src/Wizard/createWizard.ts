import { Client } from "./Client";
import type { IWizardConfig, IWizardInstance } from "./types";
import { WizardInstance } from "./WizardInstance";

function createWizard(
  config: IWizardConfig,
  onFinish: (stepData: Record<string, any>, success: () => void) => void
) {
  const wizardInstance: IWizardInstance | undefined = new WizardInstance({
    config,
    onFinish,
  });
  const client = new Client(wizardInstance);
  return {
    wizardInstance,
    client,
  };
}

export { createWizard };
