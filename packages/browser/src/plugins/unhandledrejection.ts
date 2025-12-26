import { BrowserBreadcrumbTypes, BrowserEventTypes, ErrorTypes } from '@y-monitor/shared';
import { BasePluginType, ReportDataType, Severity } from '@y-monitor/types';
import { BrowserClient } from '../browserClient';
import { _global, extractErrorStack, getLocationHref, getTimestamp, isError, on, unknownToString } from '@y-monitor/utils';
import { addBreadcrumbInBrowser } from '../utils';

const unhandledrejectionPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.UNHANDLEDREJECTION,
  monitor(notify) {
    on(_global, BrowserEventTypes.UNHANDLEDREJECTION, (event: PromiseRejectionEvent) => {
      notify(BrowserEventTypes.UNHANDLEDREJECTION, event);
    });
  },
  transform(collectedData: PromiseRejectionEvent) {
    let data: ReportDataType = {
      type: ErrorTypes.PROMISE,
      message: unknownToString(collectedData.reason),
      url: getLocationHref(),
      name: collectedData.type,
      time: getTimestamp(),
      level: Severity.Low
    };
    if (isError(collectedData.reason)) {
      data = {
        ...data,
        ...extractErrorStack(collectedData.reason, Severity.Low)
      };
    }
    return data;
  },
  consumer(transformedData) {
    const breadcrumbStack = addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.UNHANDLEDREJECTION, Severity.Error);
    this.transport.send(transformedData, breadcrumbStack);
  }
};

export default unhandledrejectionPlugin;
