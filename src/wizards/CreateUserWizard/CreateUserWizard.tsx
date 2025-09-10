import {
  Controls,
  Navigation,
  StepView,
  SuccessView,
  Wrapper,
} from "./components";
import { Col, Row } from "antd";
import { useCreateUser } from "../../hooks/useCreateUser";
import { WizardHander } from "./wiz";

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
        onFinish={async (stepData: any, success: () => void) => {
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
            // Handle error silently
          }
        }}
      >
        {(props) => {
          if (props.isSuccess) {
            return <SuccessView {...props} />;
          }
          return (
            <Row>
              <Col span={24} className="mb-5">
                <Navigation />
              </Col>
              <Col span={24} className="mb-5">
                <StepView name={props.activeStep.name}>
                  <Col span={24}>
                    <Controls
                      isForm={
                        props.activeStep.name === "addPlan" ||
                        props.activeStep.name === "information"
                      }
                      nextButtonLabel={
                        props.activeStep.name === "plan" ? "Next" : undefined
                      }
                    />
                  </Col>
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
