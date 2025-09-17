import { HttpTypes } from '@y-monitor/shared';
import { BaseTransformType } from './transport';

export interface HttpCollectedType {
  request: {
    httpType?: HttpTypes;
    traceId?: string;
    method?: string;
    url?: string;
    data?: any;
  };
  response: {
    status?: number;
    data?: any;
  };
  errMsg?: string;
  elapsedTime?: number;
  time?: number;
}

export interface HttpTransformType extends HttpCollectedType, BaseTransformType {}
