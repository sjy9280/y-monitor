import { BreadcrumbPushDataType } from 'packages/types/src/breadcrumb';

export class Breadcrumb {
  private maxBreadcrumb = 10;
  private beforePushBreadcrumb: unknown = null;

  /**
   * 添加用户行为栈
   */
  push(data: BreadcrumbPushDataType) {}
}
