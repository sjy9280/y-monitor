import { BaseTransport } from '@y-monitor/core';
import { BrowserOptionsType } from './types';
import { TransportDataType, ReportDataType } from '@y-monitor/types';
import { MethodTypes } from '@y-monitor/shared';
import { safeStringify } from '@y-monitor/utils';

export class BrowserTransport extends BaseTransport<BrowserOptionsType> {
  constructor(options: BrowserOptionsType) {
    super();
    super.bindOptions(options);
  }

  post(data: TransportDataType | any, url: string): void {
    const requestFunc = () => {
      const xhr = new XMLHttpRequest();
      xhr.open(MethodTypes.Post, url);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.withCredentials = true;
      xhr.send(safeStringify(data));
    };
    this.queue.addTask(requestFunc);
  }
  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      deviceInfo: this.getDeviceInfo(),
      data
    };
  }
  sendToServer(data: any, url: string): void {
    this.post(data, url);
  }
}
