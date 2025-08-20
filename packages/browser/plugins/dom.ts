import { BrowserEventTypes } from '@monitor/shared';
import { BasePluginType } from '@monitor/types';
import { _global, throttle } from '@monitor/utils';

const domPlugin: BasePluginType<BrowserEventTypes> = {
  name: BrowserEventTypes.DOM,
  monitor(notify) {
    if (!('document' in _global)) return;
    const clickThrottle = throttle(notify, this.options.throttleDelayTime);
  },
  transform() {},
  consumer() {}
};
