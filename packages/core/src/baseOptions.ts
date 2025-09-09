/**
 * 基础配置绑定
 */

import { BaseOptionsFiledsIntegrationType, BaseOptionsType } from '@monitor/types';

export class BaseOptions<O extends BaseOptionsFiledsIntegrationType = BaseOptionsFiledsIntegrationType> implements BaseOptionsType<O> {
  constructor() {}

  bindOptions(options: O): void {}
}
