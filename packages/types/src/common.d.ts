import { HttpCollectedType } from './http';

export enum Severity {
  Else = 'else',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
  /** 上报的错误等级 */
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Critical = 'critical'
}

export type NumStrObj = number | string | object;

export interface LogTypes {
  level?: Severity;
  message?: NumStrObj;
}

export interface IAnyObject {
  [key: string]: any;
}

export interface MITOXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any;
  httpCollect?: HttpCollectedType;
}

export type voidFun = () => void;

export type TNumStrObj = number | string | object;
