////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { Software } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import { assignOptions } from './impl/options';

const logger = Logger.getLogger('SystemApi');

/**
 * 提供管理系统信息和系统配置的API。
 *
 * @author 胡海星
 */
class SystemApi {
  /**
   * 获取系统信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Software|ErrorInfo>}
   *     一个`Promise`对象，若操作成功，解析成功并返回一个`Software`对象；否则，
   *     解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/system/info').then((obj) => {
      const system = Software.create(obj, assignOptions);
      logger.info('Successfully get the system information.');
      logger.debug('The system information is:', system);
      return system;
    });
  }

  /**
   * 获取服务器系统时间。
   *
   * @return {string}
   *     系统当前的UTC时间戳，以字符串形式表示。
   */
  @Log
  getTime() {
    return http.get('/system/time').then((timestamp) => {
      logger.info('Successfully get the system time:', timestamp);
      return timestamp;
    });
  }
}

const systemApi = new SystemApi();

export default systemApi;
