import { BaseOptions } from '@monitor/core';
import { BrowserOptionsType } from './types';

export class BrowserOptions extends BaseOptions<BrowserOptionsType> {
  constructor(options: BrowserOptionsType) {
    super();
    super.bindOptions(options);
  }
  bindOptions(options: BrowserOptionsType): void {}
}
