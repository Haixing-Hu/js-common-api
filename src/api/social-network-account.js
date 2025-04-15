////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { SocialNetwork, SocialNetworkAccount } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import { getByKeyImpl, getImpl } from './impl/get-impl';
import { listImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';
import { updateByKeyImpl, updateImpl } from './impl/update-impl';

/**
 * 提供管理`SocialNetworkAccount`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class SocialNetworkAccountApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = SocialNetworkAccount;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'username', type: String },
    { name: 'socialNetwork', type: [SocialNetwork, String] },
    { name: 'appId', type: String },
    { name: 'deleted', type: Boolean },
    { name: 'createTimeStart', type: String },
    { name: 'createTimeEnd', type: String },
    { name: 'modifyTimeStart', type: String },
    { name: 'modifyTimeEnd', type: String },
    { name: 'deleteTimeStart', type: String },
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`SocialNetworkAccount`对象。
   *
   * @param {PageRequest|object} pageRequest
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<SocialNetworkAccount>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`SocialNetworkAccount`对象的分页数据；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/social-network-account', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 获取指定的`SocialNetworkAccount`对象。
   *
   * @param {string|number|bigint} id
   *     `SocialNetworkAccount`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/social-network-account/{id}', id, showLoading);
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的
   *     `SocialNetworkAccount`对象；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByOpenId(socialNetwork, appId, openId, showLoading = true) {
    const url = `/social-network-account/open-id/${socialNetwork}/${appId}/{openId}`;
    return getByKeyImpl(this, url, 'openId', openId, showLoading);
  }

  /**
   * 添加一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount|object} account
   *     要添加的`SocialNetworkAccount`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(account, showLoading = true) {
    return addImpl(this, '/social-network-account', account, showLoading);
  }

  /**
   * 根据ID，更新一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount|object} entity
   *     要更新的`SocialNetworkAccount`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/social-network-account/{id}', entity, showLoading);
  }

  /**
   * 根据编码，更新一个`SocialNetworkAccount`对象。
   *
   * @param {SocialNetworkAccount|object} entity
   *     要更新的`SocialNetworkAccount`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<SocialNetworkAccount|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`SocialNetworkAccount`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByOpenId(entity, showLoading = true) {
    const url = `/social-network-account/open-id/${entity.socialNetwork}/${entity.appId}/{openId}`;
    return updateByKeyImpl(this, url, 'openId', entity, showLoading);
  }

  /**
   * 根据ID，标记删除一个`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要标记删除的`SocialNetworkAccount`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/social-network-account/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`SocialNetworkAccount`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量标记删除的`SocialNetworkAccount`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/social-network-account/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要恢复的`SocialNetworkAccount`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/social-network-account/{id}', id, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`SocialNetworkAccount`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/social-network-account/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {string} id
   *     要清除的`SocialNetworkAccount`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/social-network-account/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/social-network-account/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`SocialNetworkAccount`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`SocialNetworkAccount`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/social-network-account/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`SocialNetworkAccount`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`SocialNetworkAccount`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/social-network-account/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底清除指定的`SocialNetworkAccount`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`SocialNetworkAccount`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/social-network-account/batch/erase', ids, showLoading);
  }
}

const socialNetworkAccountApi = new SocialNetworkAccountApi();

export default socialNetworkAccountApi;
