import { BaseOptions } from '@y-monitor/core';
import { BrowserOptionsType } from './types';
import { ToStringTypes } from '@y-monitor/shared';
import { validateOptionsAndSet } from '@y-monitor/utils';

export class BrowserOptions extends BaseOptions<BrowserOptionsType> {
  slientXhr: boolean;
  silentDom: boolean;

  constructor(options: BrowserOptionsType) {
    super();
    super.bindOptions(options);
    this.bindOptions(options);
  }
  bindOptions(options: BrowserOptionsType): void {
    const { slientXhr, slientDom } = options;
    const booleanType = ToStringTypes.Boolean;
    const optionArr = [
      [slientXhr, 'slientXhr', booleanType],
      [slientDom, 'slientDom', booleanType]
    ];
    validateOptionsAndSet.call(this, optionArr);
  }
}
