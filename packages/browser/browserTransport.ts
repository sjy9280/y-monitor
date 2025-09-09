import { BaseTransport } from '@monitor/core';
import { BrowserOptionsType } from "./types";

export class BrowserTransport extends BaseTransport <BrowserOptionsType>{

  constructor(options:BrowserOptionsType) {
    super()
  }

  sendToServer(data: any): void {
    throw new Error('Method not implemented.');
  }
}
