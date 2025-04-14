////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { stringifyId, toJSON } from '@qubit-ltd/common-decorator';
import {
  City,
  Info,
  CommonMimeType,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkIdArrayArgumentType from '../utils/check-id-array-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('CityApi');

/**
 * City 类的查询条件定义
 * 
 * @type {Array<Object>}
 */
const CITY_CRITERIA_DEFINITIONS = [
  // 所属省份的ID
  { name: 'provinceId', type: [String, Number, BigInt] },
  // 所属省份的编码
  { name: 'provinceCode', type: String },
  // 所属省份的名称中应包含的字符串
  { name: 'provinceName', type: String },
  // 名称中应包含的字符串
  { name: 'name', type: String },
  // 电话区号
  { name: 'phoneArea', type: String },
  // 邮政编码
  { name: 'postalcode', type: String },
  // 级别
  { name: 'level', type: Number },
  // 是否是预定义数据
  { name: 'predefined', type: Boolean },
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
 * 提供管理`City`对象的API。
 *
 * @author 胡海星
 */
class CityApi {
  /**
   * 列出符合条件的`City`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<City>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`City`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/city', {
      params,
    }).then((obj) => {
      const page = City.createPage(obj, assignOptions);
      logger.info('Successfully list the City.');
      logger.debug('The page of City is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`City`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Info>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`City`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/city/info', {
      params,
    }).then((obj) => {
      const page = Info.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of City.');
      logger.debug('The page of infos of City is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`City`对象。
   *
   * @param {string|number|bigint} id
   *     `City`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<City|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`City`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/city/${stringifyId(id)}`).then((obj) => {
      const result = City.create(obj, assignOptions);
      logger.info('Successfully get the City by ID:', id);
      logger.debug('The City is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`City`对象。
   *
   * @param {string} code
   *     `City`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<City|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`City`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/city/code/${code}`).then((obj) => {
      const result = City.create(obj, assignOptions);
      logger.info('Successfully get the City by code:', code);
      logger.debug('The City is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`City`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `City`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/city/${stringifyId(id)}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the City by ID:', id);
      logger.debug('The info of the City is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`City`对象的基本信息。
   *
   * @param {string} code
   *     `City`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Info|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Info`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/city/code/${code}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the City by code:', code);
      logger.debug('The info of the City is:', result);
      return result;
    });
  }

  /**
   * 添加一个`City`对象。
   *
   * @param {City|object} city
   *     要添加的`City`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<City|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`City`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(city, showLoading = true) {
    checkArgumentType('city', city, [City, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(city, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/city', data).then((obj) => {
      const result = City.create(obj, assignOptions);
      logger.info('Successfully add the City:', result.id);
      logger.debug('The added City is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`City`对象。
   *
   * @param {City|object} city
   *     要更新的`City`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<City|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`City`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(city, showLoading = true) {
    checkArgumentType('city', city, [City, Object]);
    checkIdArgumentType(city.id, 'city.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(city.id);
    const data = toJSON(city, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/city/${id}`, data).then((obj) => {
      const result = City.create(obj, assignOptions);
      logger.info('Successfully update the City by ID %s at:', id, result.modifyTime);
      logger.debug('The updated City is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`City`对象。
   *
   * @param {City|object} city
   *     要更新的`City`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<City|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`City`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(city, showLoading = true) {
    checkArgumentType('city', city, [City, Object]);
    checkArgumentType('city.code', city.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(city, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/city/code/${city.code}`, data).then((obj) => {
      const result = City.create(obj, assignOptions);
      logger.info('Successfully update the City by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated City is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`City`对象。
   *
   * @param {string} id
   *     要标记删除的`City`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/city/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the City by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`City`对象。
   *
   * @param {string} code
   *     要标记删除的`City`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/city/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the City by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`City`对象。
   *
   * @param {string} id
   *     要恢复的`City`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch(`/city/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the City by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`City`对象。
   *
   * @param {string} code
   *     要恢复的`City`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch(`/city/code/${code}`)
      .then(() => logger.info('Successfully restore the City by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`City`对象。
   *
   * @param {string} id
   *     要清除的`City`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/city/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the City by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`City`对象。
   *
   * @param {string} code
   *     要清除的`City`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/city/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the City by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`City`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/city/purge')
      .then(() => logger.info('Successfully purge all deleted City.'));
  }

  /**
   * 批量彻底清除已被标记删除的`City`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`City`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    checkIdArrayArgumentType(ids);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (ids.length === 0) {
      return Promise.resolve(0);
    }
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/city/batch/purge', {
      data: ids,
    }).then((result) => {
      logger.info('Successfully purge batch deleted City.');
      logger.debug('Batch purged City count:', result);
      return result;
    });
  }

  /**
   * 彻底清除指定的`City`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`City`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/city/${stringifyId(id)}/erase`).then(() => {
      logger.info('Successfully erase the City by ID:', id);
    });
  }

  /**
   * 彻底清除指定的`City`对象。
   *
   * @param {string} code
   *     指定的`City`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/city/code/${code}/erase`).then(() => {
      logger.info('Successfully erase the City by code:', code);
    });
  }

  /**
   * 批量彻底删除指定的`City`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底删除的`City`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    checkIdArrayArgumentType(ids);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (ids.length === 0) {
      return Promise.resolve(0);
    }
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete('/city/batch/erase', {
      data: ids,
    }).then((result) => {
      logger.info('Successfully erase batch City.');
      logger.debug('Batch erased City count:', result);
      return result;
    });
  }

  /**
   * 批量标记删除指定的`City`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量标记删除的`City`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    checkIdArrayArgumentType(ids);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (ids.length === 0) {
      return Promise.resolve(0);
    }
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete('/city/batch', {
      data: ids,
    }).then((result) => {
      logger.info('Successfully delete batch City.');
      logger.debug('Batch deleted City count:', result);
      return result;
    });
  }

  /**
   * 批量恢复已被标记删除的`City`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`City`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    checkIdArrayArgumentType(ids);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (ids.length === 0) {
      return Promise.resolve(0);
    }
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch('/city/batch', ids).then((result) => {
      logger.info('Successfully restore batch deleted City.');
      logger.debug('Batch restored City count:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`City`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.XML;
    return http.download('/city/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the City to XML:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`City`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.JSON;
    return http.download('/city/export/json', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the City to JSON:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`City`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.EXCEL;
    return http.download('/city/export/excel', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the City to Excel:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`City`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `provinceId: string|number|bigint` 所属省份的ID；
   *  - `provinceCode: string` 所属省份的编码；
   *  - `provinceName: string` 所属省份的名称中应包含的字符串；
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, CITY_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, City);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.CSV;
    return http.download('/city/export/csv', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the City to CSV:', result);
      return result;
    });
  }

  /**
   * 从XML文件导入`City`对象。
   *
   * @param {File|Blob} file
   *     上传的文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showUploading();
    }
    const formData = new FormData();
    formData.append('file', file);
    const params = {};
    if (parallel !== null) {
      params.parallel = parallel;
    }
    if (threads !== null) {
      params.threads = threads;
    }
    return http.post('/city/import/xml', formData, { params }).then((count) => {
      logger.info('Successfully import City from XML, count:', count);
      return count;
    });
  }

  /**
   * 从JSON文件导入`City`对象。
   *
   * @param {File|Blob} file
   *     上传的文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showUploading();
    }
    const formData = new FormData();
    formData.append('file', file);
    const params = {};
    if (parallel !== null) {
      params.parallel = parallel;
    }
    if (threads !== null) {
      params.threads = threads;
    }
    return http.post('/city/import/json', formData, { params }).then((count) => {
      logger.info('Successfully import City from JSON, count:', count);
      return count;
    });
  }

  /**
   * 从Excel文件导入`City`对象。
   *
   * @param {File|Blob} file
   *     上传的文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showUploading();
    }
    const formData = new FormData();
    formData.append('file', file);
    const params = {};
    if (parallel !== null) {
      params.parallel = parallel;
    }
    if (threads !== null) {
      params.threads = threads;
    }
    return http.post('/city/import/excel', formData, { params }).then((count) => {
      logger.info('Successfully import City from Excel, count:', count);
      return count;
    });
  }

  /**
   * 从CSV文件导入`City`对象。
   *
   * @param {File|Blob} file
   *     上传的文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回导入的对象的数量；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showUploading();
    }
    const formData = new FormData();
    formData.append('file', file);
    const params = {};
    if (parallel !== null) {
      params.parallel = parallel;
    }
    if (threads !== null) {
      params.threads = threads;
    }
    return http.post('/city/import/csv', formData, { params }).then((count) => {
      logger.info('Successfully import City from CSV, count:', count);
      return count;
    });
  }
}

const cityApi = new CityApi();

export default cityApi;
