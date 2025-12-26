import { BrowserBreadcrumbTypes, BrowserEventTypes } from '@y-monitor/shared';
import { BasePluginType, RouteChangeCollectType } from '@y-monitor/types';
import { _global, isExistProperty, on, parseUrlToObj } from '@y-monitor/utils';
import { addBreadcrumbInBrowser } from '../utils';
import { BrowserClient } from '../browserClient';

const hashRoutePlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.HASHCHANGE,
  monitor(notify) {
    if (!isExistProperty(_global, 'onpopstate')) {
      on(_global, BrowserEventTypes.HASHCHANGE, (event: HashChangeEvent) => {
        const { oldURL: from, newURL: to } = event;
        notify(BrowserEventTypes.HASHCHANGE, { from, to });
      });
    }
  },
  transform(collectedData: RouteChangeCollectType) {
    return routeTransform(collectedData);
  },
  consumer(transformedData: RouteChangeCollectType) {
    routeTransformConsumer.call(this, transformedData);
  }
};

export function routeTransform(collectedData: RouteChangeCollectType): RouteChangeCollectType {
  const { from, to } = collectedData;
  const { relative: parsedFrom } = parseUrlToObj(from);
  const { relative: parsedTo } = parseUrlToObj(to);
  return {
    from: parsedFrom ? parsedFrom : '/',
    to: parsedTo ? parsedTo : '/'
  };
}

export function routeTransformConsumer(this: BrowserClient, transformedData: RouteChangeCollectType): void {
  if (transformedData.from === transformedData.to) return;
  addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.ROUTE);
}
export default hashRoutePlugin;
