import { BrowserEventTypes, HttpTypes } from '@y-monitor/shared';
import { BasePluginType, HttpCollectedType, HttpTransformType, voidFun } from '@y-monitor/types';
import { BrowserClient } from '../browserClient';
import { _global, getTimestamp, rewirteAttr } from '@y-monitor/utils';
import { httpTransform, httpTransformedDataConsumer } from './xhr';

const fetchPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.FETCH,
  monitor(notify) {
    fetchMonitor.call(this, notify);
  },
  transform(collectedData: HttpCollectedType) {
    httpTransform(collectedData);
  },
  consumer(transformedData: HttpTransformType) {
    httpTransformedDataConsumer.call(this, transformedData);
  }
};

function fetchMonitor(this: BrowserClient, notify: (eventName: BrowserEventTypes, data: any) => void) {
  const { options, transport } = this;
  if (!('fetch' in _global)) return;
  rewirteAttr(_global, BrowserEventTypes.FETCH, (originalFn: voidFun) => {
    return function (url: string, config: Partial<Request> = {}): void {
      const sTime = getTimestamp();
      const method = (config && config.method) || 'GET';
      const httpCollect: HttpCollectedType = {
        request: {
          httpType: HttpTypes.FETCH,
          url,
          method,
          data: config && config.body
        },
        time: sTime,
        response: {}
      };
      const headers = new Headers(config.headers || {});
      Object.assign(headers, {
        setRequestHeader: headers.set
      });
      options.setTraceId(url, (headerFieldName: string, traceId: string) => {
        httpCollect.request.traceId = traceId;
        headers.set(headerFieldName, traceId);
      });
      options.beforeAjaxSend && options.beforeAjaxSend({ method, url }, headers);
      config = {
        ...config,
        headers
      };
      const isBlock = transport.isSelfDsn(url) || options.isFilterHttpUrl(url);
      return originalFn.apply(_global, [url, config]).then(
        (res: Response) => {
          const resClone = res.clone();
          const eTime = getTimestamp();
          httpCollect.elapsedTime = eTime - sTime;
          httpCollect.response.status = resClone.status;
          resClone.text().then((data) => {
            if (isBlock) return;
            httpCollect.response.data = data;
            notify(BrowserEventTypes.FETCH, httpCollect);
          });
          return res;
        },
        (err: Error) => {
          if (isBlock) return;
          const eTime = getTimestamp();
          httpCollect.elapsedTime = eTime - sTime;
          httpCollect.response.status = 0;
          notify(BrowserEventTypes.FETCH, httpCollect);
          throw err;
        }
      );
    };
  });
}

export default fetchPlugin;
