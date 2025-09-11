import {
  AccountTypeStep,
  AddPlanStep,
  InformationStep,
  PlanStep,
} from "../steps";
import { useWatchWizard } from "../../../Wizard/WizzardProvider";
import { PropsWithChildren } from "react";

export const StepView = ({ children }: { children: (props: any) => any }) => {
  const stepname = useWatchWizard("ON_STEP_CHANGE", (wizardInstance: any) => {
    return wizardInstance?.activeStep.name;
  });
  useWatchWizard("ON_RESET", (wizardInstance: any) => {
    return wizardInstance?.activeStep;
  });
  const ViewsMap: any = {
    ["accountType"]: ({ children }: PropsWithChildren) => (
      <AccountTypeStep>
        <>{children}</>
      </AccountTypeStep>
    ),
    ["plan"]: ({ children }: PropsWithChildren) => (
      <PlanStep>{children}</PlanStep>
    ),
    ["addPlan"]: ({ children }: PropsWithChildren) => (
      <AddPlanStep>{children}</AddPlanStep>
    ),
    ["information"]: ({ children }: PropsWithChildren) => (
      <InformationStep>{children}</InformationStep>
    ),
  };

  return (
    <>{children({ Component: ViewsMap[stepname], activeStep: stepname })}</>
  );
};
