/**
 * 基础配置绑定
 */

import { ToStringTypes } from '@y-monitor/shared';
import { BaseOptionsFieldsIntegrationType, BaseOptionsType } from '@y-monitor/types';
import { validateOptionsAndSet } from '@y-monitor/utils';

export class BaseOptions<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> implements BaseOptionsType<O> {
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
