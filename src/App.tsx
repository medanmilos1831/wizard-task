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
import { createWizard } from "./Wizard";
import { Provider, useOnReset, useOnSuccess } from "./Wizard/Provider";

const SuccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const isSuccess = useOnSuccess();
  useOnReset();
  return <>{isSuccess ? <SuccessView /> : children}</>;
};

const wizardOne = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});
const wizzardTwo = createWizard({
  activeStep: "accountType",
  stepsKeys: ["accountType", "plan", "addPlan", "information"],
  visibleSteps: ["accountType", "plan"],
});

function App() {
  const createUserMutation = useCreateUser();
  return (
    <ModalProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 overflow-y-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Provider
              value={wizardOne}
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
                        console.log("success", data);
                        success();
                      },
                    }
                  );
                } catch (error) {
                  console.log("error", error);
                }
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
            </Provider>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Provider
              value={wizzardTwo}
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
                        console.log("success", data);
                        success();
                      },
                    }
                  );
                } catch (error) {
                  console.log("error", error);
                }
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
            </Provider>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}

export default App;
