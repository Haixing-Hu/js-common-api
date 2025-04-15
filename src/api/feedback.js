////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { stringifyId, toJSON } from '@qubit-ltd/common-decorator';
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Feedback,
  FeedbackAction,
  FeedbackStatus,
  FeedbackTrack,
  FeedbackType,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import { getImpl } from './impl/get-impl';
import { listImpl } from './impl/list-impl';
import { assignOptions, toJsonOptions } from './impl/options';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';

/**
 * 提供管理`Feedback`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class FeedbackApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Feedback;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'appId', type: [String, Number, BigInt] },
    { name: 'appCode', type: String },
    { name: 'appName', type: String },
    { name: 'type', type: [FeedbackType, String] },
    { name: 'category', type: String },
    { name: 'submitterId', type: [String, Number, BigInt] },
    { name: 'submitterUsername', type: String },
    { name: 'status', type: [FeedbackStatus, String] },
    { name: 'deleted', type: Boolean },
    { name: 'createTimeStart', type: String },
    { name: 'createTimeEnd', type: String },
    { name: 'modifyTimeStart', type: String },
    { name: 'modifyTimeEnd', type: String },
    { name: 'deleteTimeStart', type: String },
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`Feedback`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `type: FeedbackType|string` 类型；
   *  - `category: string` 具体类别；
   *  - `submitterId: string|number|bigint` 提交用户的ID；
   *  - `submitterUsername: string` 提交用户的用户名；
   *  - `status: FeedbackStatus|string` 状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数。允许的参数包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Feedback>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Feedback`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    return listImpl(this, '/feedback', pageRequest, criteria, sortRequest, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Feedback|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Feedback`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    return getImpl(this, '/feedback/{id}', id, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`Feedback`的所有跟踪记录列表。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<FeedbackTrack>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Feedback`
   *     的所有`FeedbackTrack`对象列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getTracks(id, transformUrls = true, showLoading = true) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/feedback/${stringifyId(id)}/track`, { params }).then((obj) => {
      const result = FeedbackTrack.createArray(obj, assignOptions);
      this.logger.info('Successfully get all tracks of Feedback by ID:', id);
      this.logger.debug('The FeedbackTrack is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Feedback`对象。
   *
   * @param {Feedback|object} entity
   *     要添加的`Feedback`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Feedback|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Feedback`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/feedback', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {FeedbackAction|string} action
   *     待执行的操作。
   * @param {FeedbackTrack} track
   *     操作的跟踪记录。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<FeedbackTrack|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`FeedbackTrack`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  performAction(id, action, track, showLoading = true) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('action', action, [FeedbackAction, String]);
    checkArgumentType('track', track, FeedbackTrack);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(track, toJsonOptions);
    const url = `/feedback/${stringifyId(id)}/action/${action}`;
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(url, data).then((obj) => {
      const result = FeedbackTrack.create(obj, assignOptions);
      this.logger.info('Successfully perform the action %s to the Feedback:', action, id);
      this.logger.debug('The added FeedbackTrack is:', result);
      return result;
    });
  }

  /**
   * 标记删除指定的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/feedback/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`Feedback`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的`Feedback`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/feedback/batch', ids, showLoading);
  }

  /**
   * 恢复指定的已被标记删除的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的已被标记删除的`Feedback`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/feedback/{id}', id, showLoading);
  }

  /**
   * 批量恢复指定的已被标记删除的`Feedback`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的已被标记删除的`Feedback`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回恢复的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/feedback/batch', ids, showLoading);
  }

  /**
   * 彻底清除指定的已被标记删除的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的已被标记删除的`Feedback`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/feedback/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Feedback`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/feedback/purge', showLoading);
  }

  /**
   * 批量彻底清除指定的已被标记删除的`Feedback`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的已被标记删除的`Feedback`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/feedback/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/feedback/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底清除指定的`Feedback`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的`Feedback`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/feedback/batch/erase', ids, showLoading);
  }
}

const feedbackApi = new FeedbackApi();

export default feedbackApi;
