import { _global, _support } from './global';
const PREFIX = 'Y-MONITOR Logger';

export class Logger {
  private enabled = false;
  private _console: Console = {} as Console;
  constructor() {
    _global.console = console || _global.console;
    if (console || _global.console) {
      const logType = ['log', 'debug', 'info', 'warn', 'error', 'assert'];
      logType.forEach((level) => {
        if (!(level in _global.console)) return;
        this._console[level] = _global.console[level];
      });
    }
  }
  disable(): void {
    this.enabled = false;
  }

  bindOptions(debug: boolean): void {
    this.enabled = debug ? true : false;
  }

  enable(): void {
    this.enabled = true;
  }

  getEnableStatus() {
    return this.enabled;
  }

  log(...args: any[]): void {
    if (!this.enabled) {
      return;
    }
    this._console.log(`${PREFIX}[Log]:`, ...args);
  }
  warn(...args: any[]): void {
    if (!this.enabled) {
      return;
    }
    this._console.warn(`${PREFIX}[Warn]:`, ...args);
  }

  /**
   * error不需要开启enable也要打印出来，提示用户错误信息
   *
   * @param {...any[]} args
   * @memberof Logger
   */
  error(...args: any[]): void {
    this._console.error(`${PREFIX}[Error]:`, ...args);
  }
}

let loggerInstance: Logger | null = null;

function initLogger() {
  if (!loggerInstance) {
    loggerInstance = new Logger();
    // 延迟设置到 _support 中
    if (_support) {
      _support.logger = loggerInstance;
    }
  }
  return loggerInstance;
}

// 导出函数而不是直接的值
export const logger = {
  disable: () => initLogger().disable(),
  bindOptions: (debug: boolean) => initLogger().bindOptions(debug),
  enable: () => initLogger().enable(),
  getEnableStatus: () => initLogger().getEnableStatus(),
  log: (...args: any[]) => initLogger().log(...args),
  warn: (...args: any[]) => initLogger().warn(...args),
  error: (...args: any[]) => initLogger().error(...args)
};
