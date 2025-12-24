import { BaseClient, Breadcrumb } from '@y-monitor/core';
import { BrowserBreadcrumbTypes, ErrorTypes, EventTypes } from '@y-monitor/shared';
import { BrowserTransport } from './browserTransport';
import { BrowserOptions } from './browserOptions';
import { BrowserOptionsType } from './types';
import { Severity } from '@y-monitor/types';
import { extractErrorStack, getBreadcrumbCategoryInBrowser, getLocationHref, getTimestamp, isError, unknownToString } from '@y-monitor/utils';

export class BrowserClient extends BaseClient<BrowserOptionsType, EventTypes> {
  transport: BrowserTransport;
  options: BrowserOptions;
  breadcrumb: Breadcrumb<BrowserOptionsType>;
  constructor(options) {
    super(options);
    this.options = new BrowserOptions(options);
    this.transport = new BrowserTransport(options);
    this.breadcrumb = new Breadcrumb(options);
  }
  isPluginEnable(name: EventTypes) {
    return true;
  }
  log(data) {
    const { message = 'empty.msg', tag = 'empty.tag', level = Severity.Critical, ex = '' } = data;
    let errorInfo = {};
    if (isError(ex)) {
      errorInfo = extractErrorStack(ex, level);
    }
    const error = {
      type: ErrorTypes.LOG,
      level,
      message: unknownToString(message),
      name: 'Y-MONITOR.log',
      customTag: unknownToString(tag),
      time: getTimestamp(),
      url: getLocationHref(),
      ...errorInfo
    };
    const breadcrumbStack = this.breadcrumb.push({
      type: BrowserBreadcrumbTypes.CUSTOMER,
      category: getBreadcrumbCategoryInBrowser(BrowserBreadcrumbTypes.CUSTOMER),
      data: message,
      level: Severity.fromString(level.toString())
    });
    this.transport.send(error, breadcrumbStack);
  }
}
