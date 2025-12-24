import { globalVar, ToStringTypes } from '@y-monitor/shared';
import { logger } from './logger';
import { IAnyObject } from '@y-monitor/types';

export function throttle(fn: Function, ms: number): Function {
  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    isThrottled = true;

    fn.apply(this, arguments);

    setTimeout(function () {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

export const nativeToString = Object.prototype.toString;
export function isType(type: string) {
  return function (value: any): boolean {
    return nativeToString.call(value) === `[object ${type}]`;
  };
}

export function toStringAny(target: any, type: ToStringTypes): boolean {
  return nativeToString.call(target) === `[object ${type}]`;
}

export function toStringValidateOption(target: any, targetName: string, expectType: ToStringTypes): boolean {
  if (toStringAny(target, expectType)) return true;
  typeof target !== 'undefined' && logger.error(`${targetName}期望传入:${expectType}类型，当前是:${nativeToString.call(target)}类型`);
  return false;
}

export function validateOptionsAndSet(this: any, targetArr: [any, string, ToStringTypes][]) {
  targetArr.forEach(([target, targetName, expectType]) => toStringValidateOption(target, targetName, expectType) && (this[targetName] = target));
}

/**
 * 检测变量类型
 * @param type
 */
export const variableTypeDetection = {
  isNumber: isType(ToStringTypes.Number),
  isString: isType(ToStringTypes.String),
  isBoolean: isType(ToStringTypes.Boolean),
  isNull: isType(ToStringTypes.Null),
  isUndefined: isType(ToStringTypes.Undefined),
  isSymbol: isType(ToStringTypes.Symbol),
  isFunction: isType(ToStringTypes.Function),
  isObject: isType(ToStringTypes.Object),
  isArray: isType(ToStringTypes.Array),
  isProcess: isType(ToStringTypes.process),
  isWindow: isType(ToStringTypes.Window)
};

/**
 * 检测是否是空字符、undefined、null
 *
 * @export
 * @param {*} wat
 * @return {*}  {boolean}
 */
export function isEmpty(wat: any): boolean {
  return (variableTypeDetection.isString(wat) && wat.trim() === '') || wat === undefined || wat === null;
}

/**
 * 安全的转换对象，包括循环引用，如果是循环引用就返回Circular
 *
 * @export
 * @param {object} obj 需要转换的对象
 * @return {*}  {string}
 */
export function safeStringify(obj: object): string {
  const set = new Set();
  const str = JSON.stringify(obj, function (_key, value) {
    if (set.has(value)) {
      return 'Circular';
    }
    typeof value === 'object' && set.add(value);
    return value;
  });
  set.clear();
  return str;
}

/**
 * 重写对象上面的某个方法
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} [isForced=false] 是否强制重写（可能原先没有该属性）
 */
export function rewirteAttr(source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced = false): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}

/**
 * 获取当前的时间戳
 *
 * @export
 * @return {*}  {number}
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 原子字符中是否包含目标字符
 *
 * @export
 * @param {string} origin 原字符
 * @param {string} target 目标字符
 * @return {*}  {boolean}
 */
export function isInclude(origin: string, target: string): boolean {
  return !!~origin.indexOf(target);
}

type TotalEventName = keyof GlobalEventHandlersEventMap | keyof XMLHttpRequestEventTargetEventMap | keyof WindowEventMap;

/**
 * 添加事件监听器
 *
 * @export
 * @param {{ addEventListener: Function }} target 目标对象
 * @param {TotalEventName} eventName 目标对象上的事件名
 * @param {Function} handler 回调函数
 * @param {(boolean | unknown)} [opitons=false] useCapture默认为false
 */
export function on(target: { addEventListener: Function }, eventName: TotalEventName, handler: Function, opitons: boolean | unknown = false): void {
  target.addEventListener(eventName, handler, opitons);
}

export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
}

/**
 * 如果用户输入console，并且logger是打开的会造成无限递归，执行callback前，会把监听console的行为关掉
 *
 * @export
 * @param {Function} callback
 */
export function silentConsoleScope(callback: Function) {
  globalVar.isLogAddBreadcrumb = false;
  callback();
  globalVar.isLogAddBreadcrumb = true;
}

export function generateUuid(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function getUrlWithEnv(): string {
  return getLocationHref();
}

//获取当前设备信息
export function getOS() {
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) return 'Windows';
  if (ua.indexOf('Mac') !== -1) return 'MacOS';
  if (ua.indexOf('X11') !== -1) return 'UNIX';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('iOS') !== -1) return 'iOS';
  return 'Unknown OS';
}

// 解析浏览器名称
export function getBrowserName() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('edg/')) return 'Microsoft Edge';
  if (ua.includes('chrome/')) return 'Google Chrome';
  if (ua.includes('firefox/')) return 'Mozilla Firefox';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  if (ua.includes('opera/') || ua.includes('opr/')) return 'Opera';
  if (ua.includes('trident/') || ua.includes('msie')) return 'Internet Explorer';

  return '未知浏览器';
}

// 解析浏览器版本
export function getBrowserVersion() {
  const ua = navigator.userAgent.toLowerCase();
  let version = '未知版本';

  // 不同浏览器的版本匹配规则
  const matches = {
    'edg/': ua.match(/edg\/([0-9.]+)/),
    'chrome/': ua.match(/chrome\/([0-9.]+)/),
    'firefox/': ua.match(/firefox\/([0-9.]+)/),
    'safari/': ua.match(/version\/([0-9.]+).*safari/),
    'opr/': ua.match(/opr\/([0-9.]+)/),
    msie: ua.match(/msie ([0-9.]+)/),
    'trident/': ua.match(/trident\/[0-9.]+; rv:([0-9.]+)/)
  };

  for (const [key, match] of Object.entries(matches)) {
    if (match && match[1]) {
      version = match[1];
      break;
    }
  }

  return version;
}

export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string;
  }
  if (variableTypeDetection.isUndefined(target)) {
    return 'undefined';
  }
  return JSON.stringify(target);
}

export function isInstanceOf(wat: any, base: any): boolean {
  try {
    // tslint:disable-next-line:no-unsafe-any
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}

export function isError(wat: any): boolean {
  switch (nativeToString.call(wat)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
