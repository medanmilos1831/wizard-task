/**
 * Interface for a single step instance in the wizard
 * Defines the contract for step behavior and state management
 */
export interface IStepInstance {
  /** Unique identifier for this step */
  name: string;
  /** Current data/state of this step */
  state: any;
  /** Whether this step is visible in the current wizard flow */
  isVisible: boolean;
  /** Whether this step has been completed and locked */
  isComplete: boolean;
  /** Function to update the step's state */
  setState: setStepDataType;
  /** Function to get the current step data */
  getStepData: () => any;
  /** Function to mark this step as completed */
  completeStep: () => void;
  /** Function to set the visibility of this step */
  setIsVisible: (isVisible: boolean) => void;
  /** Function to reset this step to initial state */
  reset: () => void;
}

/**
 * Type for the setState function signature
 * @param setStepDataCallback - Function that returns new state based on current state
 */
export type setStepDataType = (
  setStepDataCallback: setStateCallbackType
) => void;

/**
 * Type for the state callback function
 * @param data - Current state data
 * @returns New state data
 */
export type setStateCallbackType = (data: any) => any;
