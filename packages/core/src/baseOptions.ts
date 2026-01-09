/**
 * 基础配置绑定
 */

import { ToStringTypes } from '@y-monitor/shared';
import { BaseOptionsFieldsIntegrationType, BaseOptionsType } from '@y-monitor/types';
import { generateUuid, validateOptionsAndSet } from '@y-monitor/utils';

export class BaseOptions<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> implements BaseOptionsType<O> {
  enableTraceId = false;
  traceIdFieldName = 'Trace-Id';
  throttleDelayTime = 0;
  filterXhrUrlRegExp: RegExp;
  includeHttpUrlTraceIdRegExp = /.*/;
  beforeAjaxSend = null;
  autoRecord = false;

  constructor() {}

  isFilterHttpUrl(url: string): boolean {
    return this.filterXhrUrlRegExp && this.filterXhrUrlRegExp.test(url);
  }

  bindOptions(options: O): void {
    const { enableTraceId, traceIdFieldName, throttleDelayTime, filterXhrUrlRegExp, includeHttpUrlTraceIdRegExp, autoRecord, beforeAjaxSend } =
      options;
    const optionArr = [
      [enableTraceId, 'enableTraceId', ToStringTypes.Boolean],
      [traceIdFieldName, 'traceIdFieldName', ToStringTypes.String],
      [throttleDelayTime, 'throttleDelayTime', ToStringTypes.Number],
      [filterXhrUrlRegExp, 'filterXhrUrlRegExp', ToStringTypes.RegExp],
      [autoRecord, 'autoRecord', ToStringTypes.Boolean],
      [includeHttpUrlTraceIdRegExp, 'includeHttpUrlTraceIdRegExp', ToStringTypes.RegExp],
      [beforeAjaxSend, 'beforeAjaxSend', ToStringTypes.Function]
    ];
    validateOptionsAndSet.call(this, optionArr);
  }

  setTraceId(httpUrl: string, callback: (headerFieldName: string, traceId: string) => void) {
    const { includeHttpUrlTraceIdRegExp, enableTraceId } = this;
    if (enableTraceId && includeHttpUrlTraceIdRegExp && includeHttpUrlTraceIdRegExp.test(httpUrl)) {
      const traceId = generateUuid();
      callback(this.traceIdFieldName, traceId);
    }
  }
}
