import { BasePluginType } from '@y-monitor/types';
import { BrowserOptionsType } from './types';
import { BrowserClient } from './browserClient';
import xhrPlugin from './plugins/xhr';
import fetchPlugin from './plugins/fetch';
import errorPlugin from './plugins/error';
import domPlugin from './plugins/dom';

function creatBrowserInstance(options: BrowserOptionsType = {}, plugins: BasePluginType[] = []) {
  const browserClient = new BrowserClient(options);
  const browserPlugins = [xhrPlugin, fetchPlugin, errorPlugin, domPlugin];
  browserClient.use([...browserPlugins, ...plugins]);
  return browserClient;
}

const init = creatBrowserInstance;
export { creatBrowserInstance, init, BrowserClient };
