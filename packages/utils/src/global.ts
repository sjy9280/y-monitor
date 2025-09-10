import { Logger } from './logger';

export const isBrowserEnv = typeof window !== 'undefined' ? window : 0;

export interface MonitorSupport {
  logger: Logger;
}

interface MonitorGlobal {
  console?: Console;
  __MONITOR__?: MonitorSupport;
}

export function getGlobal() {
  if (isBrowserEnv) return window as unknown as MonitorGlobal;
}

const _global = getGlobal();
const _support = getGlobalMonitorSupport();

function getGlobalMonitorSupport(): MonitorSupport {
  _global.__MONITOR__ = _global.__MONITOR__ || ({} as MonitorSupport);
  return _global.__MONITOR__;
}

export { _global, _support };
