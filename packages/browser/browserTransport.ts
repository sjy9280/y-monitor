import { BaseTransport } from '@monitor/core';
import { BrowserOptionsType } from './types';
import { TransportDataType, ReportDataType } from '@monitor/types';
import { MethodTypes } from '@monitor/shared';
import { safeStringify } from '@monitor/utils';

export class BrowserTransport extends BaseTransport<BrowserOptionsType> {
  constructor(options: BrowserOptionsType) {
    super();
    super.bindOptions(options);
  }

  post(data: TransportDataType | any, url: string): void {
    const reqestFunc = () => {
      const xhr = new XMLHttpRequest();
      xhr.open(MethodTypes.Post, url);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.withCredentials = true;
      xhr.send(safeStringify(data));
    };
    this.queue.addTask(reqestFunc);
  }
  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      data
    };
  }
  sendToServer(data: any, url: string): void {
    this.post(data, url);
  }
}
