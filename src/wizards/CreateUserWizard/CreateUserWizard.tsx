import { Col, Row } from "antd";
import {
  Controls,
  Navigation,
  StepView,
  SuccessView,
  Wrapper,
} from "./components";
import { useWatchWizard } from "../../Wizard/WizzardProvider";

const SuccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const isSuccess = useWatchWizard("ON_SUCCESS", (wizardInstance: any) => {
    return wizardInstance.isSuccess;
  });
  useWatchWizard("ON_RESET", (wizardInstance: any) => {
    return wizardInstance.isSuccess;
  });
  return <>{isSuccess ? <SuccessView /> : children}</>;
};

const CreateUserWizard = () => {
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
      <SuccessWrapper>
        <Navigation />
        <StepView>
          {({ Component, activeStep }: any) => {
            return (
              <Component>
                <Controls
                  isForm={
                    activeStep === "addPlan" || activeStep === "information"
                  }
                  nextButtonLabel={activeStep === "plan" ? "Next" : undefined}
                />
              </Component>
            );
          }}
        </StepView>
      </SuccessWrapper>
    </Wrapper>
  );
};

export { CreateUserWizard };
