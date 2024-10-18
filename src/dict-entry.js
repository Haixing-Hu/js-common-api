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
  DictEntry,
  DictEntryInfo,
  Page,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('DictEntryApi');

/**
 * 提供管理`DictEntry`对象的API。
 *
 * @author 胡海星
 */
class DictEntryApi {
  /**
   * 列出符合条件的`DictEntry`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `dictId: string|number|bigint` 所属字典的ID；
   *     - `dictCode: string` 所属字典的编码；
   *     - `dictName: string` 所属字典的名称包含的字符串；
   *     - `parentId: string|number|bigint` 所属父字典项的ID；
   *     - `parentCode: string` 所属父字典项的编码；
   *     - `parentName: string` 所属父字典项名称中应包含的字符串；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<DictEntry>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`DictEntry`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest, criteria, sort) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, [Object]);
    checkArgumentType('sort', sort, [Object], true);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/dict', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = DictEntry.createArray(page.content, assignOptions);
      logger.info('Successfully list the DictEntry.');
      logger.debug('The page of DictEntry is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`DictEntry`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `dictId: string|number|bigint` 所属字典的ID；
   *     - `dictCode: string` 所属字典的编码；
   *     - `dictName: string` 所属字典的名称包含的字符串；
   *     - `parentId: string|number|bigint` 所属父字典项的ID；
   *     - `parentCode: string` 所属父字典项的编码；
   *     - `parentName: string` 所属父字典项名称中应包含的字符串；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<DictEntryInfo>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`DictEntry`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest, criteria, sort) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, [Object]);
    checkArgumentType('sort', sort, [Object], true);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/dict/info', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = DictEntryInfo.createArray(page.content, assignOptions);
      logger.info('Successfully list the infos of DictEntry.');
      logger.debug('The page of infos of DictEntry is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`DictEntry`对象。
   *
   * @param {string|number|bigint} id
   *     `DictEntry`对象的ID。
   * @return {Promise<DictEntry>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/dict/${stringifyId(id)}`).then((data) => {
      const dict = DictEntry.create(data, assignOptions);
      logger.info('Successfully get the DictEntry by ID:', id);
      logger.debug('The DictEntry is:', dict);
      return dict;
    });
  }

  /**
   * 获取指定的`DictEntry`对象。
   *
   * @param {string} code
   *     `DictEntry`对象的编码。
   * @return {Promise<DictEntry>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/dict/code/${code}`).then((data) => {
      const dict = DictEntry.create(data, assignOptions);
      logger.info('Successfully get the DictEntry by code:', code);
      logger.debug('The DictEntry is:', dict);
      return dict;
    });
  }

  /**
   * 获取指定的`DictEntry`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `DictEntry`对象的ID。
   * @return {Promise<DictEntryInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntryInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/dict/${stringifyId(id)}/info`).then((data) => {
      const info = DictEntryInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the DictEntry by ID:', id);
      logger.debug('The info of the DictEntry is:', info);
      return info;
    });
  }

  /**
   * 获取指定的`DictEntry`对象的基本信息。
   *
   * @param {string} code
   *     `DictEntry`对象的编码。
   * @return {Promise<DictEntryInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DictEntryInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/dict/code/${code}/info`).then((data) => {
      const info = DictEntryInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the DictEntry by code:', code);
      logger.debug('The info of the DictEntry is:', info);
      return info;
    });
  }

  /**
   * 添加一个`DictEntry`对象。
   *
   * @param {DictEntry} dict
   *     要添加的`DictEntry`对象。
   * @return {Promise<DictEntry>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(dict) {
    checkArgumentType('dict', dict, DictEntry);
    const data = toJSON(dict, toJsonOptions);
    loading.showAdding();
    return http.post('/dict', data).then((data) => {
      const dict = DictEntry.create(data, assignOptions);
      logger.info('Successfully add the DictEntry:', dict.id);
      logger.debug('The added DictEntry is:', dict);
      return dict;
    });
  }

  /**
   * 根据ID，更新一个`DictEntry`对象。
   *
   * @param {DictEntry} dict
   *     要更新的`DictEntry`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<DictEntry>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(dict) {
    checkArgumentType('dict', dict, DictEntry);
    const data = toJSON(dict, toJsonOptions);
    loading.showUpdating();
    return http.put(`/dict/${stringifyId(dict.id)}`, data).then((data) => {
      const dict = DictEntry.create(data, assignOptions);
      logger.info('Successfully update the DictEntry by ID %s at:', dict.id, dict.modifyTime);
      logger.debug('The updated DictEntry is:', dict);
      return dict;
    });
  }

  /**
   * 根据编码，更新一个`DictEntry`对象。
   *
   * @param {DictEntry} dict
   *     要更新的`DictEntry`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<DictEntry>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`DictEntry`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(dict) {
    checkArgumentType('dict', dict, DictEntry);
    const data = toJSON(dict, toJsonOptions);
    loading.showUpdating();
    return http.put(`/dict/code/${dict.code}`, data).then((data) => {
      const dict = DictEntry.create(data, assignOptions);
      logger.info('Successfully update the DictEntry by code "%s" at:', dict.code, dict.modifyTime);
      logger.debug('The updated DictEntry is:', dict);
      return dict;
    });
  }

  /**
   * 根据ID，标记删除一个`DictEntry`对象。
   *
   * @param {string} id
   *     要标记删除的`DictEntry`对象的ID。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/dict/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the DictEntry by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`DictEntry`对象。
   *
   * @param {string} code
   *     要标记删除的`DictEntry`对象的编码。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
    return http.delete(`/dict/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the DictEntry by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`DictEntry`对象。
   *
   * @param {string} id
   *     要恢复的`DictEntry`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/dict/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the DictEntry by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`DictEntry`对象。
   *
   * @param {string} code
   *     要恢复的`DictEntry`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/dict/code/${code}`)
      .then(() => logger.info('Successfully restore the DictEntry by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`DictEntry`对象。
   *
   * @param {string} id
   *     要清除的`DictEntry`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/dict/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the DictEntry by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`DictEntry`对象。
   *
   * @param {string} code
   *     要清除的`DictEntry`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/dict/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the DictEntry by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`DictEntry`对象。
   *
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/dict/purge')
      .then(() => logger.info('Successfully purge all deleted DictEntry.'));
  }
}

const dictApi = new DictEntryApi();

export default dictApi;
