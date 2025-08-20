import { BaseClient } from '@monitor/core';
import { BrowserOptionsType } from './types/browserOptionsType';
import { EventTypes } from '@monitor/shared';

export class BrowserClient extends BaseClient<BrowserOptionsType, EventTypes> {
  options: BrowserOptionsType;
  constructor(options) {
    super(options);
    this.options = options;
  }
  isPluginEnable(name: EventTypes) {
    return true;
  }
  log(data) {}
}
