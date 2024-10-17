////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { toJSON } from '@haixing_hu/common-decorator';
import {
  LoginResponse,
  RegisterUserParams,
  SocialNetwork,
  Token,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
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
   * @param {object|RegisterUserParams} params
   *     注册新用户所需的参数，必须符合`RegisterUserParams`的字段定义。
   * @return {Promise<LoginResponse>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了新注册用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  register(params) {
    checkArgumentType('params', params, [RegisterUserParams, Object]);
    loading.show('正在注册新用户...');
    return http.post('/authenticate/user/register', toJSON(params, toJsonOptions)).then((data) => {
      const response = LoginResponse.create(data, assignOptions);
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
   * @return {Promise<LoginResponse>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByUsername(username, password) {
    checkArgumentType('username', username, String);
    checkArgumentType('password', password, String);
    const params = toJSON({
      username,
      password,
    }, toJsonOptions);
    loading.show('正在登录...');
    return http.post('/authenticate/user/login', params).then((data) => {
      const response = LoginResponse.create(data, assignOptions);
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
   * @return {Promise<LoginResponse>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByMobile(mobile, verifyCode) {
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('verifyCode', verifyCode, String);
    const params = toJSON({
      mobile,
      verifyCode,
    }, toJsonOptions);
    loading.show('正在登录...');
    return http.post('/authenticate/user/login', params).then((data) => {
      const response = LoginResponse.create(data, assignOptions);
      logger.info('Successfully login as:', response?.user?.username);
      return response;
    });
  }

  /**
   * 使用社交网络的Open ID登录。
   *
   * @param {SocialNetwork} socialNetwork
   *     指定的社交网络枚举名称。
   * @param {string} appId
   *     该社交网络下的APP（公众号）的ID。
   * @param {string} openId
   *     用户在该社交网络指定的APP（公众号）下的Open ID。
   * @return {Promise<LoginResponse>}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了指定用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  loginByOpenId(socialNetwork, appId, openId) {
    checkArgumentType('socialNetwork', socialNetwork, SocialNetwork);
    checkArgumentType('appId', appId, String);
    checkArgumentType('openId', openId, String);
    const params = toJSON({
      socialNetwork,
      appId,
      openId,
    }, toJsonOptions);
    loading.show('正在登录...');
    return http.post('/authenticate/user/login', params).then((data) => {
      const response = LoginResponse.create(data);
      logger.info('Successfully login as:', response?.user?.username);
      return response;
    });
  }

  /**
   * 用户注销登录。
   *
   * @return {Promise}
   *     此 HTTP 请求的 Promise；若操作成功，解析成功且没有返回值；若操作失败，解析失败并返
   *     回一个`ErrorInfo`对象。
   */
  @Log
  logout() {
    loading.show('正在注销...');
    return http.post('/authenticate/user/logout')
      .then(() => logger.info('Successfully logout.'));
  }

  /**
   * 获取当前已登录用户的登录信息。
   * <p>
   * 当前已登录用户的Access Token必须包含在HTTP请求头中。
   *
   * @returns {LoginResponse}
   *     此 HTTP 请求的 Promise，若操作成功，解析成功并返回一个`LoginResponse`对象，包含
   *     了当前用户的登录信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getLoginInfo() {
    loading.showGetting();
    return http.get('/authenticate/user/info').then((data) => {
      const response = LoginResponse.create(data, assignOptions);
      logger.info('Successfully get the login info of:', response?.user?.username);
      return response;
    });
  }

  /**
   * 检查指定的用户ID和Access Token是否依旧有效。
   *
   * @param {string} userId
   *     用户ID。
   * @param {Token} token
   *     当前的存取令牌。
   * @return {Promise<Token>}
   *     此 HTTP 请求的 Promise；若指定的用户ID和存取令牌依旧有效，则解析成功并返回
   *     一个`Token`对象，包含该存取令牌的详细信息；否则，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  checkToken(userId, token) {
    checkArgumentType('userId', userId, String);
    checkArgumentType('token', token, Token);
    const params = toJSON({
      id: userId,
      token: token.value,
    }, toJsonOptions);
    loading.show('正在检查存取令牌...');
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
   * @param {SocialNetwork} socialNetwork
   *     指定的社交网络枚举名称。
   * @param {string} appId
   *     该社交网络下的APP（公众号）的ID。
   * @param {string} openId
   *     用户在该社交网络指定的APP（公众号）下的Open ID。
   * @return
   *     此 HTTP 请求的 Promise。若操作成功，解析成功且没有返回值；若操作失败，解析失败并
   *     返回一个`ErrorInfo`对象。
   */
  @Log
  bindOpenId(socialNetwork, appId, openId) {
    checkArgumentType('socialNetwork', socialNetwork, SocialNetwork);
    checkArgumentType('appId', appId, String);
    checkArgumentType('openId', openId, String);
    const params = toJSON({
      socialNetwork,
      appId,
      openId,
    }, toJsonOptions);
    loading.show('正在绑定账号...');
    return http.post('/authenticate/user/social-network/bind', params).then(() => {
      logger.info('Successfully bind the open ID to the current user:', socialNetwork, appId, openId);
    });
  }
}

const userAuthenticateApi = new UserAuthenticateApi();

export default userAuthenticateApi;
