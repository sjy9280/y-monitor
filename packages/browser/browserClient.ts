import { BaseClient, Breadcrumb } from '@monitor/core';
import { EventTypes } from '@monitor/shared';
import { BrowserTransport } from './browserTransport';
import { BrowserOptions } from './browserOptions';
import { BrowserOptionsType } from './types';

export class BrowserClient extends BaseClient<BrowserOptionsType, EventTypes> {
  transport: BrowserTransport;
  options: BrowserOptions;
  breadcrumb: Breadcrumb<BrowserOptionsType>;
  constructor(options) {
    super(options);
    this.options = new BrowserOptions(options);
    this.transport = new BrowserTransport(options);
  }
  isPluginEnable(name: EventTypes) {
    return true;
  }
  log(data) {}
}
