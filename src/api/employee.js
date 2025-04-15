////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Attachment,
  Employee,
  EmployeeInfo,
  InfoWithEntity,
  State,
} from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import {
  batchDeleteImpl,
  deleteByKeyImpl,
  deleteImpl,
} from './impl/delete-impl';
import { batchEraseImpl, eraseByKeyImpl, eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import {
  getByKeyImpl,
  getImpl,
  getInfoByKeyImpl,
  getInfoImpl,
  getPropertyByKeyImpl,
  getPropertyImpl,
} from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import {
  batchPurgeImpl,
  purgeAllImpl,
  purgeByKeyImpl,
  purgeImpl,
} from './impl/purge-impl';
import {
  batchRestoreImpl,
  restoreByKeyImpl,
  restoreImpl,
} from './impl/restore-impl';
import {
  updateByKeyImpl,
  updateImpl,
  updatePropertyByKeyImpl,
  updatePropertyImpl,
} from './impl/update-impl';

/**
 * 提供管理`Employee`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class EmployeeApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Employee;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = EmployeeInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'username', type: String },
    { name: 'personId', type: [String, Number, BigInt] },
    { name: 'internalCode', type: String },
    { name: 'name', type: String },
    { name: 'gender', type: [Object, String] },
    { name: 'credentialType', type: [Object, String] },
    { name: 'credentialNumber', type: String },
    { name: 'categoryId', type: [String, Number, BigInt] },
    { name: 'categoryCode', type: String },
    { name: 'categoryName', type: String },
    { name: 'organizationId', type: [String, Number, BigInt] },
    { name: 'organizationCode', type: String },
    { name: 'organizationName', type: String },
    { name: 'departmentId', type: [String, Number, BigInt] },
    { name: 'departmentCode', type: String },
    { name: 'departmentName', type: String },
    { name: 'phone', type: String },
    { name: 'mobile', type: String },
    { name: 'email', type: String },
    { name: 'jobTitle', type: String },
    { name: 'state', type: [Object, String] },
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
   * 列出符合条件的`Employee`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Employee>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Employee`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    return listImpl(this, '/employee', pageRequest, criteria, sortRequest, showLoading, { transformUrls });
  }

  /**
   * 列出符合条件的`Employee`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
   * @return {Promise<Page<EmployeeInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Employee`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/employee/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`Employee`对象。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    return getImpl(this, '/employee/{id}', id, showLoading, { transformUrls });
  }

  /**
   * 根据代码，获取指定的`Employee`对象。
   *
   * @param {string} code
   *     `Employee`对象的代码。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, transformUrls = true, showLoading = true) {
    return getByKeyImpl(this, '/employee/code/{code}', 'code', code, showLoading, { transformUrls });
  }

  /**
   * 根据ID，获取指定的`Employee`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`EmployeeInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/employee/{id}/info', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Employee`对象的基本信息。
   *
   * @param {string} code
   *     `Employee`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`EmployeeInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    return getInfoByKeyImpl(this, '/employee/code/{code}/info', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Employee`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategory(id, showLoading = true) {
    return getPropertyImpl(this, '/employee/{id}/category', 'category', InfoWithEntity, id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Employee`对象所属分类的基本信息。
   *
   * @param {string} code
   *     `Employee`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategoryByCode(code, showLoading = true) {
    return getPropertyByKeyImpl(this, '/employee/code/{code}/category', 'category', InfoWithEntity, 'code', code, showLoading);
  }

  /**
   * 获取指定的`Employee`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象的照片，
   *     注意若没有照片会返回`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPhoto(id, transformUrls = true, showLoading = true) {
    return getPropertyImpl(this, '/employee/{id}/photo', 'photo', Attachment, id, showLoading, { transformUrls });
  }

  /**
   * 添加一个`Employee`对象。
   *
   * @param {Employee|object} entity
   *     要添加的`Employee`对象。
   * @param {boolean} withUser
   *     是否同时添加新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, withUser = false, transformUrls = true, showLoading = true) {
    return addImpl(this, '/employee', entity, showLoading, { withUser, transformUrls });
  }

  /**
   * 根据ID，更新一个`Employee`对象。
   *
   * @param {Employee|object} entity
   *     要更新的`Employee`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, withUser = false, showLoading = true) {
    return updateImpl(this, '/employee/{id}', entity, showLoading, { withUser });
  }

  /**
   * 根据代码，更新一个`Employee`对象。
   *
   * @param {Employee} entity
   *     要更新的`Employee`对象的数据，根据其代码确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, withUser = false, showLoading = true) {
    return updateByKeyImpl(this, '/employee/code/{code}', 'code', entity, showLoading, { withUser });
  }

  /**
   * 根据ID，更新一个`Employee`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {State|string} state
   *     要更新的`Employee`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`的状态。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, withUser = false, showLoading = true) {
    return updatePropertyImpl(this, '/employee/{id}/state', id, 'state', State, state, showLoading, { withUser });
  }

  /**
   * 根据代码，更新一个`Employee`对象的状态。
   *
   * @param {string} code
   *     要更新的`Employee`对象的代码。
   * @param {State|string} state
   *     要更新的`Employee`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`的状态。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, withUser = false, showLoading = true) {
    return updatePropertyByKeyImpl(this, '/employee/code/{code}/state', 'code', code, 'state', State, state, showLoading, { withUser });
  }

  /**
   * 根据ID，更新一个`Employee`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {Attachment} photo
   *     要更新的`Employee`对象的照片，必须先调用`fileApi.update()` 上传文件，并利用返回
   *     的`Upload`对象构造一个`Attachment`对象。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`photo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updatePhoto(id, photo, transformUrls = true, showLoading = true) {
    return updatePropertyImpl(this, '/employee/{id}/photo', id, 'photo', Attachment, photo, showLoading, { transformUrls });
  }

  /**
   * 根据ID，标记删除一个`Employee`对象。
   *
   * @param {string} id
   *     要标记删除的`Employee`对象的ID。
   * @param {boolean} withUser
   *     是否同时标记删除`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, withUser = false, showLoading = true) {
    return deleteImpl(this, '/employee/{id}', id, showLoading, { withUser });
  }

  /**
   * 根据代码，标记删除一个`Employee`对象。
   *
   * @param {string} code
   *     要标记删除的`Employee`对象的代码。
   * @param {boolean} withUser
   *     是否同时标记删除`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, withUser = false, showLoading = true) {
    return deleteByKeyImpl(this, '/employee/code/{code}', 'code', code, showLoading, { withUser });
  }

  /**
   * 批量标记删除指定的`Employee`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Employee`对象的ID列表。
   * @param {boolean} withUser
   *     是否同时标记删除`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, withUser = false, showLoading = true) {
    return batchDeleteImpl(this, '/employee/batch', ids, showLoading, { withUser });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Employee`对象。
   *
   * @param {string} id
   *     要恢复的`Employee`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, withUser = false, showLoading = true) {
    return restoreImpl(this, '/employee/{id}', id, showLoading, { withUser });
  }

  /**
   * 根据代码，恢复一个被标记删除的`Employee`对象。
   *
   * @param {string} code
   *     要恢复的`Employee`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, withUser = false, showLoading = true) {
    return restoreByKeyImpl(this, '/employee/code/{code}', 'code', code, showLoading, { withUser });
  }

  /**
   * 批量恢复已被标记删除的`Employee`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Employee`对象的ID列表。
   * @param {boolean} withUser
   *     是否同时恢复`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, withUser = false, showLoading = true) {
    return batchRestoreImpl(this, '/employee/batch', ids, showLoading, { withUser });
  }

  /**
   * 根据ID，清除一个被标记删除的`Employee`对象。
   *
   * @param {string} id
   *     要清除的`Employee`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, withUser = false, showLoading = true) {
    return purgeImpl(this, '/employee/{id}/purge', id, showLoading, { withUser });
  }

  /**
   * 根据代码，清除一个被标记删除的`Employee`对象。
   *
   * @param {string} code
   *     要清除的`Employee`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, withUser = false, showLoading = true) {
    return purgeByKeyImpl(this, '/employee/code/{code}/purge', 'code', code, showLoading, { withUser });
  }

  /**
   * 彻底清除全部已被标记删除的`Employee`对象。
   *
   * @param {boolean} withUser
   *     是否同时彻底清除所有已被标记删除的`Employee`对象所绑定的已被标记标记删除的用户对象`User`。
   *     若某个已被标记删除的`Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记
   *     删除，则不对该`User`对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(withUser = false, showLoading = true) {
    return purgeAllImpl(this, '/employee/purge', showLoading, { withUser });
  }

  /**
   * 批量清除多个被标记删除的`Employee`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     要清除的`Employee`对象的ID列表，这些对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功清除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, withUser = false, showLoading = true) {
    return batchPurgeImpl(this, '/employee/batch/purge', ids, showLoading, { withUser });
  }

  /**
   * 彻底清除指定的`Employee`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Employee`对象的ID。
   * @param {boolean} withUser
   *     是否同时永久删除`Employee`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, withUser = false, showLoading = true) {
    return eraseImpl(this, '/employee/{id}/erase', id, showLoading, { withUser });
  }

  /**
   * 根据代码，彻底清除指定的`Employee`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Employee`对象的代码。
   * @param {boolean} withUser
   *     是否同时永久删除`Employee`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, withUser = false, showLoading = true) {
    return eraseByKeyImpl(this, '/employee/code/{code}/erase', 'code', code, showLoading, { withUser });
  }

  /**
   * 批量彻底清除指定的`Employee`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Employee`对象的ID列表。
   * @param {boolean} withUser
   *     是否同时永久删除`Employee`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, withUser = false, showLoading = true) {
    return batchEraseImpl(this, '/employee/batch/erase', ids, showLoading, { withUser });
  }

  /**
   * 导出符合条件的`Employee`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
    return exportImpl(this, '/employee/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Employee`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/employee/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Employee`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/employee/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Employee`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `username: string` 对应的用户的用户名；
   *  - `personId: string|number|bigint` 对应的个人信息的ID；
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 姓名中应包含的字符串；
   *  - `gender: Gender|string` 性别；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `departmentId: string|number|bigint` 所属部门的ID；
   *  - `departmentCode: string` 所属部门的编码；
   *  - `departmentName: string` 所属部门名称中应包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `jobTitle: string` 职称中应包含的字符串；
   *  - `state: State|string` 状态；
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
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/employee/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Employee`对象。
   *
   * @param {File} file
   *     XML文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Employee`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/employee/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Employee`对象。
   *
   * @param {File} file
   *     JSON文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Employee`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/employee/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`Employee`对象。
   *
   * @param {File} file
   *     Excel文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Employee`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/employee/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`Employee`对象。
   *
   * @param {File} file
   *     CSV文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Employee`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/employee/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const employeeApi = new EmployeeApi();

export default employeeApi;
