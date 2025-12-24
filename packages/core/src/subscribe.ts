type MonitorCallback = (data: any) => any;

export class Subscribe<T> {
  events: Map<T, MonitorCallback[]> = new Map();

  watch(eventName: T, callback: MonitorCallback) {
    const fns = this.events.get(eventName);
    if (!!fns) {
      fns.push(callback);
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
      } catch (err) {
        console.error('err', err);
      }
    });
  }
}
