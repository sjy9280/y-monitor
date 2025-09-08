import { BaseOptionsFiledsIntegrationType } from '@monitor/types';

export abstract class BaseTransport<O extends BaseOptionsFiledsIntegrationType = BaseOptionsFiledsIntegrationType> {
  dsn = '';
}
