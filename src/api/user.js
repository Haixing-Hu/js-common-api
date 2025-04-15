////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { State, StatefulInfo, User, UserInfo } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { deleteImpl } from './impl/delete-impl';
import exportImpl from './impl/export-impl';
import {
  getByKeyImpl,
  getImpl,
  getInfoByKeyImpl,
  getInfoImpl,
  getPropertyImpl,
} from './impl/get-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import { purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { restoreImpl } from './impl/restore-impl';
import { updateImpl, updatePropertyImpl } from './impl/update-impl';

/**
 * 提供管理`User`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class UserApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = User;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = UserInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'name', type: String },
    { name: 'nickname', type: String },
    { name: 'organizationId', type: [String, Number, BigInt] },
    { name: 'organizationCode', type: String },
    { name: 'organizationName', type: String },
    { name: 'state', type: [State, String] },
    { name: 'lastLoginTimeStart', type: String },
    { name: 'lastLoginTimeEnd', type: String },
    { name: 'validTimeStart', type: String },
    { name: 'validTimeEnd', type: String },
    { name: 'expiredTimeStart', type: String },
    { name: 'expiredTimeEnd', type: String },
    { name: 'predefined', type: Boolean },
    { name: 'test', type: Boolean },
    { name: 'deleted', type: Boolean },
    { name: 'createTimeStart', type: String },
    { name: 'createTimeEnd', type: String },
    { name: 'modifyTimeStart', type: String },
    { name: 'modifyTimeEnd', type: String },
    { name: 'deleteTimeStart', type: String },
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`User`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `nickname: string` 昵称中应该包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `state: State|String` 状态；
   *  - `lastLoginTimeStart: string`最后一次登录时间范围的（闭区间）起始值；
   *  - `lastLoginTimeEnd: string` 最后一次登录时间范围的（闭区间）结束值；
   *  - `validTimeStart: string`账户生效时间范围的（闭区间）起始值；
   *  - `validTimeEnd: string` 账户生效时间范围的（闭区间）结束值；
   *  - `expiredTimeStart: string`账户过期时间范围的（闭区间）起始值；
   *  - `expiredTimeEnd: string` 账户过期时间范围的（闭区间）结束值；
   *  - `predefined: boolean` 是否是预定义数据；
   *  - `test: boolean` 是否是测试数据；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - sortField: string 用于排序的属性名称（CamelCase形式）；
   *  - sortOrder: SortOrder 指定是正序还是倒序。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<User>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`User`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    return listImpl(this, '/user', pageRequest, criteria, sortRequest, showLoading, { transformUrls });
  }

  /**
   * 列出符合条件的`User`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *    查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `nickname: string` 昵称中应该包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `state: State` 状态；
   *  - `lastLoginTimeStart: string`最后一次登录时间范围的（闭区间）起始值；
   *  - `lastLoginTimeEnd: string` 最后一次登录时间范围的（闭区间）结束值；
   *  - `validTimeStart: string`账户生效时间范围的（闭区间）起始值；
   *  - `validTimeEnd: string` 账户生效时间范围的（闭区间）结束值；
   *  - `expiredTimeStart: string`账户过期时间范围的（闭区间）起始值；
   *  - `expiredTimeEnd: string` 账户过期时间范围的（闭区间）结束值；
   *  - `predefined: boolean` 是否是预定义数据；
   *  - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<UserInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`User`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/user/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 获取指定的`User`对象。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    return getImpl(this, '/user/{id}', id, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`User`对象。
   *
   * @param {string} username
   *     `User`对象对应的用户的用户名。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByUsername(username, transformUrls = true, showLoading = true) {
    return getByKeyImpl(this, '/user/username/{username}', 'username', username, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`User`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<UserInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`UserInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/user/{id}/info', id, showLoading);
  }

  /**
   * 获取指定的`User`对象的基本信息。
   *
   * @param {string} username
   *     `User`对象对应的用户的用户名。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<UserInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`UserInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByUsername(username, showLoading = true) {
    return getInfoByKeyImpl(this, '/user/username/{username}/info', 'username', username, showLoading);
  }

  /**
   * 获取指定的`User`对象所属机构的基本信息。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`User`对象所属机构的
   *     基本信息；注意若当前登录用户没有所属机构，返回值可以是`null`；若操作失败，则解析失败
   *     并返回一个`ErrorInfo`对象。
   */
  @Log
  getOrganization(id, showLoading = true) {
    return getPropertyImpl(this, '/user/{id}/organization', 'organization', StatefulInfo, id, showLoading);
  }

  /**
   * 添加一个`User`对象。
   *
   * @param {User|object} entity
   *     要添加的`User`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/user', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象。
   *
   * @param {User|object} entity
   *     要更新的`User`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/user/{id}', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的用户名。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {string} username
   *     要更新的`User`对象的用户名。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateUsername(id, username, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/username', id, 'username', String, username, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的密码。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {string} password
   *     要更新的`User`对象的密码的明文。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updatePassword(id, password, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/password', id, 'password', String, password, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的电子邮件地址。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {string} email
   *     要更新的`User`对象的电子邮件地址。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateEmail(id, email, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/email', id, 'email', String, email, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的手机号码。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {string} mobile
   *     要更新的`User`对象的手机号码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateMobile(id, mobile, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/mobile', id, 'mobile', String, mobile, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的备注。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {string} comment
   *     要更新的`User`对象的备注。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateComment(id, comment, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/comment', id, 'comment', String, comment, showLoading);
  }

  /**
   * 根据ID，更新一个`User`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `User`对象的ID。
   * @param {State|string} state
   *     要更新的`User`对象的状态。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/user/{id}/state', id, 'state', [State, String], state, showLoading);
  }

  /**
   * 根据ID，标记删除一个`User`对象。
   *
   * @param {string} id
   *     要标记删除的`User`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/user/{id}', id, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`User`对象。
   *
   * @param {string} id
   *     要恢复的`User`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/user/{id}', id, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`User`对象。
   *
   * @param {string} id
   *     要清除的`User`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/user/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`User`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/user/purge', showLoading);
  }

  /**
   * 导出符合条件的`User`对象为XML文件。
   *
   * @param {object} criteria
   *    查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `nickname: string` 昵称中应该包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `state: State` 状态；
   *  - `lastLoginTimeStart: string`最后一次登录时间范围的（闭区间）起始值；
   *  - `lastLoginTimeEnd: string` 最后一次登录时间范围的（闭区间）结束值；
   *  - `validTimeStart: string`账户生效时间范围的（闭区间）起始值；
   *  - `validTimeEnd: string` 账户生效时间范围的（闭区间）结束值；
   *  - `expiredTimeStart: string`账户过期时间范围的（闭区间）起始值；
   *  - `expiredTimeEnd: string` 账户过期时间范围的（闭区间）结束值；
   *  - `predefined: boolean` 是否是预定义数据；
   *  - `test: boolean` 是否是测试数据；
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
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/user/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }
}

const userApi = new UserApi();

export default userApi;
