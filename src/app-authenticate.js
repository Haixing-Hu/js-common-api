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
import { Environment, Token } from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('AppAuthenticateApi');

/**
 * 提供应用认证相关API。
 *
 * @author 胡海星
 */
class AppAuthenticateApi {
  /**
   * 通过应用密钥获取应用的存取令牌。
   * <p>
   * 若当前存取令牌不存在或已过期，则会自动生成一个新的存取令牌并返回。此方法通常被管理后台
   * 所调用，且需要用户人工输入应用的存取密钥。
   * <p>
   * <b>注意：</b>出于安全考虑，应避免将存取密钥硬编码保存在客户端。
   *
   * @param {string} code
   *     应用编码。
   * @param {string} securityKey
   *     应用安全密钥。
   * @param {object|Environment} environment
   *     当前客户端的环境信息。
   * @return {Promise<Token>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Token`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  authenticate(code, securityKey, environment = {}) {
    checkArgumentType('code', code, String);
    checkArgumentType('securityKey', securityKey, String);
    checkArgumentType('environment', environment, [Environment, Object]);
    const data = toJSON({
      code,
      securityKey,
      ...environment,
      platform: 'WEB',
    }, toJsonOptions);
    loading.show('正在获取应用令牌...');
    return http.post('/authenticate/app', data).then((data) => {
      const token = Token.create(data, assignOptions);
      logger.info('Successfully authenticate the apps.');
      return token;
    });
  }

  /**
   * 检查应用当前的存取令牌是否合法并依然有效，并获取关于存取令牌的创建时间、生命周期等详细信息。
   *
   * @param {string} code
   *     指定的应用的编码。
   * @param {Token} token
   *     待检查的指定应用的存取令牌。
   * @return {Promise<Token>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Token`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  checkToken(code, token) {
    checkArgumentType('code', code, String);
    checkArgumentType('token', token, Token);
    loading.show('正在检查应用令牌...');
    return http.get(`/authenticate/app/check?code=${code}&token=${token.value}`).then((data) => {
      const token = Token.create(data, assignOptions);
      logger.info('The token is valid.');
      return token;
    });
  }

  /**
   * 通过客户端手上已有的指定应用的旧存取令牌，刷新认证信息并更换最新的存取令牌。
   *
   * 当客户端在调用其他API接口时，通过返回的错误信息，发现自己手上的应用存取令牌已经过期时，
   * 应该调用这个接口重新刷新应用的存取令牌。
   *
   * **注意：** 客户端提供的旧的应用的存取令牌，必须是刚刚过期的上一版的存取令牌，或者当
   * 前未过期的存取令牌（此情况下其实无需刷新认证），否则程序会报令牌错误。
   *
   * @param {string} code
   *     指定的应用的编码。
   * @param {Token} token
   *     待检查的指定应用的存取令牌。
   * @return {Promise<Token>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Token`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  refreshToken(code, token) {
    checkArgumentType('code', code, String);
    checkArgumentType('token', token, Token);
    loading.show('正在刷新应用令牌...');
    return http.get(`/authenticate/app/refresh?code=${code}&token=${token.value}`).then((data) => {
      const token = Token.create(data, assignOptions);
      logger.info('The token was successfully refreshed.');
      return token;
    });
  }
}

const appAuthenticateApi = new AppAuthenticateApi();

export default appAuthenticateApi;
