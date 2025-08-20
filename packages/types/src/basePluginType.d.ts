import { EventTypes } from '@monitor/shared';
import { BaseClient } from 'packages/core/src/baseClient';
import { BaseClientType } from './baseClientType';

export interface BasePluginType<E extends EventTypes = EventTypes, T extends BaseClientType = BaseClientType> {
  name: E;
  // 监控事件，并且在该事件中使用notify通知订阅中心
  monitor: (this: T, notify: () => void) => void;

  // monitor中触发notify
  transform: (this: T, data: any) => void;

  consumer: (this: T, data: any) => void;
}
