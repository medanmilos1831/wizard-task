import type { EventManager } from "../EventManager";
import type { IStepInstance } from "./step.types";

/**
 * Configuration interface for initializing a wizard
 */
export interface IWizardConfig {
  /** Name of the initially active step */
  activeStep: string;
  /** Array of all step keys in the wizard */
  stepsKeys: string[];
  /** Array of initially visible step keys */
  visibleSteps: string[];
}

/**
 * Main wizard instance interface
 * Defines the complete API for wizard functionality
 */
export interface IWizardInstance {
  /** Currently active step instance */
  activeStep: IStepInstance;
  /** Callback function called when wizard is completed */
  onFinish: (
    success: () => void,
    stepData: { [stepName: string]: any }
  ) => void;
  /** Gets all completed steps */
  getCompletedSteps: () => IStepInstance[];
  /** Map of all step instances by name */
  stepsMap: { [key: string]: IStepInstance };
  /** Array of step keys in order */
  stepsKeys: string[];
  /** Array of currently visible step keys */
  visibleStepsKeys: string[];
  /** Whether current step is the last step */
  isLast: boolean;
  /** Whether current step is the first step */
  isFirst: boolean;
  /** Array of currently visible step instances */
  visibleSteps: IStepInstance[];
  /** Event manager for wizard events */
  eventManager: EventManager;
  /** Whether wizard has been completed successfully */
  isSuccess: boolean;
  /** Callback function for step changes */
  onStepChange: any;
  /** Initial configuration for resetting */
  __INIT__: IWizardConfig;
  /** Navigate to previous step */
  prevStep: () => void;
  /** Navigate to next step */
  nextStep: () => void;
  /** Mark wizard as successfully completed */
  success: () => void;
  /** Reset wizard to initial state */
  reset: () => void;
  /** Navigate to specific step by key */
  goToStep: (stepKey: string) => void;
  /** Update visible steps configuration */
  updateVisibleSteps: (
    callback: (currentState: {
      visibleStepsKeys: string[];
      stepsKeys: string[];
    }) => { visibleStepsKeys: string[] }
  ) => void;
  /** Get data for specific step by name */
  getStates: (name: string) => any;
}

/**
 * Client interface for wizard components
 * Excludes internal properties not needed by components
 */
export type WizardClient = Omit<IWizardInstance, "__INIT__" | "eventManager">;
