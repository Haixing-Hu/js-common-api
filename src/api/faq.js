////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Faq,
  State,
  StatefulInfo,
} from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import {
  getImpl,
  getInfoImpl,
} from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';
import {
  updateImpl,
  updatePropertyImpl,
} from './impl/update-impl';

/**
 * 提供管理`Faq`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class FaqApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Faq;

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
    // 所属类别ID
    { name: 'categoryId', type: [String, Number, BigInt] },
    // 所属类别代码
    { name: 'categoryCode', type: String },
    // 所属类别名称包含的字符串
    { name: 'categoryName', type: String },
    // 所属产品ID
    { name: 'productId', type: [String, Number, BigInt] },
    // 所属产品代码
    { name: 'productCode', type: String },
    // 所属产品名称包含的字符串
    { name: 'productName', type: String },
    // 问题描述包含的字符串
    { name: 'question', type: String },
    // 答案描述包含的字符串
    { name: 'answer', type: String },
    // 状态
    { name: 'state', type: [State, String] },
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
   * 列出符合条件的`Faq`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的代码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的代码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `productId: string|number|bigint` 所属产品的ID；
   *  - `productCode: string` 所属产品的代码；
   *  - `productName: string` 所属产品的名称包含的字符串；
   *  - `question: string` 问题描述包含的字符串；
   *  - `answer: string` 答案描述包含的字符串；
   *  - `state: State|string` 状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序请求。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PageResponse<Faq>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`PageResponse<Faq>`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/faq', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Faq`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的代码；
   *  - `appName: string` 所属应用的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的代码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `productId: string|number|bigint` 所属产品的ID；
   *  - `productCode: string` 所属产品的代码；
   *  - `productName: string` 所属产品的名称包含的字符串；
   *  - `question: string` 问题描述包含的字符串；
   *  - `answer: string` 答案描述包含的字符串；
   *  - `state: State|string` 状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序请求。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PageResponse<StatefulInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`PageResponse<StatefulInfo>`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/faq/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取一个`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     `Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Faq|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Faq`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/faq/{id}', id, showLoading);
  }

  /**
   * 根据ID，获取一个`Faq`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/faq/{id}/info', id, showLoading);
  }

  /**
   * 添加一个新的`Faq`对象。
   *
   * @param {Faq|object} entity
   *     要添加的`Faq`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Faq|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回添加的`Faq`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/faq', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     `Faq`对象的ID。
   * @param {Faq|object} entity
   *     要更新的`Faq`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(id, entity, showLoading = true) {
    return updateImpl(this, '/faq/{id}', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Faq`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Faq`对象的ID。
   * @param {State|string} state
   *     要更新的`Faq`对象的状态。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/faq/{id}/state', id, 'state', [State, String], state, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     要标记删除的`Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/faq/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`Faq`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Faq`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被删除的对象数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/faq/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     要恢复的`Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被恢复的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/faq/{id}/restore', id, showLoading);
  }

  /**
   * 批量恢复被标记删除的`Faq`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的`Faq`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被恢复的对象数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/faq/batch/restore', ids, showLoading);
  }

  /**
   * 根据ID，彻底删除一个`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     要彻底删除的`Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被彻底删除的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/faq/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底删除指定的`Faq`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底删除的`Faq`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被彻底删除的对象数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/faq/batch/erase', ids, showLoading);
  }

  /**
   * 根据ID，清除一个`Faq`对象。
   *
   * @param {string|number|bigint} id
   *     要清除的`Faq`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被清除的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/faq/{id}/purge', id, showLoading);
  }

  /**
   * 批量清除指定的`Faq`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量清除的`Faq`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的对象数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/faq/batch/purge', ids, showLoading);
  }

  /**
   * 清除所有被标记删除的`Faq`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的对象数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/faq/purge-all', showLoading);
  }

  /**
   * 导出符合条件的`Faq`对象。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。
   * @param {object} sortRequest
   *     排序请求。
   * @param {string} format
   *     导出格式，支持`excel`、`csv`、`json`等。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Blob|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导出的文件数据；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  export(criteria = {}, sortRequest = {}, format = 'excel', showLoading = true) {
    return exportImpl(this, '/faq/export', criteria, sortRequest, format, showLoading);
  }

  /**
   * 导入`Faq`对象。
   *
   * @param {File} file
   *     要导入的文件。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<ImportResult|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入结果；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  import(file, showLoading = true) {
    return importImpl(this, '/faq/import', file, showLoading);
  }
}

const faqApi = new FaqApi();

export default faqApi;
