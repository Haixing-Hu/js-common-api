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
  Street,
  Info,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('StreetApi');

/**
 * 提供管理`Street`对象的API。
 *
 * @author 胡海星
 */
class StreetApi {
  /**
   * 列出符合条件的`Street`对象。
   *
   * @param {PageRequest} pageRequest
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
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Street>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/street', {
      params,
    }).then((obj) => {
      const page = Street.createPage(obj, assignOptions);
      logger.info('Successfully list the Street.');
      logger.debug('The page of Street is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Street`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *
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
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Info>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/street/info', {
      params,
    }).then((obj) => {
      const page = Info.createPage(obj);
      logger.info('Successfully list the infos of Street.');
      logger.debug('The page of infos of Street is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Street`对象。
   *
   * @param {string|number|bigint} id
   *     `Street`对象的ID。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/street/${stringifyId(id)}}`).then((obj) => {
      const result = Street.create(obj, assignOptions);
      logger.info('Successfully get the Street by ID:', id);
      logger.debug('The Street is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Street`对象。
   *
   * @param {string} code
   *     `Street`对象的编码。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/street/code/${code}`).then((obj) => {
      const result = Street.create(obj, assignOptions);
      logger.info('Successfully get the Street by code:', code);
      logger.debug('The Street is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Street`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Street`对象的ID。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/street/${stringifyId(id)}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the Street by ID:', id);
      logger.debug('The info of the Street is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Street`对象的基本信息。
   *
   * @param {string} code
   *     `Street`对象的编码。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/street/code/${code}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the Street by code:', code);
      logger.debug('The info of the Street is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Street`对象。
   *
   * @param {Street} street
   *     要添加的`Street`对象。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(street) {
    checkArgumentType('street', street, Street);
    const data = toJSON(street, toJsonOptions);
    loading.showAdding();
    return http.post('/street', data).then((obj) => {
      const result = Street.create(obj, assignOptions);
      logger.info('Successfully add the Street:', result.id);
      logger.debug('The added Street is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Street`对象。
   *
   * @param {Street} street
   *     要更新的`Street`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(street) {
    checkArgumentType('street', street, Street);
    const data = toJSON(street, toJsonOptions);
    loading.showUpdating();
    return http.put(`/street/${stringifyId(street.id)}`, data).then((obj) => {
      const result = Street.create(obj, assignOptions);
      logger.info('Successfully update the Street by ID %s at:', result.id, result.modifyTime);
      logger.debug('The updated Street is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Street`对象。
   *
   * @param {Street} street
   *     要更新的`Street`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(street) {
    checkArgumentType('street', street, Street);
    const data = toJSON(street, toJsonOptions);
    loading.showUpdating();
    return http.put(`/street/code/${street.code}`, data).then((obj) => {
      const result = Street.create(obj, assignOptions);
      logger.info('Successfully update the Street by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Street is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`Street`对象。
   *
   * @param {string} id
   *     要标记删除的`Street`对象的ID。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/street/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Street by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Street`对象。
   *
   * @param {string} code
   *     要标记删除的`Street`对象的编码。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
    return http.delete(`/street/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Street by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Street`对象。
   *
   * @param {string} id
   *     要恢复的`Street`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/street/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Street by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要恢复的`Street`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/street/code/${code}`)
      .then(() => logger.info('Successfully restore the Street by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Street`对象。
   *
   * @param {string} id
   *     要清除的`Street`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/street/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Street by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要清除的`Street`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/street/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Street by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Street`对象。
   *
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/street/purge')
      .then(() => logger.info('Successfully purge all deleted Street.'));
  }
}

const streetApi = new StreetApi();

export default streetApi;