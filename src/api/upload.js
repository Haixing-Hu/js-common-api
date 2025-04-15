////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { AttachmentType, Upload } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import { batchDeleteImpl, deleteImpl } from './impl/delete-impl';
import { batchEraseImpl, eraseImpl } from './impl/erase-impl';
import { getImpl } from './impl/get-impl';
import { listImpl } from './impl/list-impl';
import { batchPurgeImpl, purgeAllImpl, purgeImpl } from './impl/purge-impl';
import { batchRestoreImpl, restoreImpl } from './impl/restore-impl';

/**
 * 提供管理`Upload`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class UploadApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Upload;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'originalFilename', type: String },
    { name: 'type', type: [AttachmentType, String] },
    { name: 'deleted', type: Boolean },
    { name: 'createTimeStart', type: String },
    { name: 'createTimeEnd', type: String },
    { name: 'deleteTimeStart', type: String },
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`Upload`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `originalFilename: string` 上传的原始文件的文件名所包含的字符串；
   *  - `type: AttachmentType|string` 附件类型；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Upload>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Upload`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    return listImpl(this, '/upload', pageRequest, criteria, sortRequest, showLoading, { transformUrls });
  }

  /**
   * 获取指定的`Upload`对象。
   *
   * @param {string|number|bigint} id
   *     `Upload`对象的ID。
   * @param {boolean} transformUrls
   *     是否将返回对象中所有文件的存储路径转换为外链URL。若为`null`或`false`则不作转换。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Upload|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Upload`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    return getImpl(this, '/upload/{id}', id, showLoading, { transformUrls });
  }

  /**
   * 根据ID，标记删除一个`Upload`对象。
   *
   * @param {string} id
   *     要标记删除的`Upload`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/upload/{id}', id, showLoading);
  }

  /**
   * 批量标记删除指定的`Upload`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的`Upload`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/upload/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Upload`对象。
   *
   * @param {string} id
   *     要恢复的`Upload`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/upload/{id}', id, showLoading);
  }

  /**
   * 批量恢复指定的已被标记删除的`Upload`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的已被标记删除的`Upload`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回恢复的上传文件信息对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/upload/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Upload`对象。
   *
   * @param {string} id
   *     要清除的`Upload`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/upload/{id}/purge', id, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Upload`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的数据数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/upload/purge', showLoading);
  }

  /**
   * 批量彻底清除指定的已被标记删除的`Upload`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的已被标记删除的`Upload`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的上传文件信息对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/upload/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Upload`对象（无论其是否被标记删除）。
   *
   * @param {string} id
   *     指定的`Upload`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/upload/{id}/erase', id, showLoading);
  }

  /**
   * 批量彻底清除指定的`Upload`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     指定的`Upload`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被清除的上传文件信息对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/upload/batch/erase', ids, showLoading);
  }
}

const uploadApi = new UploadApi();

export default uploadApi;
