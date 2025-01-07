////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { toJSON } from '@qubit-ltd/common-decorator';
import { Device } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import { toJsonOptions } from './impl/options';

const logger = Logger.getLogger('DeviceInitApi');

/**
 * 提供设备初始化的API。
 *
 * @author 胡海星
 */
class DeviceInitApi {
  /**
   * 注册指定的设备。
   *
   * @param {Device} device
   *     待注册的设备。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  register(device, showLoading = true) {
    checkArgumentType('device', device, Device);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(device, toJsonOptions);
    if (showLoading) {
      loading.show('正在注册设备...');
    }
    return http.post('/device/register', data).then(() => {
      logger.info('Device registered successfully:', device.code);
    });
  }

  /**
   * 注销指定的设备。
   *
   * @param {string} code
   *     待注销的设备的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  unregister(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(code, toJsonOptions);
    if (showLoading) {
      loading.show('正在注销设备...');
    }
    return http.put('/device/unregister', data).then(() => {
      logger.info('Device unregistered successfully:', code);
    });
  }

  /**
   * 解绑指定的设备。
   *
   * @param {string} code
   *     待解绑的设备的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  unbound(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(code, toJsonOptions);
    if (showLoading) {
      loading.show('正在解绑设备...');
    }
    return http.put('/device/unbound', data).then(() => {
      logger.info('Device unbound successfully:', code);
    });
  }
}

const deviceInitApi = new DeviceInitApi();

export default deviceInitApi;
