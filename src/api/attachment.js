////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Attachment, State } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import { getImpl } from './impl/get-impl';
import { listImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';
import { updateImpl, updatePropertyImpl } from './impl/update-impl';

/**
 * 提供管理`Attachment`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class AttachmentApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Attachment;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 所属实体的类型
    { name: 'ownerType', type: String },
    // 所属实体的ID
    { name: 'ownerId', type: [String, Number, BigInt] },
    // 所属实体的属性的名称
    { name: 'ownerProperty', type: String },
    // 附件类型
    { name: 'type', type: String },
    // 所属类别的ID
    { name: 'categoryId', type: [String, Number, BigInt] },
    // 所属类别的编码
    { name: 'categoryCode', type: String },
    // 所属类别的名称包含的字符串
    { name: 'categoryName', type: String },
    // 标题所包含的字符串
    { name: 'title', type: String },
    // 所对应的上传的文件的ID
    { name: 'uploadId', type: [String, Number, BigInt] },
    // 状态
    { name: 'state', type: [State, String] },
    // 是否可见
    { name: 'visible', type: Boolean },
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
    // 是否将返回对象中所有文件的存储路径转换为外链URL
    { name: 'transformUrls', type: Boolean },
  ];

  /**
   * 列出符合条件的`Attachment`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `ownerType: string` 所属实体的类型；
   *  - `ownerId: string|number|bigint` 所属实体的ID；
   *  - `ownerProperty: string` 所属实体的属性的名称；
   *  - `type: string` 附件类型；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `title: string` 标题所包含的字符串；
   *  - `uploadId: string|number|bigint` 所对应的上传的文件的ID；
   *  - `state: State|string` 状态；
   *  - `visible: boolean` 是否可见；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   *  - `transformUrls: boolean` 是否将返回对象中所有文件的存储路径转换为外链URL。
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Attachment>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Attachment`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/attachment', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 获取指定的`Attachment`对象。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/attachment/{id}', id, showLoading);
  }

  /**
   * 添加一个`Attachment`对象。
   *
   * @param {Attachment|object} entity
   *     要添加的`Attachment`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/attachment', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Attachment`对象。
   *
   * @param {Attachment|object} entity
   *     要更新的`Attachment`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/attachment/{id}', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Attachment`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @param {State|string} state
   *     要更新的`Attachment`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/attachment/{id}/state', id, 'state', State, state, showLoading);
  }

  /**
   * 根据ID，更新一个`Attachment`对象的可见性。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @param {boolean} visible
   *     要更新的`Attachment`对象的可见性。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateVisible(id, visible, showLoading = true) {
    return updatePropertyImpl(this, '/attachment/{id}/visible', id, 'visible', Boolean, visible, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Attachment`对象。
   *
   * @param {string} id
   *     要标记删除的`Attachment`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/attachment/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`Attachment`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Attachment`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/attachment/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Attachment`对象。
   *
   * @param {string} id
   *     要恢复的`Attachment`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/attachment/{id}', id, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Attachment`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Attachment`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/attachment/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Attachment`对象。
   *
   * @param {string} id
   *     要清除的`Attachment`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/attachment/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Attachment`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/attachment/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Attachment`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Attachment`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/attachment/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Attachment`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Attachment`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/attachment/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底清除指定的`Attachment`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Attachment`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/attachment/batch/erase', ids, showLoading);
  }
}

const attachmentApi = new AttachmentApi();

export default attachmentApi;
