import { createWizard } from "../../Wizard/createWizard";

const UserWizard = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});

export { UserWizard };
