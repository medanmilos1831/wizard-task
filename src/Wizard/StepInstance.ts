import { EVENTS } from "./contants";
import type { EventManager } from "./EventManager";
import type { IStepInstance, setStateCallbackType } from "./types";

/**
 * Represents a single step in the wizard flow
 * Manages step state, completion status, and visibility
 */
export class StepInstance implements IStepInstance {
  /** Unique identifier for this step */
  name: string;
  /** Current data/state of this step */
  state: any = undefined;
  /** Whether this step is visible in the current wizard flow */
  isVisible: boolean;
  /** Whether this step has been completed and locked */
  isComplete: boolean = false;
  /** Event manager for dispatching step events */
  private eventManager: EventManager;

  /**
   * Creates a new step instance
   * @param name - Unique identifier for this step
   * @param options - Configuration options for the step
   * @param options.isVisible - Whether this step should be visible initially
   * @param options.eventManager - Event manager for dispatching events
   */
  constructor(
    name: string,
    {
      isVisible,
      eventManager,
    }: {
      isVisible: boolean;
      eventManager: EventManager;
    }
  ) {
    this.name = name;
    this.isComplete = false;
    this.isVisible = isVisible;
    this.eventManager = eventManager;
  }

  /**
   * Marks this step as completed and dispatches completion event
   * Once completed, the step becomes locked and cannot be modified
   */
  completeStep = () => {
    this.isComplete = true;
    this.eventManager.dispatch({
      type: EVENTS.STEP_COMPLETED,
    });
  };

  /**
   * Updates the step's state with new data
   * @param setStepDataCallback - Function that returns new state based on current state
   */
  setState = (setStepDataCallback: setStateCallbackType) => {
    this.state = setStepDataCallback(this.state);
    this.eventManager.dispatch({
      type: EVENTS.STEP_DATA_SET,
      payload: this,
    });
  };

  /**
   * Gets the current step data/state
   * @returns The current state of this step
   */
  getStepData = () => {
    return this.state;
  };

  /**
   * Sets the visibility of this step
   * @param isVisible - Whether this step should be visible
   */
  setIsVisible = (isVisible: boolean) => {
    this.isVisible = isVisible;
  };

  /**
   * Resets the step to its initial state
   * Clears all data and marks as incomplete
   */
  reset = () => {
    this.isComplete = false;
    this.state = undefined;
  };
}
