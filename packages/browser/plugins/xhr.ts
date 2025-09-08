import { BrowserEventTypes } from '@monitor/shared';
import { BaseClientType, BaseOptionsType, BasePluginType } from '@monitor/types';
import { BrowserClient } from '../browserClient';

const xhrPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.XHR,
  monitor: function (notify: () => void): void {},
  transform: function (data: any): void {},
  consumer: function (data: any): void {}
};

function xhrMonitor(this: BrowserClient, notify: (eventName: BrowserEventTypes, data: any) => void) {
  const { options };
}
