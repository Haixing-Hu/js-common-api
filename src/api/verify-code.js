////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { VerifyScene } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';

const logger = Logger.getLogger('VerifyCodeApi');

/**
 * 提供验证码发送服务API
 *
 * @author 胡海星
 */
class VerifyCodeApi {
  /**
   * 向指定的手机号码发送短信验证码。
   *
   * @param {string} mobile
   *     指定的手机号码。
   * @param {VerifyScene|string} scene
   *     验证码使用场景的枚举值，此参数必须是个`VerifyScene`对象或字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return
   *     此 HTTP 请求的 Promise。
   */
  @Log
  sendBySms(mobile, scene, showLoading = true) {
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('scene', scene, [VerifyScene, String]);
    checkArgumentType('showLoading', showLoading, Boolean);
    logger.info('Sending verification code to the mobile:', mobile);
    const params = new URLSearchParams();
    params.append('mobile', mobile);
    params.append('scene', String(scene));
    if (showLoading) {
      loading.show('正在发送手机验证码...');
    }
    return http.post('/verify-code/sms', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(() => logger.info('Successfully send the verification code to the mobile:', mobile));
  }

  /**
   * 向指定的电子邮箱发送短信验证码。
   *
   * @param {string} email
   *     指定的电子邮箱地址。
   * @param {VerifyScene|string} scene
   *     验证码使用场景的枚举值，此参数必须是个`VerifyScene`对象或字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return
   *     此 HTTP 请求的 Promise。
   */
  @Log
  sendByEmail(email, scene, showLoading = true) {
    checkArgumentType('email', email, String);
    checkArgumentType('scene', scene, [VerifyScene, String]);
    checkArgumentType('showLoading', showLoading, Boolean);
    logger.info('Sending verification code to the email:', email);
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('scene', String(scene));
    if (showLoading) {
      loading.show('正在发送邮箱验证码...');
    }
    return http.post('/verify-code/email', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(() => logger.info('Successfully send the verification code to the email:', email));
  }
}

const verifyCodeApi = new VerifyCodeApi();

export default verifyCodeApi;
