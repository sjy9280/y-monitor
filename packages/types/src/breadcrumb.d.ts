import { BreadcrumbTypes } from '@monitor/shared';
import { Severity } from './common';

export interface BreadcrumbPushDataType {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  timestamp?: number;
  level: Severity;
}
