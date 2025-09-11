import { useOnReset, useOnStepChange } from "../createUserWizzard";
import {
  AccountTypeStep,
  AddPlanStep,
  InformationStep,
  PlanStep,
} from "../steps";

import { PropsWithChildren } from "react";

export const StepView = ({ children }: { children: (props: any) => any }) => {
  const stepname = useOnStepChange();
  useOnReset();
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
