/**
 * Event manager for handling wizard events
 * Extends EventTarget to provide custom event dispatching and subscription
 */
class EventManager extends EventTarget {
  /**
   * Creates a new event manager instance
   */
  constructor() {
    super();
  }

  /**
   * Dispatches a custom event with the given type and payload
   * @param type - The event type to dispatch
   * @param payload - Optional payload data to include with the event
   */
  dispatch({ type, payload }: { type: string; payload?: unknown }) {
    const event = new CustomEvent(type, { detail: payload });
    this.dispatchEvent(event);
  }

  /**
   * Subscribes to an event type with a callback function
   * @param event - The event type to subscribe to
   * @param callback - Function to call when the event is dispatched
   * @returns Unsubscribe function to remove the event listener
   */
  subscribe(event: string, callback: (event: any) => void) {
    this.addEventListener(event, callback);
    return () => this.removeEventListener(event, callback);
  }
}

export { EventManager };
