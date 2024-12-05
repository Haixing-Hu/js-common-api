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
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
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
   *  - `countryId: string|number|bigint` 所属国家的ID；
   *  - `countryCode: string` 所属国家的编码；
   *  - `countryName: string` 所属国家的名称中应包含的字符串；
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
   * @return {Promise<Page<Province>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Province`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Province);
    checkSortRequestArgument(sortRequest, Province);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/province', {
      params,
    }).then((obj) => {
      const page = Province.createPage(obj, assignOptions);
      logger.info('Successfully list the Province.');
      logger.debug('The page of Province is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Province`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `countryId: string|number|bigint` 所属国家的ID；
   *  - `countryCode: string` 所属国家的编码；
   *  - `countryName: string` 所属国家的名称中应包含的字符串；
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
   *     件的`Province`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Province);
    checkSortRequestArgument(sortRequest, Province);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/province/info', {
      params,
    }).then((obj) => {
      const page = Info.createPage(obj);
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Province|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/province/${stringifyId(id)}}`).then((obj) => {
      const result = Province.create(obj, assignOptions);
      logger.info('Successfully get the Province by ID:', id);
      logger.debug('The Province is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Province`对象。
   *
   * @param {string} code
   *     `Province`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Province|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/province/code/${code}`).then((obj) => {
      const result = Province.create(obj, assignOptions);
      logger.info('Successfully get the Province by code:', code);
      logger.debug('The Province is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Province`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Province`对象的ID。
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
    return http.get(`/province/${stringifyId(id)}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the Province by ID:', id);
      logger.debug('The info of the Province is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Province`对象的基本信息。
   *
   * @param {string} code
   *     `Province`对象的编码。
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
    return http.get(`/province/code/${code}/info`).then((obj) => {
      const result = Info.create(obj, assignOptions);
      logger.info('Successfully get the info of the Province by code:', code);
      logger.debug('The info of the Province is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Province`对象。
   *
   * @param {Province|object} province
   *     要添加的`Province`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Province|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(province, showLoading = true) {
    checkArgumentType('province', province, [Province, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(province, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/province', data).then((obj) => {
      const result = Province.create(obj, assignOptions);
      logger.info('Successfully add the Province:', result.id);
      logger.debug('The added Province is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Province`对象。
   *
   * @param {Province|object} province
   *     要更新的`Province`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Province|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(province, showLoading = true) {
    checkArgumentType('province', province, [Province, Object]);
    checkIdArgumentType(province.id, 'province.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(province.id);
    const data = toJSON(province, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/province/${id}`, data).then((obj) => {
      const result = Province.create(obj, assignOptions);
      logger.info('Successfully update the Province by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Province is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Province`对象。
   *
   * @param {Province|object} province
   *     要更新的`Province`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Province|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Province`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(province, showLoading = true) {
    checkArgumentType('province', province, [Province, Object]);
    checkArgumentType('province.code', province.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(province, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/province/code/${province.code}`, data).then((obj) => {
      const result = Province.create(obj, assignOptions);
      logger.info('Successfully update the Province by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Province is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`Province`对象。
   *
   * @param {string} id
   *     要标记删除的`Province`对象的ID。
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
    return http.patch(`/province/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Province by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Province`对象。
   *
   * @param {string} code
   *     要恢复的`Province`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/province/code/${code}`)
      .then(() => logger.info('Successfully restore the Province by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Province`对象。
   *
   * @param {string} id
   *     要清除的`Province`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/province/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Province by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Province`对象。
   *
   * @param {string} code
   *     要清除的`Province`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/province/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Province by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Province`对象。
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
    return http.delete('/province/purge')
      .then(() => logger.info('Successfully purge all deleted Province.'));
  }
}

const provinceApi = new ProvinceApi();

export default provinceApi;
