import type { IStepInstance } from "./step.types";
export class StepInstance implements IStepInstance {
  name: string;
  initialComplete: boolean = false;
  state: any = undefined;
  prevState: any = undefined;
  isComplete: boolean = false;
  constructor(name: string) {
    this.name = name;
  }

  setStepComplete = () => {
    this.isComplete = true;
  };

  setState = (value: any | ((prev: any) => any)) => {
    this.prevState = this.state;
    this.state =
      typeof value === "function"
        ? (value as (prev: any) => any)(this.state)
        : value;
  };

  getStepData = (): any => {
    return this.state;
  };

  getPrevStepData = (): any => {
    return this.prevState;
  };

  reset = () => {
    this.initialComplete = false;
    this.state = undefined;
    this.prevState = undefined;
    this.isComplete = false;
  };
}
