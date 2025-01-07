////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2017 - 2024.
//    Nanjing Smart Medical Investment Operation Service Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getSearchParam, removeSearchParam, redirect, isWechat } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import { alert, loading } from '@qubit-ltd/common-ui';
import config from '@qubit-ltd/config';
import wechatApi from '../api/wechat';

/**
 * `Wechat`类的logger。
 *
 * @type {Logger}
 * @private
 */
const logger = Logger.getLogger('Wechat');

/**
 * 提供微信登录相关函数。
 *
 * @author胡海星
 */
class Wechat {
  /**
   * 微信登陆，获取当前用户的微信open ID。
   *
   * @return
   *   当前用户的微信Open ID.
   * @author 胡海星
   */
  @Log
  async login() {
    // 调试模式下，使用预定义的 openID 简化流程
    logger.debug('The config is:', config);
    if (config.has('wechat_debug_open_id')) {
      const openId = config.get('wechat_debug_open_id');
      logger.debug('Use the debug open ID:', openId);
      return openId;
    }
    // 检查是否微信环境
    if (!isWechat()) {
      await alert.error('错误', '请使用微信扫码打开此页面。');
      return null;
    }
    // 检查参数是否带有微信授权码
    const code = getSearchParam('code');
    logger.debug('The code parameter in the URL is:', code);
    if (code) {
      // 利用微信授权码获取微信 Open ID
      await alert.debug(`当前页面URL包含了微信授权码: ${code}`);
      const openId = await this.__getOpenId(code);
      await alert.debug(`获取微信 Open ID 成功：${openId}`);
      // work around: 某些情况下执行到此用户的openId依然是undefined或null
      if (!openId) {
        await alert.debug('获取微信 Open ID 失败');
        return this.__processError();
      }
      return openId;
    } else {
      // 获取微信授权码，并跳转至微信授权页面，授权成功会重新跳回本页面并带上授权码参数
      logger.debug('No code parameter found the URL.');
      await alert.debug('当前页面URL没有微信授权码，即将获取微信授权码');
      await this.__getAuthorizePageUrl();
      return null;
    }
  }

  /**
   * 在执行到需要openId的代码时，如果openId依然是undefined或null，则调用此程序
   * 显示错误信息并重载当前网页，重新登录流程。
   *
   * @private
   */
  @Log
  async __processError() {
    await alert.error('错误', '无法正确获取微信授权，稍后将自动刷新页面重试');
    // 把当前页面网址参数中的code去除，并转换为标准形式
    const url = removeSearchParam('code');
    logger.debug('The URL of current page without "code" parameter is:', url);
    await alert.debug(`即将自动刷新页面，页面地址为：${url}`);
    redirect(url);
    return null;
  }

  /**
   * 获取微信授权码，并跳转至微信授权页面，授权成功会重新跳回本页面并带上授权码参数。
   *
   * @private
   */
  @Log
  async __getAuthorizePageUrl() {
    // 把当前页面网址参数中的code去除，并转换为标准形式
    const url = removeSearchParam('code');
    logger.debug('The URL of current page without "code" parameter is:', url);
    await alert.debug(`即将获取微信授权地址，回跳地址为：${url}`);
    loading.show('正在获取授权地址URL\n请稍后……');
    const response = await wechatApi.getAuthorizationPageUrl(url);
    // 跳转到微信认证页面，该页面认证完毕会回跳回本页面并且带上code=xxx的参数
    logger.info('Redirect to WeChat authorization page:', response);
    await alert.debug(`即将跳转到微信授权地址：${response}`);
    loading.show('正在跳转到授权页面\n请稍后……');
    redirect(response);
    return null;
  }

  /**
   * 利用微信授权码获取微信 Open Id
   *
   * @param code
   *    微信授权码
   * @return
   *    当前用户的微信 Open ID
   * @private
   */
  @Log
  async __getOpenId(code) {
    loading.show('正在获取Open ID\n请稍后……');
    await alert.debug(`即将通过授权码获取微信Open ID，授权码为：${code}`);
    const openId = await wechatApi.getOpenId(code);
    loading.clear();
    logger.info('Wechat openId =', openId);
    await alert.debug(`获取到微信Open ID：${openId}`);
    return openId;
  }
}

const wechat = new Wechat();

export default wechat;
