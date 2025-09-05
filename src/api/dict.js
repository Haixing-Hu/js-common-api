////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Dict,
  DictEntry,
  DictEntryInfo,
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
 * 提供管理`Dict`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class DictApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Dict;

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
    { name: 'name', type: String },
    { name: 'standardDoc', type: String },
    { name: 'standardCode', type: String },
    { name: 'appId', type: [String, Number, BigInt] },
    { name: 'appCode', type: String },
    { name: 'appName', type: String },
    { name: 'categoryId', type: [String, Number, BigInt] },
    { name: 'categoryCode', type: String },
    { name: 'categoryName', type: String },
    { name: 'state', type: [State, String] },
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
   * 列出符合条件的`Dict`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *  - `standardCode: string` 在所遵循的标准规范中的编码；
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
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
   * @return {Promise<Page<Dict>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Dict`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/dict', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Dict`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *  - `standardCode: string` 在所遵循的标准规范中的编码；
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
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
   *     件的`Dict`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/dict/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`Dict`对象。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/dict/{id}', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Dict`对象。
   *
   * @param {string} code
   *     `Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    return getByKeyImpl(this, '/dict/code/{code}', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Dict`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/dict/{id}/info', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Dict`对象的基本信息。
   *
   * @param {string} code
   *     `Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    return getInfoByKeyImpl(this, '/dict/code/{code}/info', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Dict`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategory(id, showLoading = true) {
    return getPropertyImpl(this, '/dict/{id}/category', 'category', InfoWithEntity, id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Dict`对象所属分类的基本信息。
   *
   * @param {string} code
   *     `Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象所属分类的
   *     基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getCategoryByCode(code, showLoading = true) {
    return getPropertyByKeyImpl(this, '/dict/code/{code}/category', 'category', InfoWithEntity, 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Dict`对象的所有词条的列表。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<DictEntry>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象
   *     的所有词条的列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEntries(id, showLoading = true) {
    return getPropertyImpl(this, '/dict/{id}/entry', 'entries', DictEntry, id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Dict`对象的所有词条的列表。
   *
   * @param {string} code
   *     `Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<DictEntry>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象
   *     的所有词条的列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEntriesByCode(code, showLoading = true) {
    return getPropertyByKeyImpl(this, '/dict/code/{code}/entry', 'entries', DictEntry, 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Dict`对象的所有词条的基本信息列表。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<DictEntryInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象
   *     的所有词条的基本信息列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEntryInfos(id, showLoading = true) {
    return getPropertyImpl(this, '/dict/{id}/entry/info', 'entry infos', DictEntryInfo, id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Dict`对象的所有词条的基本信息列表。
   *
   * @param {string} code
   *     `Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<DictEntryInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象
   *     的所有词条的基本信息列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEntryInfosByCode(code, showLoading = true) {
    return getPropertyByKeyImpl(this, '/dict/code/{code}/entry/info', 'entry infos', DictEntryInfo, 'code', code, showLoading);
  }

  /**
   * 添加一个`Dict`对象。
   *
   * @param {Dict|object} entity
   *     要添加的`Dict`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/dict', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Dict`对象。
   *
   * @param {Dict|object} entity
   *     要更新的`Dict`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/dict/{id}', entity, showLoading);
  }

  /**
   * 根据代码，更新一个`Dict`对象。
   *
   * @param {Dict} entity
   *     要更新的`Dict`对象的数据，根据其代码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, showLoading = true) {
    return updateByKeyImpl(this, '/dict/code/{code}', 'code', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Dict`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {State|string} state
   *     要更新的`Dict`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/dict/{id}/state', id, 'state', State, state, showLoading);
  }

  /**
   * 根据代码，更新一个`Dict`对象的状态。
   *
   * @param {string} code
   *     要更新的`Dict`对象的代码。
   * @param {State|string} state
   *     要更新的`Dict`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, showLoading = true) {
    return updatePropertyByKeyImpl(this, '/dict/code/{code}/state', 'code', code, 'state', State, state, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Dict`对象。
   *
   * @param {string} id
   *     要标记删除的`Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/dict/{id}', id, showLoading);
  }

  /**
   * 根据代码，标记删除一个`Dict`对象。
   *
   * @param {string} code
   *     要标记删除的`Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, showLoading = true) {
    return deleteByKeyImpl(this, '/dict/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量标记删除指定的`Dict`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Dict`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/dict/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Dict`对象。
   *
   * @param {string} id
   *     要恢复的`Dict`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/dict/{id}', id, showLoading);
  }

  /**
   * 根据代码，恢复一个被标记删除的`Dict`对象。
   *
   * @param {string} code
   *     要恢复的`Dict`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, showLoading = true) {
    return restoreByKeyImpl(this, '/dict/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Dict`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Dict`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/dict/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Dict`对象。
   *
   * @param {string} id
   *     要清除的`Dict`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/dict/{id}/purge', id, showLoading);
  }

  /**
   * 根据代码，清除一个被标记删除的`Dict`对象。
   *
   * @param {string} code
   *     要清除的`Dict`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, showLoading = true) {
    return purgeByKeyImpl(this, '/dict/code/{code}/purge', 'code', code, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Dict`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/dict/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Dict`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Dict`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/dict/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Dict`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Dict`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/dict/{id}/erase', id, showLoading);
  }

  /**
   * 根据代码，彻底清除指定的`Dict`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Dict`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    return eraseByKeyImpl(this, '/dict/code/{code}/erase', 'code', code, showLoading);
  }

  /**
   * 批量彻底清除指定的`Dict`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Dict`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/dict/batch/erase', ids, showLoading);
  }

  /**
   * 导出符合条件的`Dict`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *  - `standardCode: string` 在所遵循的标准规范中的编码；
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
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
    return exportImpl(this, '/dict/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Dict`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *  - `standardCode: string` 在所遵循的标准规范中的编码；
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
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
    return exportImpl(this, '/dict/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Dict`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Dict`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Dict`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Dict`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/import/json', 'JSON', file, parallel, threads, showLoading);
  }
}

const dictApi = new DictApi();

export default dictApi;
