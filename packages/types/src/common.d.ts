export enum Severity {
  /*上报的等级错误*/
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical'
}

export type NumStrObj = number | string | object;

export interface LogTypes {
  level?: Severity;
  message?: NumStrObj;
}
