import { createWizard } from "../../Wizard/createWizard";

const {
  Wizard,
  useWizardInstance,
  useWizardClient,
  useOnStepChange,
  useOnSuccess,
  useOnReset,
  useOnStepComplete,
  useStepState,
} = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});

export {
  Wizard,
  useWizardInstance,
  useWizardClient,
  useOnStepChange,
  useOnSuccess,
  useOnReset,
  useOnStepComplete,
  useStepState,
};
