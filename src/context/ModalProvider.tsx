import { Modal, type ModalProps } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type PropsWithChildren,
} from "react";

interface ModalContextType {
  isVisible: boolean;
  open: (Component: ComponentType, modalConfig: ModalProps) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState(false);
  const defaultModalConfig: ModalProps = {
    open: isVisible,
  };
  const activeModalConfigRef = useRef<ModalProps>({});
  const ElementRef = useRef<ComponentType | null>(null);
  const Element = ElementRef.current;
  useEffect(() => {
    if (!isVisible) {
      activeModalConfigRef.current = { ...defaultModalConfig };
      ElementRef.current = null;
    }
  }, [isVisible]);
  return (
    <ModalContext.Provider
      value={{
        isVisible,
        open(Component: ComponentType, modalConfig: ModalProps) {
          ElementRef.current = Component;
          activeModalConfigRef.current = {
            ...structuredClone(defaultModalConfig),
            ...modalConfig,
          };
          setIsVisible(() => true);
        },
        close() {
          setIsVisible(() => false);
        },
      }}
    >
      {children}
      <Modal
        {...activeModalConfigRef.current}
        open={isVisible}
        className="rounded-lg"
        maskClassName="bg-black bg-opacity-50"
        title={null}
        footer={null}
        width={480}
        centered
      >
        {Element && <Element />}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return {
    open: context.open,
    close: context.close,
  };
};
