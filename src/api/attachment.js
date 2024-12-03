////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { stringifyId, toJSON } from '@haixing_hu/common-decorator';
import {
  Attachment,
  PageRequest,
  State,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('AttachmentApi');

/**
 * 提供管理`Attachment`对象的API。
 *
 * @author 胡海星
 */
class AttachmentApi {
  /**
   * 列出符合条件的`Attachment`对象。
   *
   * @param {PageRequest} pageRequest
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
   *  - `attachmentId: string|number|bigint` 所对应的上传的文件的ID；
   *  - `state: State|string` 状态；
   *  - `visible: boolean` 是否可见；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Attachment>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Attachment`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/attachment', {
      params,
    }).then((obj) => {
      const page = Attachment.createPage(obj, assignOptions);
      logger.info('Successfully list the Attachment.');
      logger.debug('The page of Attachment is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Attachment`对象。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/attachment/${stringifyId(id)}}`).then((obj) => {
      const result = Attachment.create(obj, assignOptions);
      logger.info('Successfully get the Attachment by ID:', id);
      logger.debug('The Attachment is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Attachment`对象。
   *
   * @param {Attachment} attachment
   *     要添加的`Attachment`对象。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(attachment) {
    checkArgumentType('attachment', attachment, Attachment);
    const data = toJSON(attachment, toJsonOptions);
    loading.showAdding();
    return http.post('/attachment', data).then((obj) => {
      const result = Attachment.create(obj, assignOptions);
      logger.info('Successfully add the Attachment:', result.id);
      logger.debug('The added Attachment is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Attachment`对象。
   *
   * @param {Attachment} attachment
   *     要更新的`Attachment`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Attachment`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(attachment) {
    checkArgumentType('attachment', attachment, Attachment);
    const id = stringifyId(attachment.id);
    const data = toJSON(attachment, toJsonOptions);
    loading.showUpdating();
    return http.put(`/attachment/${id}`, data).then((obj) => {
      const result = Attachment.create(obj, assignOptions);
      logger.info('Successfully update the Attachment by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Attachment is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Attachment`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @param {State|string} state
   *     要更新的`Attachment`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('state', state, [State, String]);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/attachment/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Attachment`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Attachment`对象的ID。
   * @param {boolean} visible
   *     要更新的`Attachment`对象的可见性。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateVisible(id, visible) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('visible', visible, Boolean);
    const data = { visible };
    loading.showUpdating();
    return http.put(`/attachment/${stringifyId(id)}/visible`, data).then((timestamp) => {
      logger.info('Successfully update the visibility of the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Attachment`对象。
   *
   * @param {string} id
   *     要标记删除的`Attachment`对象的ID。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/attachment/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Attachment by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Attachment`对象。
   *
   * @param {string} id
   *     要恢复的`Attachment`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/attachment/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Attachment by ID:', id));
  }

  /**
   * 根据ID，清除一个被标记删除的`Attachment`对象。
   *
   * @param {string} id
   *     要清除的`Attachment`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/attachment/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Attachment by ID:', id));
  }

  /**
   * 根彻底清除全部已被标记删除的`Attachment`对象。
   *
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/attachment/purge')
      .then(() => logger.info('Successfully purge all deleted Attachment.'));
  }
}

const attachmentApi = new AttachmentApi();

export default attachmentApi;
