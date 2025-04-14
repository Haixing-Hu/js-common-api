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
import {
  LoginResponse,
  RegisterUserParams,
  SocialNetwork,
  Token,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkIdArgumentType from '../utils/check-id-argument-type';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('UserAuthenticateApi');

/**
 * 提供用户认证相关API。
 *
 * @author 胡海星
 */
class UserAuthenticateApi {
  /**
   * 注册新用户。
   *
   * @param {RegisterUserParams|object} params
   *     注册新用户所需的参数，必须符合`RegisterUserParams`的字段定义。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<LoginResponse|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了新注册用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  register(params, showLoading = true) {
    checkArgumentType('params', params, [RegisterUserParams, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(params, toJsonOptions);
    if (showLoading) {
      loading.show('正在注册新用户...');
    }
    return http.post('/authenticate/user/register', data).then((obj) => {
      const response = LoginResponse.create(obj, assignOptions);
      logger.info('Successfully register a new user.');
      return response;
    });
  }

  /**
   * 使用用户名密码登录。
   *
   * @param {string} username
   *     用户名。
   * @param {string} password
   *     密码
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<LoginResponse|ErrorInfo>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByUsername(username, password, showLoading = true) {
    checkArgumentType('username', username, String);
    checkArgumentType('password', password, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON({
      username,
      password,
    }, toJsonOptions);
    if (showLoading) {
      loading.show('正在登录...');
    }
    return http.post('/authenticate/user/login', data).then((obj) => {
      const response = LoginResponse.create(obj, assignOptions);
      logger.info('Successfully login as:', response?.user?.username);
      return response;
    });
  }

  /**
   * 使用手机号码和验证码登录。
   *
   * 注意需要先调用发送验证码接口向指定的手机号码发送验证码。
   *
   * @param {string} mobile
   *     手机号码。
   * @param {string} verifyCode
   *     验证码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<LoginResponse|ErrorInfo>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByMobile(mobile, verifyCode, showLoading = true) {
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('verifyCode', verifyCode, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON({
      mobile,
      verifyCode,
    }, toJsonOptions);
    if (showLoading) {
      loading.show('正在登录...');
    }
    return http.post('/authenticate/user/login', data).then((obj) => {
      const response = LoginResponse.create(obj, assignOptions);
      logger.info('Successfully login as:', response?.user?.username);
      return response;
    });
  }

  /**
   * 使用社交网络的Open ID登录。
   *
   * @param {SocialNetwork|string} socialNetwork
   *     指定的社交网络枚举名称。
   * @param {string} appId
   *     该社交网络下的APP（公众号）的ID。
   * @param {string} openId
   *     用户在该社交网络指定的APP（公众号）下的Open ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<LoginResponse|ErrorInfo>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByOpenId(socialNetwork, appId, openId, showLoading = true) {
    checkArgumentType('socialNetwork', socialNetwork, [SocialNetwork, String]);
    checkArgumentType('appId', appId, String);
    checkArgumentType('openId', openId, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON({
      socialNetwork,
      appId,
      openId,
    }, toJsonOptions);
    if (showLoading) {
      loading.show('正在登录...');
    }
    return http.post('/authenticate/user/login', data).then((obj) => {
      const response = LoginResponse.create(obj);
      logger.info('Successfully login as:', response?.user?.username);
      return response;
    });
  }

  /**
   * 用户注销登录。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此 HTTP 请求的 Promise；若操作成功，解析成功且没有返回值；若操作失败，解析失败并返
   *     回一个`ErrorInfo`对象。
   */
  @Log
  logout(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.show('正在注销...');
    }
    return http.post('/authenticate/user/logout')
      .then(() => logger.info('Successfully logout.'));
  }

  /**
   * 获取当前已登录用户的登录信息。
   *
   * 当前已登录用户的Access Token必须包含在HTTP请求头中。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<LoginResponse|ErrorInfo>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getLoginInfo(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/authenticate/user/info').then((data) => {
      const response = LoginResponse.create(data, assignOptions);
      logger.info('Successfully get the login info of:', response?.user?.username);
      return response;
    });
  }

  /**
   * 检查指定的用户ID和Access Token是否依旧有效。
   *
   * @param {string|number|bigint} userId
   *     用户ID。
   * @param {Token|object} token
   *     当前的存取令牌。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Token|ErrorInfo>}
   *     此 HTTP 请求的 Promise；若指定的用户ID和存取令牌依旧有效，则解析成功并返回
   *     一个`Token`对象，包含该存取令牌的详细信息；否则，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  checkToken(userId, token, showLoading = true) {
    checkIdArgumentType(userId, 'userId');
    checkArgumentType('token', token, [Token, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      id: userId,
      token: token.value,
    }, toJsonOptions);
    if (showLoading) {
      loading.show('正在检查存取令牌...');
    }
    return http.get('/authenticate/user/token/check', {
      params,
      skipAutoErrorHandling: true, // 跳过自动异常处理，即不自动显示弹框展现错误信息
    }).then((data) => {
      const token = Token.create(data, assignOptions);
      logger.info('The token of the user is valid:', token);
      return token;
    });
  }

  /**
   * 将当前登录用户的账号绑定到指定的Open ID。
   *
   * @param {SocialNetwork|string} socialNetwork
   *     指定的社交网络枚举名称。
   * @param {string} appId
   *     该社交网络下的APP（公众号）的ID。
   * @param {string} openId
   *     用户在该社交网络指定的APP（公众号）下的Open ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return
   *     此 HTTP 请求的 Promise。若操作成功，解析成功且没有返回值；若操作失败，解析失败并
   *     返回一个`ErrorInfo`对象。
   */
  @Log
  bindOpenId(socialNetwork, appId, openId, showLoading = true) {
    checkArgumentType('socialNetwork', socialNetwork, [SocialNetwork, String]);
    checkArgumentType('appId', appId, String);
    checkArgumentType('openId', openId, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      socialNetwork,
      appId,
      openId,
    }, toJsonOptions);
    if (showLoading) {
      loading.show('正在绑定账号...');
    }
    return http.post('/authenticate/user/social-network/bind', params).then(() => {
      logger.info('Successfully bind the open ID to the current user:', socialNetwork, appId, openId);
    });
  }

  /**
   * 重置密码。
   *
   * @param {string|null|undefined} mobile
   *     用户的手机号码，若使用电子邮件地址重置则此参数为`null`或`undefined`。
   * @param {string|null|undefined} email
   *     用户的电子邮件地址，若使用手机号码重置则此参数为`null`或`undefined`。
   * @param {string} password
   *     用户的新密码。
   * @param {string} verifyCode
   *     用户通过手机号码或电子邮件收到的验证码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此 HTTP 请求的 Promise；若操作成功，解析成功且没有返回值；若操作失败，解析失败并返
   *     回一个`ErrorInfo`对象。
   */
  @Log
  resetPassword(mobile, email, password, verifyCode, showLoading = true) {
    checkArgumentType('mobile', mobile, String, true);
    checkArgumentType('email', email, String, true);
    checkArgumentType('password', password, String);
    checkArgumentType('verifyCode', verifyCode, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (mobile === null && email === null) {
      throw new Error('mobile 和 email 参数不能同时为 null');
    }
    const params = new URLSearchParams();
    if (mobile) {
      params.append('mobile', mobile);
    }
    if (email) {
      params.append('email', email);
    }
    params.append('password', password);
    params.append('verifyCode', verifyCode);
    if (showLoading) {
      loading.show('正在重置密码...');
    }
    return http.post('/authenticate/user/password/reset', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(() => {
      logger.info('Successfully reset the password.');
    });
  }
}

const userAuthenticateApi = new UserAuthenticateApi();

export default userAuthenticateApi;
