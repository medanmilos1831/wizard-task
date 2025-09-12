/**
 * Event types used throughout the wizard system for communication
 * between different components and state management
 */
export enum EVENTS {
  /** Fired when the active step changes */
  ON_STEP_CHANGE = "ON_STEP_CHANGE",
  /** Fired when a step is marked as completed */
  ON_STEP_COMPLETE = "ON_STEP_COMPLETE",
  /** Fired when moving to next step */
  ON_STEP_NEXT = "ON_STEP_NEXT",
  /** Fired when moving to previous step */
  ON_STEP_PREV = "ON_STEP_PREV",
  /** Fired when the entire wizard is completed successfully */
  ON_SUCCESS = "ON_SUCCESS",
  /** Fired when the wizard is reset to initial state */
  ON_RESET = "ON_RESET",
  ON_LAST_STEP = "ON_LAST_STEP",
}
