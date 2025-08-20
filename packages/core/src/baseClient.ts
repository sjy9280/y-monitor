import { EventTypes } from '@monitor/shared';
import { BaseClientType, BaseOptionsType, BasePluginType, LogTypes } from '@monitor/types';
import { Subscribe } from './subscribe';

export abstract class BaseClient<O extends BaseOptionsType, E extends EventTypes = EventTypes> implements BaseClientType {
  SDK_NAME: string;
  options: O;
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
