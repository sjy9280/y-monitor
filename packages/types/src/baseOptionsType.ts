export interface BaseOptionsType<O extends BaseOptionsFieldsIntegrationType> extends BaseOptionsFieldsIntegrationType {
  bindOptions(options: O): void;
}

export type BaseOptionsFieldsIntegrationType = BaseOptionsFieldsType & BaseOptionsHooksType & rrwebOptionsType;

export interface rrwebOptionsType {
  autoRecord?: boolean;
  /** 录制采样率，默认 1（100%） */
  sampling?: number;
  /** 最大录制时长（毫秒），默认 10分钟 */
  maxDuration?: number;
  /** 是否录制控制台日志，默认 true */
  recordConsole?: boolean;
  /** 是否录制网络请求，默认 true */
  recordNetwork?: boolean;
  /** 是否录制鼠标移动轨迹，默认 true */
  recordMouseMovement?: boolean;
  /** 是否录制 DOM 变化，默认 true */
  recordDOMChanges?: boolean;
  /** 排除元素选择器，不录制这些元素 */
  excludeSelectors?: string[];
  /** 包含元素选择器，只录制这些元素（优先级高于排除） */
  includeSelectors?: string[];
  /** 最大事件数量限制，默认 10000 */
  maxEvents?: number;
  /** 数据块大小（KB），默认 100KB */
  chunkSize?: number;
  /** 是否压缩数据，默认 true */
  compress?: boolean;
}

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
