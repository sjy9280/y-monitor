import { ErrorTypes } from '@y-monitor/shared';
import { BreadcrumbPushDataType } from './breadcrumb';
import { HttpTransformType } from './http';

export interface AuthInfo {
  apiKey?: string;
  sdkVersion: string;
  sdkName: string;
}

export interface DeviceInfo {
  deviceOs: string;
  deviceName: string;
  deviceVersion: string;
}

export interface TransportDataType {
  authInfo?: AuthInfo;
  breadcrumb?: BreadcrumbPushDataType[];
}

export interface BaseTransformType {
  type?: ErrorTypes;
  message?: string;
  time?: number;
  name?: string;
  level?: string;
  url: string;
}

export interface ReportDataType extends Partial<HttpTransformType> {}
