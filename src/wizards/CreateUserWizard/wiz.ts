import { createWizard } from "../../Wizard/createWizard";

const { WizardHander, client, useStepState, useWatchWizard } = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});

export { WizardHander, client, useStepState, useWatchWizard };
