import { ToStringTypes, SDK_NAME, SDK_VERSION } from '@y-monitor/shared';
import { BaseOptionsFieldsIntegrationType, AuthInfo, DeviceInfo, ReportDataType, TransportDataType, BreadcrumbPushDataType } from '@y-monitor/types';
import { isEmpty, isInclude, validateOptionsAndSet, logger, Queue, getOS, getBrowserName, getBrowserVersion } from '@y-monitor/utils';

export abstract class BaseTransport<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  dsn = '';
  apiKey = '';
  beforeDataReport = null;
  queue: Queue;

  constructor() {
    this.queue = new Queue();
  }

  /**
   * 绑定配置
   */
  bindOptions(options: Partial<O>) {
    const { dsn, apiKey, beforeDataReport } = options;
    const optionArr = [
      [dsn, 'dsn', ToStringTypes.String],
      [apiKey, 'apiKey', ToStringTypes.String],
      [beforeDataReport, 'beforeDataReport', ToStringTypes.Function]
    ];
    validateOptionsAndSet.call(this, optionArr);
  }

  /**
   * 获取当前SDK信息
   *
   * @return {*}  {AuthInfo}
   * @memberof BaseTransport
   */
  getAuthInfo(): AuthInfo {
    const result: AuthInfo = {
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME,
      apiKey: this.apiKey
    };
    return result;
  }

  getDeviceInfo(): DeviceInfo {
    const result: DeviceInfo = {
      deviceOs: getOS(),
      deviceName: getBrowserName(),
      deviceVersion: getBrowserVersion()
    };
    return result;
  }

  async send(data: any, breadcrumb: BreadcrumbPushDataType[] = []): Promise<void> {
    let transportData = {
      ...this.getTransportData(data),
      breadcrumb
    };
    if (typeof this.beforeDataReport === 'function') {
      transportData = await this.beforeDataReport(transportData);
      if (!transportData) return;
    }
    let dsn = this.dsn;
    if (isEmpty(dsn)) {
      logger.error('dsn is empty,please check');
      return;
    }
    return this.sendToServer(transportData, dsn);
  }

  /**
   * 判断当前url是不是你配置的dsn
   *
   * @param {string} targetUrl
   * @return {*}  {boolean}
   * @memberof BaseTransport
   */
  isSelfDsn(targetUrl: string): boolean {
    return this.dsn && isInclude(targetUrl, this.dsn);
  }

  /**
   * 最终上报到服务器的方法，需要子类重写
   *
   * @abstract
   * @param {(TransportDataType | any)} data
   * @param {string} url
   * @memberof BaseTransport
   */
  abstract sendToServer(data: TransportDataType | any, url): void;

  /**
   * post方式，子类需要重写
   *
   * @abstract
   * @param {(TransportDataType | any)} data
   * @param {string} url
   * @memberof BaseTransport
   */
  abstract post(data: TransportDataType | any, url: string): void;

  abstract getTransportData(data: ReportDataType): TransportDataType;
}
