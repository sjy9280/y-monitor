import { BasePluginType } from '@y-monitor/types';
import { BrowserOptionsType } from './types';
import { BrowserClient } from './browserClient';
import xhrPlugin from './plugins/xhr';

function creatBrowserInstance(options: BrowserOptionsType = {}, plugins: BasePluginType[] = []) {
  const browserClient = new BrowserClient(options);
  const browserPlugins = [xhrPlugin];
  browserClient.use([...browserPlugins, ...plugins]);
  return browserClient;
}

const init = creatBrowserInstance;
export { creatBrowserInstance, init, BrowserClient };
