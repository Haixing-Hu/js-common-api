////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { Software } from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { Log, Logger } from '@haixing_hu/logging';
import { checkArgumentType } from '@haixing_hu/common-util';
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
}

const systemApi = new SystemApi();

export default systemApi;
