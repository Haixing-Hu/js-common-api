////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DictEntry, DictEntryInfo } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import {
  batchDeleteImpl,
  deleteByParentAndKeyImpl,
  deleteImpl,
} from './impl/delete-impl';
import {
  batchEraseImpl,
  eraseByParentAndKeyImpl,
  eraseImpl,
} from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import {
  getByParentAndKeyImpl,
  getImpl,
  getInfoByParentAndKeyImpl,
  getInfoImpl,
} from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import {
  batchPurgeImpl,
  purgeAllImpl,
  purgeByParentAndKeyImpl,
  purgeImpl,
} from './impl/purge-impl';
import {
  batchRestoreImpl,
  restoreByParentAndKeyImpl,
  restoreImpl,
} from './impl/restore-impl';
import { updateByParentAndKeyImpl, updateImpl } from './impl/update-impl';

/**
 * 提供管理`DictEntry`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class DictEntryApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = DictEntry;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = DictEntryInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 名称中应包含的字符串
    { name: 'name', type: String },
    // 所属字典的ID
    { name: 'dictId', type: [String, Number, BigInt] },
    // 所属字典的编码
    { name: 'dictCode', type: String },
    // 所属字典的名称包含的字符串
    { name: 'dictName', type: String },
    // 所属父字典项的ID
    { name: 'parentId', type: [String, Number, BigInt] },
    // 所属父字典项的编码
    { name: 'parentCode', type: String },
    // 所属父字典项名称中应包含的字符串
    { name: 'parentName', type: String },
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
   * 列出符合条件的`DictEntry`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
   * @return {Promise<Page<DictEntry>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`DictEntry`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/dict/entry', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`DictEntry`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
   * @return {Promise<Page<DictEntryInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`DictEntry`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/dict/entry/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`DictEntry`对象。
   *
   * @param {string|number|bigint} id
   *     `DictEntry`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntry|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/dict/entry/{id}', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`DictEntry`对象。
   *
   * @param {string} dictCode
   *     `Dict`对象的编码。
   * @param {string} code
   *     `DictEntry`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntry|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(dictCode, code, showLoading = true) {
    return getByParentAndKeyImpl(this, '/dict/code/{dictCode}/entry/code/{code}', 'dictCode', dictCode, 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`DictEntry`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `DictEntry`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntryInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntryInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/dict/entry/{id}/info', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`DictEntry`对象的基本信息。
   *
   * @param {string} dictCode
   *     `Dict`对象的编码。
   * @param {string} code
   *     `DictEntry`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntryInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntryInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(dictCode, code, showLoading = true) {
    return getInfoByParentAndKeyImpl(this, '/dict/code/{dictCode}/entry/code/{code}/info', 'dictCode', dictCode, 'code', code, showLoading);
  }

  /**
   * 添加一个`DictEntry`对象。
   *
   * @param {DictEntry|object} entity
   *     要添加的`DictEntry`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntry|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/dict/entry', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`DictEntry`对象。
   *
   * @param {DictEntry|object} entity
   *     要更新的`DictEntry`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntry|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/dict/entry/{id}', entity, showLoading);
  }

  /**
   * 根据编码，更新一个`DictEntry`对象。
   *
   * @param {DictEntry|object} entity
   *     要更新的`DictEntry`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DictEntry|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, showLoading = true) {
    return updateByParentAndKeyImpl(this, '/dict/{dictId}/entry/code/{code}', 'dictId', entity.dict.id, 'code', entity, showLoading);
  }

  /**
   * 根据ID，标记删除一个`DictEntry`对象。
   *
   * @param {string|number|bigint} id
   *     要标记删除的`DictEntry`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/dict/entry/{id}', id, showLoading);
  }

  /**
   * 根据编码，标记删除一个`DictEntry`对象。
   *
   * @param {number|string|bigint} dictId
   *     所属字典的ID。
   * @param {string} code
   *     要标记删除的`DictEntry`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(dictId, code, showLoading = true) {
    const url = '/dict/{dictId}/entry/code/{code}';
    return deleteByParentAndKeyImpl(this, url, 'dictId', dictId, 'code', code, showLoading);
  }

  /**
   * 批量标记删除指定的`DictEntry`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`DictEntry`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/dict/entry/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`DictEntry`对象。
   *
   * @param {string|number|bigint} id
   *     要恢复的`DictEntry`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/dict/entry/{id}', id, showLoading);
  }

  /**
   * 根据编码，恢复一个被标记删除的`DictEntry`对象。
   *
   * @param {number|string|bigint} dictId
   *     所属字典的ID。
   * @param {string} code
   *     要恢复的`DictEntry`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(dictId, code, showLoading = true) {
    return restoreByParentAndKeyImpl(this, '/dict/{dictId}/entry/code/{code}', 'dictId', dictId, 'code', code, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`DictEntry`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`DictEntry`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/dict/entry/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`DictEntry`对象。
   *
   * @param {string|number|bigint} id
   *     要清除的`DictEntry`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/dict/entry/{id}/purge', id, showLoading);
  }

  /**
   * 根据编码，清除一个被标记删除的`DictEntry`对象。
   *
   * @param {number|string|bigint} dictId
   *     所属字典的ID。
   * @param {string} code
   *     要清除的`DictEntry`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(dictId, code, showLoading = true) {
    return purgeByParentAndKeyImpl(this, '/dict/{dictId}/entry/code/{code}/purge', 'dictId', dictId, 'code', code, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`DictEntry`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的数据数量；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/dict/entry/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`DictEntry`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`DictEntry`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/dict/entry/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`DictEntry`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`DictEntry`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/dict/entry/{id}/erase', id, showLoading);
  }

  /**
   * 根据代码，彻底清除指定的`DictEntry`对象（无论其是否被标记删除）。
   *
   * @param {number|string|bigint} dictId
   *     所属字典的ID。
   * @param {string} code
   *     要彻底清除的`DictEntry`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(dictId, code, showLoading = true) {
    return eraseByParentAndKeyImpl(this, '/dict/{dictId}/entry/code/{code}/erase', 'dictId', dictId, 'code', code, showLoading);
  }

  /**
   * 批量彻底清除指定的`DictEntry`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`DictEntry`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/dict/entry/batch/erase', ids, showLoading);
  }

  /**
   * 导出符合条件的`DictEntry`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
    return exportImpl(this, '/dict/entry/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`DictEntry`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
    return exportImpl(this, '/dict/entry/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`DictEntry`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
    return exportImpl(this, '/dict/entry/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`DictEntry`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `dictId: string|number|bigint` 所属字典的ID；
   *  - `dictCode: string` 所属字典的编码；
   *  - `dictName: string` 所属字典的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父字典项的ID；
   *  - `parentCode: string` 所属父字典项的编码；
   *  - `parentName: string` 所属父字典项名称中应包含的字符串；
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
    return exportImpl(this, '/dict/entry/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`DictEntry`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`DictEntry`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/entry/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`DictEntry`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`DictEntry`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/entry/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`DictEntry`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`DictEntry`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/entry/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`DictEntry`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`DictEntry`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/dict/entry/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const dictEntryApi = new DictEntryApi();

export default dictEntryApi;
