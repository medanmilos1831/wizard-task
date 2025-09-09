import { createContext, useContext, type PropsWithChildren } from "react";

const AppContext = createContext<any>(undefined);

const AppProvider = ({ children }: PropsWithChildren) => {
  const someMap = new Map();
  return (
    <AppContext.Provider
      value={{
        setSomeMap(k: any, v: any) {
          someMap.set(k, v);
        },
        getSomeMap(k: any) {
          return someMap.get(k);
        },
        deleteSomeMap(k: any) {
          someMap.delete(k);
        },
        clearSomeMap() {
          someMap.clear();
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
