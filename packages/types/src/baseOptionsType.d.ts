export interface BaseOptionsType<O extends BaseOptionsFiledsIntegrationType> extends BaseOptionsFiledsIntegrationType {
  bindOptions(options: O): void;
}

export type BaseOptionsFiledsIntegrationType = BaseOptionsFieldsType & BaseOptionsHooksType;

export interface BaseOptionsFieldsType {
  /**
   * report to sevice url
   */
  dsn?: string;

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
