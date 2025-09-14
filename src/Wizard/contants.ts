/**
 * Event types used throughout the wizard system for communication
 * between different components and state management.
 *
 * These events enable reactive programming patterns and allow
 * components to respond to wizard state changes in real-time.
 */
export enum EVENTS {
  /** Fired when the current step changes to a different step */
  ON_STEP_CHANGE = "ON_STEP_CHANGE",

  /** Fired when a step is marked as completed by the user */
  ON_STEP_COMPLETE = "ON_STEP_COMPLETE",

  /** Fired when moving to the next step in the wizard flow */
  ON_STEP_NEXT = "ON_STEP_NEXT",

  /** Fired when moving to the previous step in the wizard flow */
  ON_STEP_PREV = "ON_STEP_PREV",

  /** Fired when the entire wizard is completed successfully */
  ON_SUCCESS = "ON_SUCCESS",

  /** Fired when the wizard is reset to its initial state */
  ON_RESET = "ON_RESET",

  /** Fired when the wizard reaches its final step and finishes */
  ON_FINISH = "ON_FINISH",
}
