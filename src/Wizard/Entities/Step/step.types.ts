import type { EventManager } from "../../EventManager";

/**
 * Interface defining the structure and behavior of a StepInstance
 * Represents a single step within the wizard flow with its state and methods
 */
export interface IStepInstance {
  /** Unique identifier for this step */
  name: string;

  /** Whether this step was initially completed when created */
  initialComplete: boolean;

  /** Current state data for this step */
  state: any;

  /** Previous state data before the last update */
  prevState: any;

  /** Whether this step is currently marked as complete */
  isComplete: boolean;

  /**
   * Marks this step as completed and dispatches completion event
   */
  setStepComplete: () => void;

  /**
   * Updates the step's state with a new value or function
   * @param value - New state value or function that returns new state
   */
  setState: (value: any | ((prev: any) => any)) => void;

  /**
   * Gets the current step data/state
   * @returns Current state data
   */
  getStepData: () => any;

  /**
   * Gets the previous step data/state
   * @returns Previous state data
   */
  getPrevStepData: () => any;

  /**
   * Resets the step to its initial state
   * Clears all state data and completion status
   */
  reset: () => void;
}
