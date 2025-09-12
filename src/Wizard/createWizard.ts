import type { IWizardConfig } from "./types";
import { WizzardClient } from "./WizzardClient";

function createWizard(config: IWizardConfig) {
  return new WizzardClient(config);
}

export { createWizard };
