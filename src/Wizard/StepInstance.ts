import type { EventManager } from "./EventManager";
import { EVENTS } from "./contants";

export class StepInstance {
  name: string;
  eventManager: EventManager;
  initialComplete: boolean = false;
  state: any = undefined;
  prevState: any = undefined;
  isComplete: boolean = false;
  isChanged: boolean = false;
  constructor(eventManager: EventManager, name: string) {
    this.name = name;
    this.eventManager = eventManager;
  }
  onNextStep = () => {
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_CHANGE,
      payload: "next",
    });
  };
  onPrevStep = () => {
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_CHANGE,
      payload: "prev",
    });
  };
  setStepComplete = () => {
    this.isComplete = true;
    this.eventManager.dispatch({
      type: EVENTS.ON_STEP_COMPLETE,
      payload: this,
    });
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
}
