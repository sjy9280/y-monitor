export interface BaseOptionsType<O extends BaseOptionsFieldsIntegrationType> extends BaseOptionsFieldsIntegrationType {
  bindOptions(options: O): void;
}

export type BaseOptionsFieldsIntegrationType = BaseOptionsFieldsType & BaseOptionsHooksType;

export interface BaseOptionsFieldsType {
  // 错误信息上传地址
  dsn?: string;
  disabled?: boolean;
  apiKey?: string;
  debug?: boolean;

  maxBreadcrumbs?: number;

  enableTraceId?: boolean;
  traceIdFieldName?: string;

  includeHttpUrlTraceIdRegExp?: RegExp;
  filterXhrUrlRegExp?: RegExp;
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
  beforeAjaxSend?(config, setRequestHeader);
}
