import { BrowserEventTypes } from '@y-monitor/shared';
import { BasePluginType, voidFun, RouteChangeCollectType } from '@y-monitor/types';
import { _global, getLocationHref, rewirteAttr, supportsHistory } from '@y-monitor/utils';
import { routeTransform, routeTransformConsumer } from './hashRoute';

const historyRoutePlugin: BasePluginType = {
  name: BrowserEventTypes.HISTORY,
  monitor(notify) {
    let lastHref: string;
    if (!supportsHistory()) return;
    const oldOnpopState = _global.onpopstate;
    _global.onpopstate = function (this: WindowEventHandlers, ...args: any[]): any {
      const to = getLocationHref();
      const from = lastHref || to;
      lastHref = to;
      notify(BrowserEventTypes.HISTORY, {
        from,
        to
      });
      oldOnpopState && oldOnpopState.apply(this, args);
    };
    function historyReplaceStateWrapper(originalHistoryReplaceState: voidFun): voidFun {
      return function (this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined;
        if (url) {
          const from = lastHref || getLocationHref();
          const to = String(url);
          lastHref = to;
          notify(BrowserEventTypes.HISTORY, {
            from,
            to
          });
          return originalHistoryReplaceState.apply(this, args);
        }
      };
    }
    rewirteAttr(_global.history, 'replaceState', historyReplaceStateWrapper);
    rewirteAttr(_global.history, 'pushState', historyReplaceStateWrapper);
  },
  transform(collectedData: RouteChangeCollectType) {
    return routeTransform(collectedData);
  },
  consumer(transformedData: RouteChangeCollectType) {
    routeTransformConsumer.call(this, transformedData);
  }
};
