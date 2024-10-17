////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';

const logger = Logger.getLogger('WechatApi');

/**
 * 提供微信相关服务API
 *
 * @author 胡海星
 */
class WechatApi {
  /**
   * 获取 JS-SDK 用于获取授权的配置信息。
   *
   * @param {string} url
   *     请求网页的URL，注意可能带有查询参数。
   * @returns
   *     JS-SDK 用于获取授权的配置信息。
   */
  @Log
  getJsConfig(url) {
    checkArgumentType('url', url, String);
    logger.info('Getting the WeChat JS-SDK configuration for URL:', url);
    loading.show('正在获取微信JS-SDK配置信息...');
    // 注意：我们没有采用直接拼接URL的方式带上query string，
    // 因为需要对参数url做 URI encoding，
    // 否则如果参数url中也带有hash或query，就会出错。
    return http.get('/wechat/js/jsconfig', {
      params: {
        url,
      },
    }).then(() => logger.info('Successfully get the WeChat JS-SDK configuration for URL:', url));
  }

  /**
   * 获取微信公众号授权页面URL。
   *
   * 调用此函数后即可将当前网址替换为这个返回的URL，进行微信公众号授权；授权完毕后微信会跳转回
   * 指定的回跳URL，并加上一个一次性授权码参数，该参数用于进一步调用微信API获取当前用户的openId。
   *
   * @param {string} url
   *     发起授权申请的网页的URL，授权成功此函数返回微信授权页面的URL，用户同意授权后页面会重
   *     新跳转回此URL并带上授权码参数(参数名为"code")。
   * @returns
   *     微信公众号授权页面URL，其中包含了所需的参数以及授权完毕回跳URL。
   */
  @Log
  getAuthorizationPageUrl(url) {
    checkArgumentType('url', url, String);
    logger.info('Getting the WeChat authorization page URL for URL:', url);
    loading.show('正在获取微信公众号授权页面URL...');
    // 注意：我们没有采用直接拼接URL的方式带上query string，
    // 因为需要对参数url做 URI encoding，
    // 否则如果参数url中也带有hash或query，就会出错。
    return http.get('/wechat/js/authorization', {
      params: {
        url,
      },
    }).then(() => logger.info('Successfully get the WeChat authorization page URL for URL:', url));
  }

  /**
   * 获取微信当前用户的openId。
   *
   * @param {string} code
   *     通过微信公众号授权获取的一次性授权码。
   * @return
   *     当前用户在指定公众号中的openId。
   */
  @Log
  getOpenId(code) {
    checkArgumentType('code', code, String);
    logger.info('Getting the WeChat open ID for code:', code);
    loading.show('正在获取微信Open ID...');
    return http.get(`/wechat/js/open-id/${code}`)
      .then(() => logger.info('Successfully get the WeChat open ID for code:', code));
  }

  // /**
  //  * 根据微信的Open ID获取系统中对应的已注册用户的信息。
  //  *
  //  * @param {string} openId
  //  *     指定的微信Open ID.
  //  * @return {Promise<UserInfo>}
  //  *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`UserInfo`对象；
  //  *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
  //  */
  // @Log
  // getRegisteredUser(openId) {
  //   checkArgumentType('openId', openId, String);
  //   return http.get(`/wechat/js/user/${openId}`).then((data) => {
  //     const user = UserInfo.create(data, assignOptions);
  //     logger.info('Successfully the registered user of WeChat openID %s:', openId, user);
  //     return user;
  //   });
  // }
  //
  // /**
  //  * 根据用户的姓名、手机号验证该用户是否购买过保险。
  //  *
  //  * 调用该函数将发送一个验证码到用户手机上。
  //  *
  //  * @param {string} openId
  //  *     用户的微信Open ID。
  //  * @param {string} name
  //  *     用户姓名。
  //  * @param {string} mobile
  //  *     用户手机号。
  //  * @return
  //  *     若指定用户存在并购买了保险，则返回该用户的证件信息，并发送一个验证码到用户的手机上；
  //  *     若有多个购买了保险的同名同手机用户，则返回数字300；(FIXME!!!)
  //  *     若该用户未购买保险，则HTTP状态码非200，报错，返回一个`ErrorInfo`对象描述错误。
  //  */
  // @Log
  // verifyByNameMobile(openId, name, mobile) {
  //   checkArgumentType('openId', openId, String);
  //   checkArgumentType('name', name, String);
  //   checkArgumentType('mobile', mobile, String);
  //   return http.post(`/wechat/js/user/verify/mobile/${mobile}?name=${name}&openId=${openId}`);
  // }
  //
  // /**
  //  * 根据用户的姓名、手机号和证件验证该用户是否购买过保险。
  //  *
  //  * 调用该函数将发送一个验证码到用户手机上。
  //  *
  //  * @param {string} openId
  //  *     用户的微信Open ID。
  //  * @param {UserInfo} user
  //  *     用户信息。
  //  * @return
  //  *     若指定用户存在并购买了保险，则返回该用户的证件信息，并发送一个验证码到用户的手机上；
  //  *     若该用户未购买保险，则HTTP状态码非200，报错，返回一个`ErrorInfo`对象描述错误。
  //  */
  // @Log
  // verifyByUserInfo(openId, user) {
  //   checkArgumentType('openId', openId, String);
  //   checkArgumentType('user', user, UserInfo);
  //   user = removeEmptyFields(user); // 移除所有空字段
  //   return http.post(`/wechat/js/user/verify/${openId}`, user);
  // }
  //
  // /**
  //  * 根据用户的微信Open ID和收到的手机验证码注册新用户。
  //  *
  //  * @param {string} openId
  //  *     用户的微信Open ID。
  //  * @param {string} verifyCode
  //  *     用户收到的手机验证码。
  //  * @param {UserInfo} user
  //  *     当前用户的信息。
  //  * @return
  //  *     此 HTTP 请求的 Promise。
  //  */
  // @Log
  // registerByVerifyCode(openId, verifyCode, user) {
  //   checkArgumentType('openId', openId, String);
  //   checkArgumentType('verifyCode', verifyCode, String);
  //   checkArgumentType('user', user, UserInfo);
  //   const data = toJSON(user, toJsonOptions);
  //   return http.post(`/wechat/js/user/${openId}/${verifyCode}`, data);
  // }
  //
  // /**
  //  * 注销当前登录的用户。
  //  *
  //  * @param {string} openId
  //  *     当前登录用户的微信Open ID。
  //  * @return
  //  *     此 HTTP 请求的 Promise。
  //  */
  // @Log
  // logoff(openId) {
  //   checkArgumentType('openId', openId, String);
  //   return http.delete(`/wechat/js/user/${openId}`);
  // }
}

const wechatApi = new WechatApi();

export default wechatApi;
