import type { EventManager } from "./EventManager";
import type { IStepInstance } from "./types";
import { EVENTS } from "./contants";

/**
 * StepInstance class represents a single step in the wizard
 * Manages step state, completion status, and event dispatching
 *
 * @template TState - Type of the step's state data
 */
export class StepInstance<TState = any> implements IStepInstance<TState> {
  /** Name of the step */
  name: string;
  /** Whether the step has been initially completed */
  initialComplete: boolean = false;
  /** Current state data of the step */
  state: TState = undefined as TState;
  /** Previous state data of the step */
  prevState: TState = undefined as TState;
  /** Whether the step is currently complete */
  isComplete: boolean = false;
  /** Whether the step is visible in the wizard */
  isVisible: boolean = true;
  /** Whether the step has been changed since last save */
  isChanged: boolean = false;
  /** Event manager for dispatching step events */
  eventManager: EventManager;

  /**
   * Creates a new StepInstance
   * @param name - Name of the step
   * @param options - Configuration options
   * @param options.eventManager - Event manager for dispatching events
   */
  constructor(
    name: string,
    {
      eventManager,
    }: {
      eventManager: EventManager;
    }
  ) {
    this.name = name;
    this.eventManager = eventManager;
  }

  /**
   * Resets the step to its initial state
   * Clears all state data and resets completion flags
   */
  reset = () => {
    this.initialComplete = false;
    this.state = undefined as TState;
    this.prevState = undefined as TState;
    this.isComplete = false;
    this.isVisible = true;
    this.isChanged = false;
  };

  /**
   * Marks the step as complete and dispatches completion event
   * Used when step validation passes and user can proceed
   */
  setStepComplete = () => {
    this.isComplete = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_COMPLETE,
      payload: this,
    });
  };

  /**
   * Handles step completion when moving to next step
   * Marks step as complete and initially completed, then dispatches next event
   */
  onNextStep = () => {
    this.isComplete = true;
    this.initialComplete = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_NEXT,
      payload: this,
    });
  };

  /**
   * Handles step state when moving to previous step
   * Resets step state if it hasn't been initially completed
   */
  onPrevStep = () => {
    if (!this.initialComplete) {
      this.isComplete = false;
      this.state = undefined as TState;
    }
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_PREV,
      payload: this,
    });
  };

  /**
   * Updates the step state with a new value or function
   * Automatically saves previous state before updating
   * @param value - New state value or function that returns new state
   */
  setState = (value: TState | ((prev: TState) => TState)) => {
    this.prevState = this.state;

    this.state =
      typeof value === "function"
        ? (value as (prev: TState) => TState)(this.state)
        : value;
  };

  /**
   * Gets the current step data
   * @returns Current state data
   */
  getStepData = (): TState => {
    return this.state;
  };

  /**
   * Gets the previous step data
   * @returns Previous state data
   */
  getPrevStepData = (): TState => {
    return this.prevState;
  };

  /**
   * Alias for setStepComplete method
   * Marks the step as complete
   */
  completeStep = () => {
    this.setStepComplete();
  };

  /**
   * Sets the visibility of the step
   * @param isVisible - Whether the step should be visible
   */
  setIsVisible = (isVisible: boolean) => {
    this.isVisible = isVisible;
  };

  /**
   * Sets the changed status of the step
   * @param isChanged - Whether the step has been changed
   */
  setIsChanged = (isChanged: boolean) => {
    this.isChanged = isChanged;
  };
}
