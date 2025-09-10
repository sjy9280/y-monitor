export interface BaseOptionsType<O extends BaseOptionsFiledsIntegrationType> extends BaseOptionsFiledsIntegrationType {
  bindOptions(options: O): void;
}

export type BaseOptionsFiledsIntegrationType = BaseOptionsFieldsType & BaseOptionsHooksType;

export interface BaseOptionsFieldsType {
  /**
   * report to sevice url
   */
  dsn?: string;
  apiKey?: string;
  /**
   * When set `enableTraceId` true,traceId will be added in request header, defaul value is `Trace-Id`.
   * You can configure this field to appoint name
   */
  includeHttpUrlTraceIdRegExp?: RegExp;
  /**
   * default value is null,mean all ajax http will be monitored.You can set some value to filter url.
   * It will filter when `filterXhrUrlRegExp.test(xhr.url) === true`
   */
  filterXhrUrlRegExp?: RegExp;
  /**
   * defaul value is 20,it will be 100 if value more than 100.it mean breadcrumb stack length
   */
  maxBreadcrumbs?: number;

  /* throttle delay time of button click event*/
  throttleDelayTime?: number;
}

export interface BaseOptionsHooksType {
  /**
   * 事件发送之前调用
   */
  beforeDataReport?();
  /**
   * 添加用户行为事件之前调用
   */
  beforePushBreadcrumb?();
  /**
   * 用户ajax请求之前调用
   */
  beforeAjaxSend?();
}
