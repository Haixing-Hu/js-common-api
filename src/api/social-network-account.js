////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { stringifyId, toJSON } from '@haixing_hu/common-decorator';
import {
  SocialNetworkAccount,
  PageRequest,
  SocialNetwork,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('SocialNetworkAccountApi');

/**
 * 提供管理`SocialNetworkAccount`对象的API。
 *
 * @author 胡海星
 */
class SocialNetworkAccountApi {
  /**
   * 列出符合条件的`SocialNetworkAccount`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 所属的用户的用户名；
   *  - `socialNetwork: SocialNetwork|string` 所属的社交网络；
   *  - `appId: string` 所属的社交网络内部的App ID；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<SocialNetworkAccount>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`SocialNetworkAccount`对象的分页数据；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/social-network-account', {
      params,
    }).then((obj) => {
      const page = SocialNetworkAccount.createPage(obj, assignOptions);
      logger.info('Successfully list the SocialNetworkAccount.');
      logger.debug('The page of SocialNetworkAccount is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`SocialNetworkAccount`对象。
   *
   * @param {string|number|bigint} id
   *     `SocialNetworkAccount`对象的ID。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/social-network-account/${stringifyId(id)}`).then((obj) => {
      const result = SocialNetworkAccount.create(obj, assignOptions);
      logger.info('Successfully get the SocialNetworkAccount by ID:', id);
      logger.debug('The SocialNetworkAccount is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`SocialNetworkAccount`对象。
   *
   * @param {SocialNetwork|string} socialNetwork
   *     指定的账号所属的社交网络。
   * @param {string} appId
   *     指定的账号所属的社交网络内部的App ID。
   * @param {string} openId
   *     指定的账号在所属社交网络及其内部App ID下的Open ID。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的
   *     `SocialNetworkAccount`对象；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByOpenId(socialNetwork, appId, openId) {
    checkArgumentType('socialNetwork', socialNetwork, [SocialNetwork, String]);
    checkArgumentType('appId', appId, String);
    checkArgumentType('openId', openId, String);
    const url = `/social-network-account/open-id/${socialNetwork}/${appId}/${openId}`;
    loading.showGetting();
    return http.get(url).then((obj) => {
      const result = SocialNetworkAccount.create(obj, assignOptions);
      logger.info('Successfully get the SocialNetworkAccount by open ID:', socialNetwork, appId, openId);
      logger.debug('The SocialNetworkAccount is:', result);
      return result;
    });
  }

  /**
   * 添加一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount} account
   *     要添加的`SocialNetworkAccount`对象。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(account) {
    checkArgumentType('account', account, SocialNetworkAccount);
    const data = toJSON(account, toJsonOptions);
    loading.showAdding();
    return http.post('/social-network-account', data).then((obj) => {
      const result = SocialNetworkAccount.create(obj, assignOptions);
      logger.info('Successfully add the SocialNetworkAccount:', result.id);
      logger.debug('The added SocialNetworkAccount is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount} account
   *     要更新的`SocialNetworkAccount`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(account) {
    checkArgumentType('account', account, SocialNetworkAccount);
    const url = `/social-network-account/${stringifyId(account.id)}`;
    const data = toJSON(account, toJsonOptions);
    loading.showUpdating();
    return http.put(url, data).then((obj) => {
      const result = SocialNetworkAccount.create(obj, assignOptions);
      logger.info('Successfully update the SocialNetworkAccount by ID %s at:', result.id, result.modifyTime);
      logger.debug('The updated SocialNetworkAccount is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount} account
   *     要更新的`SocialNetworkAccount`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByOpenId(account) {
    checkArgumentType('account', account, SocialNetworkAccount);
    const data = toJSON(account, toJsonOptions);
    const url = `/social-network-account/open-id/${data.socialNetwork}/${data.appId}/${data.openId}`;
    loading.showUpdating();
    return http.put(url, data).then((obj) => {
      const result = SocialNetworkAccount.create(obj, assignOptions);
      logger.info('Successfully update the SocialNetworkAccount by open ID "%s-%s-%s" at:',
        result.socialNetwork,
        result.appId,
        result.openId,
        result.modifyTime);
      logger.debug('The updated SocialNetworkAccount is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要标记删除的`SocialNetworkAccount`对象的ID。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/social-network-account/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the SocialNetworkAccount by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要恢复的`SocialNetworkAccount`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/social-network-account/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the SocialNetworkAccount by ID:', id));
  }

  /**
   * 根据ID，清除一个被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要清除的`SocialNetworkAccount`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/social-network-account/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the SocialNetworkAccount by ID:', id));
  }

  /**
   * 根彻底清除全部已被标记删除的`SocialNetworkAccount`对象。
   *
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/social-network-account/purge')
      .then(() => logger.info('Successfully purge all deleted SocialNetworkAccount.'));
  }
}

const socialNetworkAccountApi = new SocialNetworkAccountApi();

export default socialNetworkAccountApi;
