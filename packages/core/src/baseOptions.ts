/**
 * 基础配置绑定
 */

import { ToStringTypes } from '@monitor/shared';
import { BaseOptionsFiledsIntegrationType, BaseOptionsType } from '@monitor/types';
import { validateOptionsAndSet } from '@monitor/utils';

export class BaseOptions<O extends BaseOptionsFiledsIntegrationType = BaseOptionsFiledsIntegrationType> implements BaseOptionsType<O> {
  throttleDelayTime = 0;
  filterXhrUrlRegExp: RegExp;
  includeHttpUrlTraceIdRegExp = /.*/;

  constructor() {}

  isFilterHttpUrl(url: string): boolean {
    return this.filterXhrUrlRegExp && this.filterXhrUrlRegExp.test(url);
  }

  bindOptions(options: O): void {
    const { throttleDelayTime, filterXhrUrlRegExp, includeHttpUrlTraceIdRegExp } = options;
    const optionArr = [
      [throttleDelayTime, 'throttleDelayTime', ToStringTypes.Number],
      [filterXhrUrlRegExp, 'filterXhrUrlRegExp', ToStringTypes.RegExp],
      [includeHttpUrlTraceIdRegExp, 'includeHttpUrlTraceIdRegExp', ToStringTypes.RegExp]
    ];
    validateOptionsAndSet.call(this, optionArr);
  }
}
