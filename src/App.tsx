import { Row, Col } from "antd";
import { ModalProvider } from "./context/ModalProvider";
import { useCreateUser } from "./hooks/useCreateUser";

import {
  Controls,
  Navigation,
  StepView,
  SuccessView,
  Wrapper,
} from "./wizards/CreateUserWizard/components";
import { WizProvider, useOnSuccess, useOnReset } from "./Wizard";

const SuccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const isSuccess = useOnSuccess();
  useOnReset();
  return <>{isSuccess ? <SuccessView /> : children}</>;
};

function App() {
  const createUserMutation = useCreateUser();
  return (
    <ModalProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 overflow-y-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <WizProvider
              config={{
                activeStep: "accountType",
                stepsKeys: ["accountType", "plan", "addPlan", "information"],
                visibleSteps: ["accountType", "plan"],
              }}
              onFinish={async (data, success) => {
                try {
                  await createUserMutation.mutateAsync(
                    {
                      name: "Nicolas",
                      email: "nico@gmail.com",
                      password: "1234",
                      avatar: "https://picsum.photos/800",
                      stepData: data,
                    },
                    {
                      onSuccess: () => {
                        success();
                        console.log("onSuccess", data);
                      },
                    }
                  );
                } catch (error) {}
              }}
            >
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
                              activeStep === "addPlan" ||
                              activeStep === "information"
                            }
                            nextButtonLabel={
                              activeStep === "plan" ? "Next" : undefined
                            }
                          />
                        </Component>
                      );
                    }}
                  </StepView>
                </SuccessWrapper>
              </Wrapper>
            </WizProvider>
            <WizProvider
              config={{
                activeStep: "accountType",
                stepsKeys: ["accountType", "plan", "addPlan", "information"],
                visibleSteps: ["accountType", "plan"],
              }}
              onFinish={async (data, success) => {
                try {
                  await createUserMutation.mutateAsync(
                    {
                      name: "Nicolas",
                      email: "nico@gmail.com",
                      password: "1234",
                      avatar: "https://picsum.photos/800",
                      stepData: data,
                    },
                    {
                      onSuccess: () => {
                        success();
                      },
                    }
                  );
                } catch (error) {}
              }}
            >
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
                              activeStep === "addPlan" ||
                              activeStep === "information"
                            }
                            nextButtonLabel={
                              activeStep === "plan" ? "Next" : undefined
                            }
                          />
                        </Component>
                      );
                    }}
                  </StepView>
                </SuccessWrapper>
              </Wrapper>
            </WizProvider>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}

export default App;
