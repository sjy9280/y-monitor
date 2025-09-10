import { BREADCRUMBCATEGORYS, BreadcrumbTypes } from '@monitor/shared';
import { Severity, TNumStrObj } from './common';
import { ReportDataType } from './transport';
import { ConsoleCollectType, RouteChangeCollectType } from './basePluginType';

export interface BreadcrumbPushDataType {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  time?: number;
  data: ReportDataType | RouteChangeCollectType | ConsoleCollectType | TNumStrObj;
  category?: BREADCRUMBCATEGORYS;
  level: Severity;
}
