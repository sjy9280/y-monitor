import { Logger } from './logger';
import { variableTypeDetection } from './tools';

export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);

export interface MonitorSupport {
  logger: Logger;
}

interface MonitorGlobal {
  console?: Console;
  __MONITOR__?: MonitorSupport;
}

export function getGlobal<T>() {
  if (isBrowserEnv) return window as unknown as MonitorGlobal & T;
}

const _global = getGlobal<Window>();
const _support = getGlobalMonitorSupport();

function getGlobalMonitorSupport(): MonitorSupport {
  _global.__MONITOR__ = _global.__MONITOR__ || ({} as MonitorSupport);
  return _global.__MONITOR__;
}

export { _global, _support };

export function supportsHistory(): boolean {
  const chrome = (_global as any).chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}
