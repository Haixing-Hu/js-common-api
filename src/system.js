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
   * @return {Promise<Software>}
   *     一个`Promise`对象，若操作成功，解析成功并返回一个`Software`对象；否则，
   *     解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo() {
    loading.showGetting();
    return http.get('/system/info').then((data) => {
      const system = Software.create(data, assignOptions);
      logger.info('Successfully get the system information.');
      logger.debug('The system information is:', system);
      return system;
    });
  }
}

const systemApi = new SystemApi();

export default systemApi;