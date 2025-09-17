import { EventTypes } from '@y-monitor/shared';
import { BaseClientType, BaseOptionsFieldsIntegrationType, BaseOptionsType, BasePluginType, LogTypes } from '@y-monitor/types';
import { Subscribe } from './subscribe';
import { Breadcrumb } from './breadcrumb';

export abstract class BaseClient<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType, E extends EventTypes = EventTypes>
  implements BaseClientType
{
  SDK_NAME: string;
  options: O;
  abstract breadcrumb: Breadcrumb;

  constructor(options: O) {
    this.options = options;
  }

  // 引用插件
  use(plugins: BasePluginType<E>[]) {
    const subscribe = new Subscribe<E>();
    plugins.forEach((plugin) => {
      plugin.monitor.call(this, subscribe.notify.bind(subscribe));
      const wrapperTransform = (...args: any[]) => {
        const res = plugin.transform.apply(this, args);
        plugin.consumer.call(this, res);
      };
      subscribe.watch(plugin.name, wrapperTransform);
    });
  }

  getOptions() {
    return this.options;
  }

  // 判断当前插件是否启用
  abstract isPluginEnable(name: EventTypes): boolean;

  // 每个plugin有自己上传data的方式
  abstract log(data: LogTypes): void;
}
