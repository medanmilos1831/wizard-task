import { createWizard } from "../../Wizard/createWizard";

const { WizardHander, client, useStepState, useStepComplete, useOnStepChange } =
  createWizard({
    activeStep: "accountType",
    stepsKeys: ["accountType", "plan", "addPlan", "information"],
    visibleSteps: ["accountType", "plan"],
  });

export { WizardHander, client, useStepState, useStepComplete, useOnStepChange };
