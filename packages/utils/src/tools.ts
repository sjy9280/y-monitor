import { globalVar, ToStringTypes } from '@monitor/shared';
import { logger } from './logger';
import { IAnyObject } from '@monitor/types';

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
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} [isForced=false] 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced = false): void {
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

export function getUrlWithEnv(): string {
  return getLocationHref();
  return '';
}
