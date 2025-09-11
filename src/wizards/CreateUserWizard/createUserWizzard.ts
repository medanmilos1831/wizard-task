import { createWizard } from "../../Wizard/createWizard";

const {
  Wizard,
  useOnStepChange,
  useOnSuccess,
  useOnReset,
  useOnStepComplete,
  useStepState,
  client,
} = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});

export {
  Wizard,
  useOnStepChange,
  useOnSuccess,
  useOnReset,
  useOnStepComplete,
  useStepState,
  client,
};
