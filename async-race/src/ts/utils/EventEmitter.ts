import { TSubscriber } from '../types';

export default class EventEmitter {
  private readonly events: Record<string, TSubscriber[]>;

  constructor() {
    this.events = {};
  }

  public emit(eventName: string, data?: string | undefined): void {
    const functions: TSubscriber[] = this.events[eventName];

    if (functions) {
      functions.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }

  public subscribe(eventName: string, fn: TSubscriber): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (!this.events[eventName].includes(fn)) {
      this.events[eventName].push(fn);
    }
  }

  public unsubscribe(eventName: string): void {
    if (this.events[eventName]) {
      this.events[eventName] = [];
    }
  }
}
