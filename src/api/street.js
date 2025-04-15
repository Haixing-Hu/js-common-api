////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Info, Street } from '@qubit-ltd/common-model';
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
import { updateByKeyImpl, updateImpl } from './impl/update-impl';

/**
 * 提供管理`Street`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class StreetApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Street;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = Info;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 所属区县的ID
    { name: 'districtId', type: [String, Number, BigInt] },
    // 所属区县的编码
    { name: 'districtCode', type: String },
    // 所属区县的名称中应包含的字符串
    { name: 'districtName', type: String },
    // 名称中应包含的字符串
    { name: 'name', type: String },
    // 电话区号
    { name: 'phoneArea', type: String },
    // 邮政编码
    { name: 'postalcode', type: String },
    // 级别
    { name: 'level', type: Number },
    // 是否是预定义数据
    { name: 'predefined', type: Boolean },
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
   * 列出符合条件的`Street`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
   * @return {Promise<Page<Street>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/street', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Street`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
   * @return {Promise<Page<Info>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/street/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 获取指定的`Street`对象。
   *
   * @param {string|number|bigint} id
   *     `Street`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/street/{id}', id, showLoading);
  }

  /**
   * 获取指定的`Street`对象。
   *
   * @param {string} code
   *     `Street`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    return getByKeyImpl(this, '/street/code/{code}', 'code', code, showLoading);
  }

  /**
   * 获取指定的`Street`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Street`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/street/{id}/info', id, showLoading);
  }

  /**
   * 获取指定的`Street`对象的基本信息。
   *
   * @param {string} code
   *     `Street`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    return getInfoByKeyImpl(this, '/street/code/{code}/info', 'code', code, showLoading);
  }

  /**
   * 添加一个`Street`对象。
   *
   * @param {Street|object} entity
   *     要添加的`Street`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/street', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Street`对象。
   *
   * @param {Street|object} entity
   *     要更新的`Street`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/street/{id}', entity, showLoading);
  }

  /**
   * 根据编码，更新一个`Street`对象。
   *
   * @param {Street|object} entity
   *     要更新的`Street`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, showLoading = true) {
    return updateByKeyImpl(this, '/street/code/{code}', 'code', entity, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Street`对象。
   *
   * @param {string} id
   *     要标记删除的`Street`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/street/{id}', id, showLoading);
  }

  /**
   * 根据编码，标记删除一个`Street`对象。
   *
   * @param {string} code
   *     要标记删除的`Street`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, showLoading = true) {
    return deleteByKeyImpl(this, '/street/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量标记删除指定的`Street`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量标记删除的`Street`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/street/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Street`对象。
   *
   * @param {string} id
   *     要恢复的`Street`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/street/{id}', id, showLoading);
  }

  /**
   * 根据编码，恢复一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要恢复的`Street`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, showLoading = true) {
    return restoreByKeyImpl(this, '/street/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Street`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Street`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/street/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Street`对象。
   *
   * @param {string} id
   *     要清除的`Street`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/street/{id}/purge', id, showLoading);
  }

  /**
   * 根据编码，清除一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要清除的`Street`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, showLoading = true) {
    return purgeByKeyImpl(this, '/street/code/{code}/purge', 'code', code, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Street`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/street/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Street`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Street`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/street/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Street`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Street`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/street/{id}/erase', id, showLoading);
  }

  /**
   * 根据编码，彻底清除指定的`Street`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Street`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    return eraseByKeyImpl(this, '/street/code/{code}/erase', 'code', code, showLoading);
  }

  /**
   * 批量彻底清除指定的`Street`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Street`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/street/batch/erase', ids, showLoading);
  }

  /**
   * 导出符合条件的`Street`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
    return exportImpl(this, '/street/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Street`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
    return exportImpl(this, '/street/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Street`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
    return exportImpl(this, '/street/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Street`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `districtId: string|number|bigint` 所属区县的ID；
   *  - `districtCode: string` 所属区县的编码；
   *  - `districtName: string` 所属区县的名称中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `phoneArea: string` 电话区号；
   *  - `postalcode: string` 邮政编码；
   *  - `level: number` 级别；
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
    return exportImpl(this, '/street/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Street`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Street`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/street/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Street`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Street`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/street/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`Street`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Street`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/street/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`Street`对象。
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
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Street`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/street/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const streetApi = new StreetApi();

export default streetApi;
