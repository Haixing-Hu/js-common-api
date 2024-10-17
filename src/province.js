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
  Province,
  Info,
  Page,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('ProvinceApi');

/**
 * 提供管理`Province`对象的API。
 *
 * @author 胡海星
 */
class ProvinceApi {
  /**
   * 列出符合条件的`Province`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `countryId: string|number|bigint` 所属国家的ID；
   *     - `countryCode: string` 所属国家的编码；
   *     - `countryName: string` 所属国家的名称中应包含的字符串；
   *     - `name: string` 名称中应包含的字符串；
   *     - `phoneArea: string` 电话区号；
   *     - `postalcode: string` 邮政编码；
   *     - `level: number` 级别；
   *     - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<Province>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Province`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/province', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = Province.createArray(page.content, assignOptions);
      logger.info('Successfully list the Province.');
      logger.debug('The page of Province is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Province`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `countryId: string|number|bigint` 所属国家的ID；
   *     - `countryCode: string` 所属国家的编码；
   *     - `countryName: string` 所属国家的名称中应包含的字符串；
   *     - `name: string` 名称中应包含的字符串；
   *     - `phoneArea: string` 电话区号；
   *     - `postalcode: string` 邮政编码；
   *     - `level: number` 级别；
   *     - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<Info>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Province`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/province/info', {
      params,
    }).then((data) => {
      const page = Page.create(data);
      page.content = Info.createArray(page.content);
      logger.info('Successfully list the infos of Province.');
      logger.debug('The page of infos of Province is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Province`对象。
   *
   * @param {string|number|bigint} id
   *     `Province`对象的ID。
   * @return {Promise<Province>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/province/${stringifyId(id)}}`).then((data) => {
      const province = Province.create(data, assignOptions);
      logger.info('Successfully get the Province by ID:', id);
      logger.debug('The Province is:', province);
      return province;
    });
  }

  /**
   * 获取指定的`Province`对象。
   *
   * @param {string} code
   *     `Province`对象的编码。
   * @return {Promise<Province>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/province/code/${code}`).then((data) => {
      const province = Province.create(data, assignOptions);
      logger.info('Successfully get the Province by code:', code);
      logger.debug('The Province is:', province);
      return province;
    });
  }

  /**
   * 获取指定的`Province`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Province`对象的ID。
   * @return {Promise<Info>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/province/${stringifyId(id)}/info`).then((data) => {
      const info = Info.create(data, assignOptions);
      logger.info('Successfully get the info of the Province by ID:', id);
      logger.debug('The info of the Province is:', info);
      return info;
    });
  }

  /**
   * 获取指定的`Province`对象的基本信息。
   *
   * @param {string} code
   *     `Province`对象的编码。
   * @return {Promise<Info>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/province/code/${code}/info`).then((data) => {
      const info = Info.create(data, assignOptions);
      logger.info('Successfully get the info of the Province by code:', code);
      logger.debug('The info of the Province is:', info);
      return info;
    });
  }

  /**
   * 添加一个`Province`对象。
   *
   * @param {Province} province
   *     要添加的`Province`对象。
   * @return {Promise<Province>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(province) {
    checkArgumentType('province', province, Province);
    loading.showAdding();
    return http.post('/province', toJSON(province, toJsonOptions)).then((data) => {
      const province = Province.create(data, assignOptions);
      logger.info('Successfully add the Province:', province.id);
      logger.debug('The added Province is:', province);
      return province;
    });
  }

  /**
   * 根据ID，更新一个`Province`对象。
   *
   * @param {Province} province
   *     要更新的`Province`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Province>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(province) {
    checkArgumentType('province', province, Province);
    loading.showUpdating();
    return http.put(`/province/${stringifyId(province.id)}`, toJSON(province, toJsonOptions)).then((data) => {
      const province = Province.create(data, assignOptions);
      logger.info('Successfully update the Province by ID %s at:', province.id, province.modifyTime);
      logger.debug('The updated Province is:', province);
      return province;
    });
  }

  /**
   * 根据编码，更新一个`Province`对象。
   *
   * @param {Province} province
   *     要更新的`Province`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<Province>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(province) {
    checkArgumentType('province', province, Province);
    loading.showUpdating();
    return http.put(`/province/code/${province.code}`, toJSON(province, toJsonOptions)).then((data) => {
      const province = Province.create(data, assignOptions);
      logger.info('Successfully update the Province by code "%s" at:', province.code, province.modifyTime);
      logger.debug('The updated Province is:', province);
      return province;
    });
  }

  /**
   * 根据ID，标记删除一个`Province`对象。
   *
   * @param {string} id
   *     要标记删除的`Province`对象的ID。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/province/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Province by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Province`对象。
   *
   * @param {string} code
   *     要标记删除的`Province`对象的编码。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
    return http.delete(`/province/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Province by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Province`对象。
   *
   * @param {string} id
   *     要恢复的`Province`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/province/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Province by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Province`对象。
   *
   * @param {string} code
   *     要恢复的`Province`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/province/code/${code}`)
      .then(() => logger.info('Successfully restore the Province by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Province`对象。
   *
   * @param {string} id
   *     要清除的`Province`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/province/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Province by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Province`对象。
   *
   * @param {string} code
   *     要清除的`Province`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/province/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Province by code:', code));
  }

  /**
   * 根据ID，清除一个`Province`对象。
   *
   * @param {string} id
   *     要清除的`Province`对象的ID，该对象不必是已经被标记删除的。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showErasing();
    return http.delete(`/province/${stringifyId(id)}/erase`)
      .then(() => logger.info('Successfully erase the Province by ID:', id));
  }

  /**
   * 根据编码，清除一个`Province`对象。
   *
   * @param {string} code
   *     要清除的`Province`对象的编码，该对象不必是已经被标记删除的。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code) {
    checkArgumentType('code', code, String);
    loading.showErasing();
    return http.delete(`/province/code/${code}/erase`)
      .then(() => logger.info('Successfully erase the Province by code:', code));
  }
}

const provinceApi = new ProvinceApi();

export default provinceApi;
