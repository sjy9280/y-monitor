import { BrowserBreadcrumbTypes, BrowserEventTypes } from '@y-monitor/shared';
import { BasePluginType, Severity } from '@y-monitor/types';
import { _global, htmlElementAsString, on, throttle } from '@y-monitor/utils';
import { addBreadcrumbInBrowser } from '../utils';

export interface DomCollectedType {
  // maybe will add doubleClick or other in the future
  category: 'click';
  data: Document;
}

const domPlugin: BasePluginType<BrowserEventTypes> = {
  name: BrowserEventTypes.DOM,
  monitor(notify) {
    if (!('document' in _global)) return;
    const clickThrottle = throttle(notify, this.options.throttleDelayTime);
    on(
      _global.document,
      'click',
      function () {
        clickThrottle(BrowserEventTypes.DOM, {
          category: 'click',
          data: this
        });
      },
      true
    );
  },
  transform(collectedData: DomCollectedType) {
    const htmlString = htmlElementAsString(collectedData.data.activeElement as HTMLElement);
    return htmlString;
  },
  consumer(transformedData: string) {
    if (transformedData) {
      addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.CLICK);
    }
  }
};

export default domPlugin;
