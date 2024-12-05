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
  City,
  Info,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('CityApi');

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
   * @param {object} sort
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
  list(pageRequest = {}, criteria = {}, sort = {}, showLoading = true) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
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
   * @param {object} sort
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
  listInfo(pageRequest = {}, criteria = {}, sort = {}, showLoading = true) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/city/info', {
      params,
    }).then((obj) => {
      const page = Info.createPage(obj);
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
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/city/${stringifyId(id)}}`).then((obj) => {
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
    checkArgumentType('id', id, [String, Number, BigInt]);
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
    checkArgumentType('city.id', city.id, [String, Number, BigInt]);
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
    checkArgumentType('id', id, [String, Number, BigInt]);
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
    checkArgumentType('id', id, [String, Number, BigInt]);
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
    checkArgumentType('id', id, [String, Number, BigInt]);
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
}

const cityApi = new CityApi();

export default cityApi;
