import { CreateUserWizard } from "./wizards";
import { ModalProvider } from "./context/ModalProvider";

function App() {
  return (
    <ModalProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <CreateUserWizard />
        </div>
      </div>
    </ModalProvider>
  );
}

export default App;
