import { WizardClient } from "src/Wizard/types";
import { WIZARD_STEPS } from "../constants";
import {
  AccountTypeStep,
  PlanStep,
  AddPlanStep,
  InformationStep,
} from "../steps";

interface StepViewProps extends WizardClient {
  children: React.ReactNode;
}

export const StepView = ({ children, ...props }: StepViewProps) => {
  const ViewsMap: {
    [key: string]: (
      props: WizardClient,
      children: React.ReactNode
    ) => React.ReactNode;
  } = {
    [WIZARD_STEPS.ACCOUNT_TYPE]: (
      props: WizardClient,
      children: React.ReactNode
    ) => (
      <AccountTypeStep activeStep={props.activeStep}>
        {children}
      </AccountTypeStep>
    ),
    [WIZARD_STEPS.PLAN]: (props: WizardClient, children: React.ReactNode) => (
      <PlanStep activeStep={props.activeStep} getStates={props.getStates}>
        {children}
      </PlanStep>
    ),
    [WIZARD_STEPS.ADD_PLAN]: (
      props: WizardClient,
      children: React.ReactNode
    ) => (
      <AddPlanStep activeStep={props.activeStep} nextStep={props.nextStep}>
        {children}
      </AddPlanStep>
    ),
    [WIZARD_STEPS.INFORMATION]: (
      props: WizardClient,
      children: React.ReactNode
    ) => (
      <InformationStep
        activeStep={props.activeStep}
        nextStep={props.nextStep}
        getStates={props.getStates}
      >
        {children}
      </InformationStep>
    ),
  };
  const View = ViewsMap[props.activeStep.name];
  return View(props, children);
};
