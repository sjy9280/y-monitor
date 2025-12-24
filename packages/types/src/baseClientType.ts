import { BaseOptionsFieldsIntegrationType } from './baseOptionsType';

export interface BaseClientType<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  // sdk名称
  SDK_NAME?: string;

  //SDK版本
  SDK_VERSION: string;

  // 配置项
  options: O;
}
