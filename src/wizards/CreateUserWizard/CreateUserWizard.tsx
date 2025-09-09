import { Col, Row } from "antd";
import { WIZARD_STEPS } from "./constants";
import { WizardHander } from "./wiz";
import { useCreateUser } from "../../hooks/useCreateUser";
import {
  Wrapper,
  SuccessView,
  Navigation,
  StepView,
  Controls,
} from "./components";

const CreateUserWizard = () => {
  const createUserMutation = useCreateUser();

  return (
    <Wrapper>
      <Row className="mb-8">
        <Col span={24} className="text-center">
          <h1 className="wizard-title">Create User - New Account</h1>
          <p className="wizard-subtitle">
            Follow the steps below to create your new account
          </p>
        </Col>
      </Row>
      <WizardHander
        options={{
          onFinish: async (success: () => void, stepData: any) => {
            try {
              await createUserMutation.mutateAsync({
                name: "Nicolas",
                email: "nico@gmail.com",
                password: "1234",
                avatar: "https://picsum.photos/800",
                stepData: stepData,
              });
              success();
            } catch (error) {
              console.error("Error creating user:", error);
            }
          },
        }}
      >
        {(props) => {
          if (props.isSuccess) {
            return <SuccessView {...props} />;
          }
          return (
            <Row>
              <Col span={24} className="mb-5">
                <Navigation
                  visibleSteps={props.visibleSteps}
                  activeStep={props.activeStep}
                  stepsMap={props.stepsMap}
                  goToStep={props.goToStep}
                />
              </Col>
              <Col span={24} className="mb-5">
                <StepView {...props}>
                  <Controls
                    isForm={[
                      WIZARD_STEPS.ADD_PLAN,
                      WIZARD_STEPS.INFORMATION,
                    ].includes(props.activeStep.name as any)}
                    isFirst={props.isFirst}
                    isLast={props.isLast}
                    activeStep={props.activeStep}
                    prevStep={props.prevStep}
                    nextStep={props.nextStep}
                    reset={props.reset}
                    getCompletedSteps={props.getCompletedSteps}
                    stepsMap={props.stepsMap}
                    isLoading={createUserMutation.isPending}
                  />
                </StepView>
              </Col>
            </Row>
          );
        }}
      </WizardHander>
    </Wrapper>
  );
};

export { CreateUserWizard };
