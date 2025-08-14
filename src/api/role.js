////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Role, State, StatefulInfo } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import { getImpl, getInfoImpl } from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';
import { updateImpl, updatePropertyImpl } from './impl/update-impl';

/**
 * 提供管理`Role`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class RoleApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Role;

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
    // 所属应用ID
    { name: 'appId', type: [String, Number, BigInt] },
    // 所属应用代码
    { name: 'appCode', type: String },
    // 所属应用名称包含的字符串
    { name: 'appName', type: String },
    // 名称中应包含的字符串
    { name: 'name', type: String },
    // 是否是访客角色
    { name: 'guest', type: Boolean },
    // 是否是基本角色
    { name: 'basic', type: Boolean },
    // 状态
    { name: 'state', type: [String] },
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
   * 列出符合条件的`Role`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的代码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `guest: boolean` 是否是访客角色；
   *  - `basic: boolean` 是否是基本角色；
   *  - `state: State|string` 状态；
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
   * @return {Promise<Page<Role>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Role`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/role', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Role`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的代码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `guest: boolean` 是否是访客角色；
   *  - `basic: boolean` 是否是基本角色；
   *  - `state: State|string` 状态；
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
   *     件的`Role`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/role/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`Role`对象。
   *
   * @param {string|number|bigint} id
   *     `Role`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Role|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Role`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/role/{id}', id, showLoading);
  }

  /**
   * 根据ID，获取指定的`Role`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Role`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/role/{id}/info', id, showLoading);
  }

  /**
   * 创建一个新`Role`。
   *
   * @param {Role} entity
   *     待创建的新`Role`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Role|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新创建的`Role`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/role', entity, showLoading);
  }

  /**
   * 更新一个指定的`Role`。
   *
   * @param {Role} entity
   *     待更新的`Role`的新数据，其中必须包含ID属性值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Role|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Role`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/role/{id}', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Role`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Role`对象的ID。
   * @param {State|string} state
   *     要更新的`Role`对象的状态。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/role/{id}/state', id, 'state', [State, String], state, showLoading);
  }

  /**
   * 标记删除指定的`Role`。
   *
   * @param {string|number|bigint} id
   *     指定的`Role`的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Instant|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回标记删除时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/role/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`Role`。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Role`的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/role/batch', ids, showLoading);
  }

  /**
   * 恢复指定的已被标记删除的`Role`。
   *
   * @param {string|number|bigint} id
   *     指定的已被标记删除的`Role`的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/role/{id}', id, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Role`。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Role`的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/role/batch', ids, showLoading);
  }

  /**
   * 彻底清除指定的已被标记删除的`Role`。
   *
   * @param {string|number|bigint} id
   *     指定的已被标记删除的`Role`的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/role/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Role`。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的数据数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/role/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Role`。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Role`的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/role/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Role`。
   *
   * @param {string|number|bigint} id
   *     指定的`Role`的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/role/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底删除指定的`Role`。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底删除的`Role`的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/role/batch/erase', ids, showLoading);
  }

  /**
   * 导出选中的`Role`为XML格式。
   *
   * @param {object} criteria
   *     查询条件参数。
   * @param {object} sortRequest
   *     排序参数。
   * @param {boolean} autoDownload
   *     是否自动下载。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|Blob|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，且`autoDownload`为`true`，则解析成功；
   *     若操作成功，且`autoDownload`为`false`，则解析成功并返回文件内容；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/role/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出选中的`Role`为JSON格式。
   *
   * @param {object} criteria
   *     查询条件参数。
   * @param {object} sortRequest
   *     排序参数。
   * @param {boolean} autoDownload
   *     是否自动下载。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|Blob|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，且`autoDownload`为`true`，则解析成功；
   *     若操作成功，且`autoDownload`为`false`，则解析成功并返回文件内容；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/role/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出选中的`Role`为Excel格式。
   *
   * @param {object} criteria
   *     查询条件参数。
   * @param {object} sortRequest
   *     排序参数。
   * @param {boolean} autoDownload
   *     是否自动下载。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|Blob|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，且`autoDownload`为`true`，则解析成功；
   *     若操作成功，且`autoDownload`为`false`，则解析成功并返回文件内容；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/role/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出选中的`Role`为CSV格式。
   *
   * @param {object} criteria
   *     查询条件参数。
   * @param {object} sortRequest
   *     排序参数。
   * @param {boolean} autoDownload
   *     是否自动下载。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|Blob|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，且`autoDownload`为`true`，则解析成功；
   *     若操作成功，且`autoDownload`为`false`，则解析成功并返回文件内容；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/role/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Role`对象。
   *
   * @param {Blob|File} file
   *     包含了要导入的`Role`对象的XML文件或二进制数据。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用
   *     默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Role`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/role/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Role`对象。
   *
   * @param {Blob|File} file
   *     包含了要导入的`Role`对象的JSON文件或二进制数据。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用
   *     默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Role`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/role/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`Role`对象。
   *
   * @param {Blob|File} file
   *     包含了要导入的`Role`对象的Excel文件或二进制数据。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用
   *     默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Role`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/role/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`Role`对象。
   *
   * @param {Blob|File} file
   *     包含了要导入的`Role`对象的CSV文件或二进制数据。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用
   *     默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Role`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/role/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const roleApi = new RoleApi();

export default roleApi;
