import { BaseOptionsFieldsIntegrationType} from './baseOptionsType';

export interface BaseClientType<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  options: O;
}
