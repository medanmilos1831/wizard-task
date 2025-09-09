export const WIZARD_STEPS = {
  ACCOUNT_TYPE: "accountType",
  PLAN: "plan",
  ADD_PLAN: "addPlan",
  INFORMATION: "information",
} as const;

export const STEP_NAMES = {
  [WIZARD_STEPS.ACCOUNT_TYPE]: "Account Type",
  [WIZARD_STEPS.PLAN]: "Plan",
  [WIZARD_STEPS.ADD_PLAN]: "Add Plan",
  [WIZARD_STEPS.INFORMATION]: "Information",
} as const;

export const INITIAL_VISIBLE_STEPS = [
  WIZARD_STEPS.ACCOUNT_TYPE,
  WIZARD_STEPS.PLAN,
];

export const ALL_STEPS = [
  WIZARD_STEPS.ACCOUNT_TYPE,
  WIZARD_STEPS.PLAN,
  WIZARD_STEPS.ADD_PLAN,
  WIZARD_STEPS.INFORMATION,
];
