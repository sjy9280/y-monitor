import { BaseOptionsFieldsIntegrationType } from '@y-monitor/types';

export interface BrowserOptionsType extends BaseOptionsFieldsIntegrationType, BrowserSlientOptionsType {}

export interface BrowserSlientOptionsType {
  slientXhr?: Boolean;
  slientDom?: Boolean;
}
