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
  Dict,
  Page,
  PageRequest,
  State,
  StatefulInfo,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('DictApi');

/**
 * 提供管理`Dict`对象的API。
 *
 * @author 胡海星
 */
class DictApi {
  /**
   * 列出符合条件的`Dict`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *     - `standardCode: string` 在所遵循的标准规范中的编码；
   *     - `appId: string|number|bigint` 所属应用的ID；
   *     - `appCode: string` 所属应用的编码；
   *     - `appName: string` 所属应用的名称包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `state: State|string` 状态；
   *     - `predefined: boolean` 是否是预定义数据；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Dict>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Dict`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/dict', {
      params,
    }).then((obj) => {
      const page = Page.create(obj, assignOptions);
      page.content = Dict.createArray(page.content, assignOptions);
      logger.info('Successfully list the Dict.');
      logger.debug('The page of Dict is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Dict`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `standardDoc: string` 所遵循的标准规范名称中应包含的字符串；
   *     - `standardCode: string` 在所遵循的标准规范中的编码；
   *     - `appId: string|number|bigint` 所属应用的ID；
   *     - `appCode: string` 所属应用的编码；
   *     - `appName: string` 所属应用的名称包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `state: State|string` 状态；
   *     - `predefined: boolean` 是否是预定义数据；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<StatefulInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Dict`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/dict/info', {
      params,
    }).then((obj) => {
      const page = Page.create(obj, assignOptions);
      page.content = StatefulInfo.createArray(page.content, assignOptions);
      logger.info('Successfully list the infos of Dict.');
      logger.debug('The page of infos of Dict is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Dict`对象。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/dict/${stringifyId(id)}`).then((obj) => {
      const result = Dict.create(obj, assignOptions);
      logger.info('Successfully get the Dict by ID:', id);
      logger.debug('The Dict is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Dict`对象。
   *
   * @param {string} code
   *     `Dict`对象的编码。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/dict/code/${code}`).then((obj) => {
      const result = Dict.create(obj, assignOptions);
      logger.info('Successfully get the Dict by code:', code);
      logger.debug('The Dict is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Dict`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/dict/${stringifyId(id)}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Dict by ID:', id);
      logger.debug('The info of the Dict is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Dict`对象的基本信息。
   *
   * @param {string} code
   *     `Dict`对象的编码。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/dict/code/${code}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Dict by code:', code);
      logger.debug('The info of the Dict is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Dict`对象。
   *
   * @param {Dict} dict
   *     要添加的`Dict`对象。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(dict) {
    checkArgumentType('dict', dict, Dict);
    const data = toJSON(dict, toJsonOptions);
    loading.showAdding();
    return http.post('/dict', data).then((obj) => {
      const result = Dict.create(obj, assignOptions);
      logger.info('Successfully add the Dict:', result.id);
      logger.debug('The added Dict is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Dict`对象。
   *
   * @param {Dict} dict
   *     要更新的`Dict`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(dict) {
    checkArgumentType('dict', dict, Dict);
    const id = stringifyId(dict.id);
    const data = toJSON(dict, toJsonOptions);
    loading.showUpdating();
    return http.put(`/dict/${id}`, data).then((obj) => {
      const result = Dict.create(obj, assignOptions);
      logger.info('Successfully update the Dict by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Dict is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Dict`对象。
   *
   * @param {Dict} dict
   *     要更新的`Dict`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<Dict|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Dict`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(dict) {
    checkArgumentType('dict', dict, Dict);
    const data = toJSON(dict, toJsonOptions);
    loading.showUpdating();
    return http.put(`/dict/code/${dict.code}`, data).then((obj) => {
      const result = Dict.create(obj, assignOptions);
      logger.info('Successfully update the Dict by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Dict is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Dict`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Dict`对象的ID。
   * @param {State|string} state
   *     要更新的`Dict`对象的状态，必须是`State`枚举类型或表示其值的字符串。
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
    return http.put(`/dict/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Dict by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`Dict`对象的状态。
   *
   * @param {string} code
   *     要更新的`Dict`对象的编码。
   * @param {State|string} state
   *     要更新的`Dict`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state) {
    checkArgumentType('code', code, String);
    checkArgumentType('state', state, [State, String]);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/dict/code/${code}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Dict by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Dict`对象。
   *
   * @param {string} id
   *     要标记删除的`Dict`对象的ID。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/dict/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Dict by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Dict`对象。
   *
   * @param {string} code
   *     要标记删除的`Dict`对象的编码。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
    return http.delete(`/dict/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Dict by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Dict`对象。
   *
   * @param {string} id
   *     要恢复的`Dict`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/dict/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Dict by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Dict`对象。
   *
   * @param {string} code
   *     要恢复的`Dict`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/dict/code/${code}`)
      .then(() => logger.info('Successfully restore the Dict by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Dict`对象。
   *
   * @param {string} id
   *     要清除的`Dict`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/dict/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Dict by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Dict`对象。
   *
   * @param {string} code
   *     要清除的`Dict`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/dict/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Dict by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Dict`对象。
   *
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/dict/purge')
      .then(() => logger.info('Successfully purge all deleted Dict.'));
  }
}

const dictApi = new DictApi();

export default dictApi;
