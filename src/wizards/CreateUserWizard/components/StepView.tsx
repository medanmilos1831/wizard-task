import {
  AccountTypeStep,
  AddPlanStep,
  InformationStep,
  PlanStep,
} from "../steps";
import type { PropsWithChildren } from "react";

export const StepView = ({
  children,
  name,
}: PropsWithChildren<{ name: string }>) => {
  const ViewsMap: any = {
    ["accountType"]: () => <AccountTypeStep>{children}</AccountTypeStep>,
    ["plan"]: () => <PlanStep>{children}</PlanStep>,
    ["addPlan"]: () => <AddPlanStep>{children}</AddPlanStep>,
    ["information"]: () => <InformationStep>{children}</InformationStep>,
  };

  const View = ViewsMap[name];

  if (!View) {
    return <div>Step not found</div>;
  }

  return <View />;
};
