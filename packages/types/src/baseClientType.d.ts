import { BaseOptionsType } from './baseOptionsType';

export interface BaseClientType<O extends BaseOptionsType = BaseOptionsType> {
  options: O;
}
