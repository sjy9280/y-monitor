import { BrowserBreadcrumbTypes } from '@y-monitor/shared';
import { BrowserClient } from './browserClient';
import { Severity } from '@y-monitor/types';
import { getBreadcrumbCategoryInBrowser } from 'packages/utils/src/browser';

export function addBreadcrumbInBrowser(this: BrowserClient, data: any, type: BrowserBreadcrumbTypes, level = Severity.Info, params: any = {}) {
  return this.breadcrumb.push({
    type,
    data,
    category: getBreadcrumbCategoryInBrowser(type),
    level,
    ...params
  });
}
