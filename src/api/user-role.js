////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { UserRole } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import { getImpl } from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl } from './impl/list-impl';

/**
 * 提供管理`UserRole`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class UserRoleApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = UserRole;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 用户ID
    { name: 'userId', type: [String, Number, BigInt] },
    // 用户名包含的字符串
    { name: 'username', type: String },
    // 应用ID
    { name: 'appId', type: [String, Number, BigInt] },
    // 应用代码
    { name: 'appCode', type: String },
    // 应用名称包含的字符串
    { name: 'appName', type: String },
    // 角色ID
    { name: 'roleId', type: [String, Number, BigInt] },
    // 角色代码
    { name: 'roleCode', type: String },
    // 角色名称包含的字符串
    { name: 'roleName', type: String },
    // 创建时间范围的（闭区间）起始值
    { name: 'createTimeStart', type: String },
    // 创建时间范围的（闭区间）结束值
    { name: 'createTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`UserRole`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `userId: string|number|bigint` 用户ID；
   *  - `username: string` 用户名包含的字符串；
   *  - `appId: string|number|bigint` 应用ID；
   *  - `appCode: string` 应用代码；
   *  - `appName: string` 应用名称包含的字符串；
   *  - `roleId: string|number|bigint` 角色ID；
   *  - `roleCode: string` 角色代码；
   *  - `roleName: string` 角色名称包含的字符串；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<UserRole>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`UserRole`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/user-role', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`UserRole`对象。
   *
   * @param {string|number|bigint} id
   *     `UserRole`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<UserRole|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`UserRole`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/user-role/{id}', id, showLoading);
  }

  /**
   * 添加一个新的`UserRole`对象。
   *
   * @param {UserRole} entity
   *     待添加的`UserRole`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<UserRole|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回添加成功的`UserRole`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/user-role', entity, showLoading);
  }

  /**
   * 彻底清除指定的`UserRole`对象。
   *
   * @param {string|number|bigint} id
   *     待清除的`UserRole`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回`null`；若操作失败，则解析
   *     失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/user-role/{id}/erase', id, showLoading);
  }

  /**
   * 导出指定的`UserRole`对象为XML格式。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `userId: string|number|bigint` 用户ID；
   *  - `username: string` 用户名包含的字符串；
   *  - `appId: string|number|bigint` 应用ID；
   *  - `appCode: string` 应用代码；
   *  - `appName: string` 应用名称包含的字符串；
   *  - `roleId: string|number|bigint` 角色ID；
   *  - `roleCode: string` 角色代码；
   *  - `roleName: string` 角色名称包含的字符串；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
   * @param {boolean} autoDownload
   *     是否自动下载导出的文件。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Blob|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Blob`对象（若
   *     `autoDownload`为`true`则返回`null`）；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/user-role/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出指定的`UserRole`对象为JSON格式。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `userId: string|number|bigint` 用户ID；
   *  - `username: string` 用户名包含的字符串；
   *  - `userRealname: string` 用户姓名包含的字符串；
   *  - `appId: string|number|bigint` 应用ID；
   *  - `appCode: string` 应用代码；
   *  - `appName: string` 应用名称包含的字符串；
   *  - `roleId: string|number|bigint` 角色ID；
   *  - `roleCode: string` 角色代码；
   *  - `roleName: string` 角色名称包含的字符串；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
   * @param {boolean} autoDownload
   *     是否自动下载导出的文件。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Blob|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Blob`对象（若
   *     `autoDownload`为`true`则返回`null`）；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/user-role/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出指定的`UserRole`对象为Excel格式。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `userId: string|number|bigint` 用户ID；
   *  - `username: string` 用户名包含的字符串；
   *  - `userRealname: string` 用户姓名包含的字符串；
   *  - `appId: string|number|bigint` 应用ID；
   *  - `appCode: string` 应用代码；
   *  - `appName: string` 应用名称包含的字符串；
   *  - `roleId: string|number|bigint` 角色ID；
   *  - `roleCode: string` 角色代码；
   *  - `roleName: string` 角色名称包含的字符串；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
   * @param {boolean} autoDownload
   *     是否自动下载导出的文件。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Blob|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Blob`对象（若
   *     `autoDownload`为`true`则返回`null`）；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/user-role/export/excel', 'Excel', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出指定的`UserRole`对象为CSV格式。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `userId: string|number|bigint` 用户ID；
   *  - `username: string` 用户名包含的字符串；
   *  - `userRealname: string` 用户姓名包含的字符串；
   *  - `appId: string|number|bigint` 应用ID；
   *  - `appCode: string` 应用代码；
   *  - `appName: string` 应用名称包含的字符串；
   *  - `roleId: string|number|bigint` 角色ID；
   *  - `roleCode: string` 角色代码；
   *  - `roleName: string` 角色名称包含的字符串；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。
   * @param {boolean} autoDownload
   *     是否自动下载导出的文件。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Blob|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Blob`对象（若
   *     `autoDownload`为`true`则返回`null`）；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/user-role/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`UserRole`对象。
   *
   * @param {File} file
   *     包含要导入数据的XML文件。
   * @param {boolean} parallel
   *     是否并行导入。
   * @param {number|null} threads
   *     并行导入的线程数，若`parallel`为`false`则此参数无效；若此参数为`null`则使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的记录数；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/user-role/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`UserRole`对象。
   *
   * @param {File} file
   *     包含要导入数据的JSON文件。
   * @param {boolean} parallel
   *     是否并行导入。
   * @param {number|null} threads
   *     并行导入的线程数，若`parallel`为`false`则此参数无效；若此参数为`null`则使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的记录数；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/user-role/import/json', 'JSON', file, parallel, threads, showLoading);
  }

  /**
   * 从Excel文件导入`UserRole`对象。
   *
   * @param {File} file
   *     包含要导入数据的Excel文件。
   * @param {boolean} parallel
   *     是否并行导入。
   * @param {number|null} threads
   *     并行导入的线程数，若`parallel`为`false`则此参数无效；若此参数为`null`则使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的记录数；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/user-role/import/excel', 'Excel', file, parallel, threads, showLoading);
  }

  /**
   * 从CSV文件导入`UserRole`对象。
   *
   * @param {File} file
   *     包含要导入数据的CSV文件。
   * @param {boolean} parallel
   *     是否并行导入。
   * @param {number|null} threads
   *     并行导入的线程数，若`parallel`为`false`则此参数无效；若此参数为`null`则使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的记录数；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/user-role/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const userRoleApi = new UserRoleApi();

export default userRoleApi;
