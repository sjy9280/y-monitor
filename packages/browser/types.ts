import { BaseOptionsFiledsIntegrationType } from '@monitor/types';

export interface BrowserOptionsType extends BaseOptionsFiledsIntegrationType, BrowserSlientOptionsType {}

export interface BrowserSlientOptionsType {
  slientXhr?: Boolean;
  slientDom?: Boolean;
}
