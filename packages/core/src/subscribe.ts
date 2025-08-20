type Callback = (data: any) => any;

export class Subscribe<T> {
  events: Map<T, Callback[]> = new Map();
  constructor() {}
  watch(eventName: T, callback: Callback) {
    const fns = this.events.get(eventName);
    if (fns) {
      this.events.set(eventName, fns.concat(callback));
      return;
    }
    this.events.set(eventName, [callback]);
  }

  notify(eventName: T, data: any) {
    const fns = this.events.get(eventName);
    if (!eventName || !fns) return;
    fns.forEach((fn) => {
      try {
        fn(data);
      } catch (error) {}
    });
  }
}
