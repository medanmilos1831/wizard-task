import { Client } from "../Client";
import { createWizard } from "../createWizard";
import type { EventManager } from "../EventManager";
import type { IStepInstance } from "./step.types";

/**
 * Result type from setupWizardInstance function
 */
export interface SetupWizardResult {
  stepsMap: { [key: string]: IStepInstance<any> };
  visibleStepsMap: { [key: string]: IStepInstance<any> };
  activeStep: IStepInstance<any>;
  visibleStepsList: string[];
  allStepsList: string[];
  currentVisibleIndex: number;
  isLast: boolean;
  isFirst: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

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
 * Matches the actual WizardInstance class implementation
 */
export interface IWizardInstance {
  /** Event manager for wizard events */
  eventManager: EventManager;
  /** Currently active step instance */
  activeStep: IStepInstance<any>;
  /** Map of all step instances by name */
  stepsMap: { [key: string]: IStepInstance<any> };
  /** Map of currently visible step instances by name */
  visibleStepsMap: { [key: string]: IStepInstance<any> };
  /** Initial configuration for resetting */
  __INIT__: IWizardConfig;
  /** Array of currently visible step names */
  visibleStepsList: string[];
  /** Array of all step names */
  allStepsList: string[];
  /** Current index in visible steps list */
  currentVisibleIndex: number;
  /** Whether current step is the last step */
  isLast: boolean;
  /** Whether current step is the first step */
  isFirst: boolean;
  /** Callback function called when wizard is completed */
  onFinish: (
    stepData: { [stepName: string]: any },
    success: () => void
  ) => void;
  /** Whether wizard has been completed successfully */
  isSuccess: boolean;
  /** Update visible steps configuration */
  updateVisibleSteps: (newSteps: string[]) => void;
  /** Navigate to next step */
  nextStep: () => void;
  /** Navigate to previous step */
  prevStep: () => void;
  /** Navigate to specific step by name */
  goToStep: (stepName: string) => void;
  /** Mark wizard as successfully completed */
  success: () => void;
  /** Reset wizard to initial state */
  reset: () => void;
}

/**
 * Client interface for wizard components
 * Excludes internal properties not needed by components
 */
export type WizardClient = Omit<
  IWizardInstance,
  | "__INIT__"
  | "eventManager"
  | "visibleStepsMap"
  | "allStepsList"
  | "currentVisibleIndex"
>;

export type WizardContext = {
  client: Client;
};

export interface WizzardContext {
  wizardInstance: IWizardInstance;
  client: WizardClient;
}
