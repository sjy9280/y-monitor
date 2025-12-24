import { EventTypes } from '@y-monitor/shared';
import { BaseClientType } from './baseClientType';

export interface BasePluginType<E extends EventTypes = EventTypes, T extends BaseClientType = BaseClientType> {
  name: E;
  // 监控事件，并且在该事件中使用notify通知订阅中心
  monitor: (this: T, notify: (eventName: E, data: any) => void) => void;

  // monitor中触发数据，transform进行数据格式转换
  transform: (this: T, data: any) => void;

  // 接收transform处理后的数据
  consumer: (this: T, data: any) => void;
}

export interface RouteChangeCollectType {
  from: string;
  to: string;
}

export interface ConsoleCollectType {
  args: any[];
  level: string;
}
