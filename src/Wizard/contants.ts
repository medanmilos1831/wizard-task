/**
 * Event types used throughout the wizard system for communication
 * between different components and state management
 */
export enum EVENTS {
  /** Fired when the active step changes */
  STEP_CHANGED = "STEP_CHANGED",
  /** Fired when a step is marked as completed */
  STEP_COMPLETED = "STEP_COMPLETED",
  /** Fired when step data is updated */
  STEP_DATA_SET = "STEP_DATA_SET",
  /** Fired when the entire wizard is completed successfully */
  ON_SUCCESS = "ON_SUCCESS",
  /** Fired when the wizard is reset to initial state */
  ON_RESET = "ON_RESET",
}
