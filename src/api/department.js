////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Department,
  InfoWithEntity,
  State,
  StatefulInfo,
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
 * 提供管理`Department`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class DepartmentApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Department;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = StatefulInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'internalCode', type: String },
    { name: 'name', type: String },
    { name: 'categoryId', type: [String, Number, BigInt] },
    { name: 'categoryCode', type: String },
    { name: 'categoryName', type: String },
    { name: 'parentId', type: [String, Number, BigInt] },
    { name: 'parentCode', type: String },
    { name: 'parentName', type: String },
    { name: 'organizationId', type: [String, Number, BigInt] },
    { name: 'organizationCode', type: String },
    { name: 'organizationName', type: String },
    { name: 'countryId', type: [String, Number, BigInt] },
    { name: 'countryCode', type: String },
    { name: 'countryName', type: String },
    { name: 'provinceId', type: [String, Number, BigInt] },
    { name: 'provinceCode', type: String },
    { name: 'provinceName', type: String },
    { name: 'cityId', type: [String, Number, BigInt] },
    { name: 'cityCode', type: String },
    { name: 'cityName', type: String },
    { name: 'districtId', type: [String, Number, BigInt] },
    { name: 'districtCode', type: String },
    { name: 'districtName', type: String },
    { name: 'streetId', type: [String, Number, BigInt] },
    { name: 'streetCode', type: String },
    { name: 'streetName', type: String },
    { name: 'postalcode', type: String },
    { name: 'phone', type: String },
    { name: 'mobile', type: String },
    { name: 'email', type: String },
    { name: 'state', type: [State, String] },
    { name: 'test', type: Boolean },
    { name: 'predefined', type: Boolean },
    { name: 'deleted', type: Boolean },
    { name: 'createTimeStart', type: String },
    { name: 'createTimeEnd', type: String },
    { name: 'modifyTimeStart', type: String },
    { name: 'modifyTimeEnd', type: String },
    { name: 'deleteTimeStart', type: String },
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`Department`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<Department>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Department`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/department', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Department`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<StatefulInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Department`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/department/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`Department`对象。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/department/{id}', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Department`对象。
   *
   * @param {string} code
   *     `Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    return getByKeyImpl(this, '/department/code/{code}', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Department`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/department/{id}/info', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Department`对象的基本信息。
   *
   * @param {string} code
   *     `Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    return getInfoByKeyImpl(this, '/department/code/{code}/info', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Department`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategory(id, showLoading = true) {
    return getPropertyImpl(this, '/department/{id}/category', 'category', InfoWithEntity, id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Department`对象所属分类的基本信息。
   *
   * @param {string} code
   *     `Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象所属分类的
   *     基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getCategoryByCode(code, showLoading = true) {
    return getPropertyByKeyImpl(this, '/department/code/{code}/category', 'category', InfoWithEntity, 'code', code, showLoading);
  }

  /**
   * 添加一个`Department`对象。
   *
   * @param {Department|object} entity
   *     要添加的`Department`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/department', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Department`对象。
   *
   * @param {Department|object} entity
   *     要更新的`Department`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/department/{id}', entity, showLoading);
  }

  /**
   * 根据代码，更新一个`Department`对象。
   *
   * @param {Department} entity
   *     要更新的`Department`对象的数据，根据其代码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, showLoading = true) {
    return updateByKeyImpl(this, '/department/code/{code}', 'code', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Department`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {State|string} state
   *     要更新的`Department`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/department/{id}/state', id, 'state', State, state, showLoading);
  }

  /**
   * 根据代码，更新一个`Department`对象的状态。
   *
   * @param {string} code
   *     要更新的`Department`对象的代码。
   * @param {State|string} state
   *     要更新的`Department`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, showLoading = true) {
    return updatePropertyByKeyImpl(this, '/department/code/{code}/state', 'code', code, 'state', State, state, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Department`对象。
   *
   * @param {string} id
   *     要标记删除的`Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/department/{id}', id, showLoading);
  }

  /**
   * 根据代码，标记删除一个`Department`对象。
   *
   * @param {string} code
   *     要标记删除的`Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, showLoading = true) {
    return deleteByKeyImpl(this, '/department/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量标记删除指定的`Department`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Department`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/department/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Department`对象。
   *
   * @param {string} id
   *     要恢复的`Department`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/department/{id}', id, showLoading);
  }

  /**
   * 根据代码，恢复一个被标记删除的`Department`对象。
   *
   * @param {string} code
   *     要恢复的`Department`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, showLoading = true) {
    return restoreByKeyImpl(this, '/department/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Department`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Department`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/department/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Department`对象。
   *
   * @param {string} id
   *     要清除的`Department`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/department/{id}/purge', id, showLoading);
  }

  /**
   * 根据代码，清除一个被标记删除的`Department`对象。
   *
   * @param {string} code
   *     要清除的`Department`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, showLoading = true) {
    return purgeByKeyImpl(this, '/department/code/{code}/purge', 'code', code, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Department`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/department/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Department`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Department`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/department/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Department`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/department/{id}/erase', id, showLoading);
  }

  /**
   * 根据代码，彻底清除指定的`Department`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    return eraseByKeyImpl(this, '/department/code/{code}/erase', 'code', code, showLoading);
  }

  /**
   * 批量彻底清除指定的`Department`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Department`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/department/batch/erase', ids, showLoading);
  }

  /**
   * 导出符合条件的`Department`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
    return exportImpl(this, '/department/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Department`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
    return exportImpl(this, '/department/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Department`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
    return exportImpl(this, '/department/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Department`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
   *  - `predefined: boolean` 是否是预定义数据；
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
    return exportImpl(this, '/department/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Department`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Department`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/department/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Department`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Department`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/department/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`Department`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Department`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/department/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`Department`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Department`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/department/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const departmentApi = new DepartmentApi();

export default departmentApi;
