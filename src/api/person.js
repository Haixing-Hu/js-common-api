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
  Contact,
  InfoWithEntity,
  Person,
  PersonInfo,
} from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseByKeyImpl, eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import {
  getByKeyImpl,
  getImpl,
  getInfoByKeyImpl,
  getInfoImpl,
  getPropertyImpl,
} from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';
import { updateImpl, updatePropertyImpl } from './impl/update-impl';

/**
 * 提供管理`Person`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class PersonApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Person;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = PersonInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 姓名中应包含的字符串
    { name: 'name', type: String },
    // 对应的用户的用户名
    { name: 'username', type: String },
    // 性别
    { name: 'gender', type: [Object, String] },
    // 生日范围的（闭区间）起始值
    { name: 'birthdayStart', type: String },
    // 生日范围的（闭区间）结束值
    { name: 'birthdayEnd', type: String },
    // 证件类型
    { name: 'credentialType', type: [Object, String] },
    // 证件号码
    { name: 'credentialNumber', type: String },
    // 是否有医保
    { name: 'hasMedicare', type: Boolean },
    // 医保类型
    { name: 'medicareType', type: [Object, String] },
    // 医保所在城市的ID
    { name: 'medicareCityId', type: [String, Number, BigInt] },
    // 医保所在城市的编码
    { name: 'medicareCityCode', type: String },
    // 医保所在城市名称中应包含的字符串
    { name: 'medicareCityName', type: String },
    // 是否有社保
    { name: 'hasSocialSecurity', type: Boolean },
    // 社保所在城市的ID
    { name: 'socialSecurityCityId', type: [String, Number, BigInt] },
    // 社保所在城市的编码
    { name: 'socialSecurityCityCode', type: String },
    // 社保所在城市名称中应包含的字符串
    { name: 'socialSecurityCityName', type: String },
    // 数据来源渠道的ID
    { name: 'sourceId', type: [String, Number, BigInt] },
    // 数据来源渠道的编码
    { name: 'sourceCode', type: String },
    // 数据来源渠道的名称中应包含的字符串
    { name: 'sourceName', type: String },
    // 所属类别的ID
    { name: 'categoryId', type: [String, Number, BigInt] },
    // 所属类别的编码
    { name: 'categoryCode', type: String },
    // 所属类别的名称包含的字符串
    { name: 'categoryName', type: String },
    // 座机号码
    { name: 'phone', type: String },
    // 手机号码
    { name: 'mobile', type: String },
    // 电子邮件地址中应包含的字符串
    { name: 'email', type: String },
    // 监护人的ID
    { name: 'guardianId', type: [String, Number, BigInt] },
    // 所属机构的ID
    { name: 'organizationId', type: [String, Number, BigInt] },
    // 所属机构的编码
    { name: 'organizationCode', type: String },
    // 所属机构名称中应包含的字符串
    { name: 'organizationName', type: String },
    // 是否是测试数据
    { name: 'test', type: Boolean },
    // 是否已经被标记删除
    { name: 'deleted', type: Boolean },
    // 创建时间范围的（闭区间）起始值
    { name: 'createTimeStart', type: String },
    // 创建时间范围的（闭区间）结束值
    { name: 'createTimeEnd', type: String },
    // 修改时间范围的（闭区间）起始值
    { name: 'modifyTimeStart', type: String },
    // 修改时间范围的（闭区间）结束值
    { name: 'modifyTimeEnd', type: String },
    // 标记删除时间范围的（闭区间）起始值
    { name: 'deleteTimeStart', type: String },
    // 标记删除时间范围的（闭区间）结束值
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`Person`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `username: string` 对应的用户的用户名；
   *  - `gender: Gender|string` 性别；
   *  - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *  - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `hasMedicare: boolean` 是否有医保；
   *  - `medicareType: MedicareType|string` 医保类型；
   *  - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *  - `medicareCityCode: string` 医保所在城市的编码；
   *  - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *  - `hasSocialSecurity: boolean` 是否有社保；
   *  - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *  - `socialSecurityCityCode: string` 社保所在城市的编码；
   *  - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *  - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *  - `sourceCode: string` 数据来源渠道的编码；
   *  - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `guardianId: string|number|bigint` 监护人的ID；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
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
   * @return {Promise<Page<Person>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    return listImpl(this, '/person', pageRequest, criteria, sortRequest, showLoading, { transformUrls });
  }

  /**
   * 列出符合条件的`Person`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `username: string` 对应的用户的用户名；
   *  - `gender: Gender|string` 性别；
   *  - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *  - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `hasMedicare: boolean` 是否有医保；
   *  - `medicareType: MedicareType|string` 医保类型；
   *  - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *  - `medicareCityCode: string` 医保所在城市的编码；
   *  - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *  - `hasSocialSecurity: boolean` 是否有社保；
   *  - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *  - `socialSecurityCityCode: string` 社保所在城市的编码；
   *  - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *  - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *  - `sourceCode: string` 数据来源渠道的编码；
   *  - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `guardianId: string|number|bigint` 监护人的ID；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
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
   * @return {Promise<Page<PersonInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/person/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 获取指定的`Person`对象。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    return getImpl(this, '/person/{id}', id, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`Person`对象。
   *
   * @param {string} username
   *     `Person`对象对应的用户的用户名。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByUsername(username, transformUrls = true, showLoading = true) {
    return getByKeyImpl(this, '/person/username/{username}', 'username', username, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`Person`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/person/{id}/info', id, showLoading);
  }

  /**
   * 获取指定的`Person`对象的基本信息。
   *
   * @param {string} username
   *     `Person`对象对应的用户的用户名。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByUsername(username, showLoading = true) {
    return getInfoByKeyImpl(this, '/person/username/{username}/info', 'username', username, showLoading);
  }

  /**
   * 获取指定的`Person`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategory(id, showLoading = true) {
    return getPropertyImpl(this, '/person/{id}/category', 'category', InfoWithEntity, id, showLoading);
  }

  /**
   * 获取指定的`Person`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象的照片，
   *     注意若没有照片会返回`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPhoto(id, transformUrls = true, showLoading = true) {
    return getPropertyImpl(this, '/person/{id}/photo', 'photo', Attachment, id, showLoading, { transformUrls });
  }

  /**
   * 添加一个`Person`对象。
   *
   * @param {Person|object} entity
   *     要添加的`Person`对象。
   * @param {boolean} withUser
   *     是否同时添加新`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, withUser = false, transformUrls = true, showLoading = true) {
    return addImpl(this, '/person', entity, showLoading, { withUser, transformUrls });
  }

  /**
   * 根据ID，更新一个`Person`对象。
   *
   * @param {Person|object} entity
   *     要更新的`Person`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, withUser = false, showLoading = true) {
    return updateImpl(this, '/person/{id}', entity, showLoading, { withUser });
  }

  /**
   * 根据ID，更新一个`Person`对象的联系方式。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {Contact|object} contact
   *     要更新的`Person`对象的联系方式。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的`User`对象的联系方式。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateContact(id, contact, withUser = false, showLoading = true) {
    return updatePropertyImpl(this, '/person/{id}/contact', id, 'contact', Contact, contact, showLoading, { withUser });
  }

  /**
   * 根据ID，更新一个`Person`对象的备注。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {string} comment
   *     要更新的`Person`对象的备注。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的`User`对象的备注。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateComment(id, comment, withUser = false, showLoading = true) {
    return updatePropertyImpl(this, '/person/{id}/comment', id, 'comment', String, comment, showLoading, { withUser });
  }

  /**
   * 根据ID，更新一个`Person`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {Attachment|object} photo
   *     要更新的`Person`对象的照片，必须先调用`fileApi.update()` 上传文件，并利用返回
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
    return updatePropertyImpl(this, '/person/{id}/photo', id, 'photo', Attachment, photo, showLoading, { transformUrls });
  }

  /**
   * 根据ID，标记删除一个`Person`对象。
   *
   * @param {string} id
   *     要标记删除的`Person`对象的ID。
   * @param {boolean} withUser
   *     是否同时标记删除`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, withUser = false, showLoading = true) {
    return deleteImpl(this, '/person/{id}', id, showLoading, { withUser });
  }

  /**
   * 批量标记删除`Person`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     要批量标记删除的`Person`对象的ID列表。
   * @param {boolean} withUser
   *     是否同时标记删除`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, withUser = false, showLoading = true) {
    return batchDeleteImpl(this, '/person/batch', ids, showLoading, { withUser });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要恢复的`Person`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, withUser = false, showLoading = true) {
    return restoreImpl(this, '/person/{id}', id, showLoading, { withUser });
  }

  /**
   * 批量恢复被标记删除的`Person`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     要批量恢复的`Person`对象的ID列表，这些对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被恢复的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, withUser = false, showLoading = true) {
    return batchRestoreImpl(this, '/person/batch', ids, showLoading, { withUser });
  }

  /**
   * 根据ID，清除一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要清除的`Person`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, withUser = false, showLoading = true) {
    return purgeImpl(this, '/person/{id}/purge', id, showLoading, { withUser });
  }

  /**
   * 彻底清除全部已被标记删除的`Person`对象。
   *
   * @param {boolean} withUser
   *     是否同时彻底清除所有已被标记删除的`Person`对象所绑定的已被标记标记删除的用户对象`User`。
   *     若某个已被标记删除的`Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记
   *     删除，则不对该`User`对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(withUser = false, showLoading = true) {
    return purgeAllImpl(this, '/person/purge', showLoading, { withUser });
  }

  /**
   * 批量清除已被标记删除的`Person`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     要批量清除的`Person`对象的ID列表，这些对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, withUser = false, showLoading = true) {
    return batchPurgeImpl(this, '/person/batch/purge', ids, showLoading, { withUser });
  }

  /**
   * 根据ID，擦除一个`Person`对象，无论其是否被标记删除。
   *
   * 此操作将直接从数据库中删除数据，不可恢复，请谨慎使用。
   *
   * @param {string|number|bigint} id
   *     要擦除的`Person`对象的ID。
   * @param {boolean} withUser
   *     是否同时擦除`Person`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, withUser = false, showLoading = true) {
    return eraseImpl(this, '/person/{id}/erase', id, showLoading, { withUser });
  }

  /**
   * 根据用户名，擦除一个`Person`对象，无论其是否被标记删除。
   *
   * 此操作将直接从数据库中删除数据，不可恢复，请谨慎使用。
   *
   * @param {string} username
   *     要擦除的`Person`对象对应的用户的用户名。
   * @param {boolean} withUser
   *     是否同时擦除`Person`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByUsername(username, withUser = false, showLoading = true) {
    return eraseByKeyImpl(this, '/person/username/{username}/erase', 'username', username, showLoading, { withUser });
  }

  /**
   * 批量擦除`Person`对象，无论其是否被标记删除。
   *
   * 此操作将直接从数据库中删除数据，不可恢复，请谨慎使用。
   *
   * @param {Array<string|number|bigint>} ids
   *     要批量擦除的`Person`对象的ID列表。
   * @param {boolean} withUser
   *     是否同时擦除`Person`对象所绑定的用户对象`User`。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被擦除的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, withUser = false, showLoading = true) {
    return batchEraseImpl(this, '/person/batch/erase', ids, showLoading, { withUser });
  }

  /**
   * 导出符合条件的`Person`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
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
    return exportImpl(this, '/person/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Person`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
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
    return exportImpl(this, '/person/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Person`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
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
    return exportImpl(this, '/person/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Person`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
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
    return exportImpl(this, '/person/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Person`对象。
   *
   * @param {File|Blob} file
   *     要导入的XML文件。
   * @param {boolean} parallel
   *     是否使用并行处理。默认值为`false`。
   * @param {number} threads
   *     如果使用并行处理，指定并行线程数。默认值为`null`，表示使用系统默认的线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/person/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Person`对象。
   *
   * @param {File|Blob} file
   *     要导入的JSON文件。
   * @param {boolean} parallel
   *     是否使用并行处理。默认值为`false`。
   * @param {number} threads
   *     如果使用并行处理，指定并行线程数。默认值为`null`，表示使用系统默认的线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/person/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`Person`对象。
   *
   * @param {File|Blob} file
   *     要导入的Excel文件。
   * @param {boolean} parallel
   *     是否使用并行处理。默认值为`false`。
   * @param {number} threads
   *     如果使用并行处理，指定并行线程数。默认值为`null`，表示使用系统默认的线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/person/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`Person`对象。
   *
   * @param {File|Blob} file
   *     要导入的CSV文件。
   * @param {boolean} parallel
   *     是否使用并行处理。默认值为`false`。
   * @param {number} threads
   *     如果使用并行处理，指定并行线程数。默认值为`null`，表示使用系统默认的线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/person/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const personApi = new PersonApi();

export default personApi;
