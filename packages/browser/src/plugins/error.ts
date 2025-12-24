import { BrowserBreadcrumbTypes, BrowserEventTypes, ERROR_TYPE_RE, ErrorTypes } from '@y-monitor/shared';
import { BasePluginType, ReportDataType, Severity } from '@y-monitor/types';
import { BrowserClient } from '../browserClient';
import { _global, extractErrorStack, getLocationHref, getTimestamp, isError, on } from '@y-monitor/utils';
import { addBreadcrumbInBrowser } from '../utils';

export interface ResourceErrorTarget {
  src?: string;
  href?: string;
  localName?: string;
}

const errorPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.ERROR,
  monitor(notify) {
    on(
      _global,
      'error',
      function (e: ErrorEvent) {
        notify(BrowserEventTypes.ERROR, e);
      },
      true
    );
  },
  transform(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget;
    if (target.localName) {
      return resourceTransform(target);
    }
    return codeErrorTransform(errorEvent);
  },
  consumer(transformedData: ReportDataType) {
    const type = transformedData.type === ErrorTypes.RESOURCE ? BrowserBreadcrumbTypes.RESOURCE : BrowserBreadcrumbTypes.CODE_ERROR;
    const breadcrumStack = addBreadcrumbInBrowser.call(this, transformedData, type, Severity.Error);
    this.transport.send(transformedData, breadcrumStack);
  }
};

const resourceMap = {
  img: '图片',
  script: 'JS脚本'
};

function resourceTransform(target: ResourceErrorTarget) {
  return {
    type: ErrorTypes.RESOURCE,
    url: getLocationHref(),
    message: '资源地址: ' + target.src || target.href,
    level: Severity.Low,
    time: getTimestamp(),
    name: `${resourceMap[target.localName] || target.localName}加载失败`
  };
}

function codeErrorTransform(errorEvent: ErrorEvent) {
  // lineno:错误在脚本文件中所位于的行号
  // colno:错误在脚本文件中所位于的列号
  // filename:发生错误的脚本文件的名称的字符串
  // message:描述问题的人类可读的错误信息
  // error:只读属性返回一个表示与事件关联错误的 JavaScript 值
  const { message, filename, lineno, colno, error } = errorEvent;
  let result: ReportDataType;
  if (error && isError(error)) {
    result = extractErrorStack(error, Severity.Normal);
  }
  result || (result = handleNotErrorInstance(message, filename, lineno, colno));
  result.type = ErrorTypes.JAVASCRIPT;
  return result;
}

function handleNotErrorInstance(message: string, filename: string, lineno: number, colno: number) {
  let name: string | ErrorTypes = ErrorTypes.UNKNOWN;
  const url = filename || getLocationHref();
  let msg = message;
  const matches = message.match(ERROR_TYPE_RE);
  if (matches[1]) {
    name = matches[1];
    msg = matches[2];
  }
  const element = {
    url,
    func: ErrorTypes.UNKNOWN_FUNCTION,
    args: ErrorTypes.UNKNOWN,
    line: lineno,
    col: colno
  };
  return {
    url,
    name,
    message: msg,
    level: Severity.Normal,
    time: getTimestamp(),
    stack: [element]
  };
}

export default errorPlugin;
