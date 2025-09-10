/**
 * Interface for a single step instance in the wizard
 * Defines the contract for step behavior and state management
 */
export interface IStepInstance<TState = any> {
  /** Unique identifier for this step */
  name: string;
  /** Current data/state of this step */
  state: TState;
  /** Previous data/state of this step */
  prevState: TState;
  /** Whether this step is visible in the current wizard flow */
  isVisible: boolean;
  /** Whether this step has been completed and locked */
  isComplete: boolean;
  /** Whether this step has been changed from its initial state */
  isChanged: boolean;
  /** Whether this step has been initially completed */
  initialComplete: boolean;
  /** Function to update the step's state */
  setState: (value: TState | ((prev: TState) => TState)) => void;
  /** Function to get the current step data */
  getStepData: () => TState;
  /** Function to get the previous step data */
  getPrevStepData: () => TState;
  /** Function to mark this step as completed */
  completeStep: () => void;
  /** Function to set step as complete and dispatch completion event */
  setStepComplete: () => void;
  /** Function to set the visibility of this step */
  setIsVisible: (isVisible: boolean) => void;
  /** Function to set the changed flag for this step */
  setIsChanged: (isChanged: boolean) => void;
  /** Function to reset this step to initial state */
  reset: () => void;
  /** Function to handle step completion when moving to next step */
  onNextStep: () => void;
  /** Function to handle step state when moving to previous step */
  onPrevStep: () => void;
}

/**
 * Type for the setState function signature
 * @param setStepDataCallback - Function that returns new state based on current state
 */
export type setStepDataType<TState = any> = (
  setStepDataCallback: setStateCallbackType<TState>
) => void;

/**
 * Type for the state callback function
 * @param data - Current state data
 * @returns New state data
 */
export type setStateCallbackType<TState = any> = (data: TState) => TState;
