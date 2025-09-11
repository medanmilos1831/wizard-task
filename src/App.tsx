import { ModalProvider } from "./context/ModalProvider";
import { useCreateUser } from "./hooks/useCreateUser";
import { WizzardProvider } from "./Wizard/WizzardProvider";
import { CreateUserWizard } from "./wizards";

function App() {
  const createUserMutation = useCreateUser();
  return (
    <ModalProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <WizzardProvider
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
                    console.log("onSuccess", data);
                    success();
                  },
                }
              );
            } catch (error) {
              console.log("error", error);
            }
          }}
        >
          <CreateUserWizard />
        </WizzardProvider>
      </div>
    </ModalProvider>
  );
}

export default App;
