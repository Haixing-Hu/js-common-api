////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { stringifyId, toJSON } from '@qubit-ltd/common-decorator';
import {
  CommonMimeType,
  State,
  User,
  UserInfo,
  StatefulInfo,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkObjectArgument from '../utils/check-object-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('UserApi');

const USER_CRITERIA_DEFINITIONS = [
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
 * 提供管理`User`对象的API。
 *
 * @author 胡海星
 */
class UserApi {
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
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, USER_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, User);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/user', {
      params,
    }).then((obj) => {
      const page = User.createPage(obj, assignOptions);
      logger.info('Successfully list the User.');
      logger.debug('The page of User is:', page);
      return page;
    });
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
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, USER_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, User);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/user/info', {
      params,
    }).then((obj) => {
      const page = UserInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of User.');
      logger.debug('The page of infos of User is:', page);
      return page;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/user/${stringifyId(id)}`, { params }).then((obj) => {
      const user = User.create(obj, assignOptions);
      logger.info('Successfully get the User by ID:', id);
      logger.debug('The User is:', user);
      return user;
    });
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
    checkArgumentType('username', username, String);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/user/username/${username}`, { params }).then((obj) => {
      const user = User.create(obj, assignOptions);
      logger.info('Successfully get the User by username:', username);
      logger.debug('The User is:', user);
      return user;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/user/${stringifyId(id)}/info`).then((obj) => {
      const info = UserInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the User by ID:', id);
      logger.debug('The info of the User is:', info);
      return info;
    });
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
    checkArgumentType('username', username, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/user/username/${username}/info`).then((obj) => {
      const info = UserInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the User by username:', username);
      logger.debug('The info of the User is:', info);
      return info;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/user/${stringifyId(id)}/organization`).then((obj) => {
      const info = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the organization info of the User by ID:', id);
      logger.debug('The organization info of the User is:', info);
      return info;
    });
  }

  /**
   * 添加一个`User`对象。
   *
   * @param {User|object} user
   *     要添加的`User`对象。
   * @param {boolean} withUser
   *     是否同时添加新`User`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(user, withUser = false, transformUrls = true, showLoading = true) {
    checkArgumentType('user', user, [User, Object]);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser, transformUrls }, toJsonOptions);
    const data = toJSON(user, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/user', data, { params }).then((obj) => {
      const user = User.create(obj, assignOptions);
      logger.info('Successfully add the User:', user.id);
      logger.debug('The added User is:', user);
      return user;
    });
  }

  /**
   * 根据ID，更新一个`User`对象。
   *
   * @param {User|object} user
   *     要更新的`User`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`User`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`User`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(user, withUser = false, showLoading = true) {
    checkArgumentType('user', user, [User, Object]);
    checkIdArgumentType(user.id, 'user.id');
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(user.id);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(user, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${id}`, data, { params }).then((obj) => {
      const user = User.create(obj, assignOptions);
      logger.info('Successfully update the User by ID %s at:', id, user.modifyTime);
      logger.debug('The updated User is:', user);
      return user;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('username', username, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(username, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/username`, data).then((timestamp) => {
      logger.info('Successfully update the username of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('password', password, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(password, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/password`, data).then((timestamp) => {
      logger.info('Successfully update the password of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('email', email, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(email, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/email`, data).then((timestamp) => {
      logger.info('Successfully update the email of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(mobile, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/mobile`, data).then((timestamp) => {
      logger.info('Successfully update the mobile of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('comment', comment, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(comment, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/comment`, data).then((timestamp) => {
      logger.info('Successfully update the comment of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
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
    checkIdArgumentType(id);
    checkArgumentType('state', state, [String, State]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(state, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/user/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of a User by ID "%s" at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`User`对象。
   *
   * @param {string} id
   *     要标记删除的`User`对象的ID。
   * @param {boolean} withUser
   *     是否同时标记删除`User`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/user/${stringifyId(id)}`, { params }).then((timestamp) => {
      logger.info('Successfully delete the User by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`User`对象。
   *
   * @param {string} id
   *     要恢复的`User`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`User`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `User`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch(`/user/${stringifyId(id)}`, undefined, { params })
      .then(() => logger.info('Successfully restore the User by ID:', id));
  }

  /**
   * 根据ID，清除一个被标记删除的`User`对象。
   *
   * @param {string} id
   *     要清除的`User`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`User`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `User`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/user/${stringifyId(id)}/purge`, { params })
      .then(() => logger.info('Successfully purge the User by ID:', id));
  }

  /**
   * 根彻底清除全部已被标记删除的`User`对象。
   *
   * @param {boolean} withUser
   *     是否同时彻底清除所有已被标记删除的`User`对象所绑定的已被标记标记删除的用户对象`User`。
   *     若某个已被标记删除的`User`对象未绑定`User`对象，或其绑定的`User`对象未被标记
   *     删除，则不对该`User`对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(withUser = false, showLoading = true) {
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/user/purge', { params })
      .then(() => logger.info('Successfully purge all deleted User.'));
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
    checkObjectArgument('criteria', criteria, USER_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, User);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.XML;
    return http.download('/user/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the User to XML:', result);
      return result;
    });
  }
}

const userApi = new UserApi();

export default userApi;
