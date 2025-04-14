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
  Street,
  Info,
  CommonMimeType,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkObjectArgument from '../utils/check-object-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('StreetApi');

/**
 * Street 类的查询条件定义
 *
 * @type {Array<Object>}
 */
const STREET_CRITERIA_DEFINITIONS = [
  // 所属区县的ID
  { name: 'districtId', type: [String, Number, BigInt] },
  // 所属区县的编码
  { name: 'districtCode', type: String },
  // 所属区县的名称中应包含的字符串
  { name: 'districtName', type: String },
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
 * 提供管理`Street`对象的API。
 *
 * @author 胡海星
 */
class StreetApi {
  /**
   * 列出符合条件的`Street`对象。
   *
   * @param {PageRequest|object} pageRequest
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Street>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, STREET_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Street);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
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
   * @param {PageRequest|object} pageRequest
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
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Info>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Street`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, STREET_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Street);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/street/info', {
      params,
    }).then((obj) => {
      const page = Info.createPage(obj, assignOptions);
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/street/${stringifyId(id)}`).then((obj) => {
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
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
   * @param {Street|object} street
   *     要添加的`Street`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(street, showLoading = true) {
    checkArgumentType('street', street, [Street, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(street, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
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
   * @param {Street|object} street
   *     要更新的`Street`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(street, showLoading = true) {
    checkArgumentType('street', street, [Street, Object]);
    checkIdArgumentType(street.id, 'street.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(street, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
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
   * @param {Street|object} street
   *     要更新的`Street`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Street|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Street`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(street, showLoading = true) {
    checkArgumentType('street', street, [Street, Object]);
    checkArgumentType('street.code', street.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(street, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
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
    return http.patch(`/street/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Street by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要恢复的`Street`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/street/code/${code}`)
      .then(() => logger.info('Successfully restore the Street by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Street`对象。
   *
   * @param {string} id
   *     要清除的`Street`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/street/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Street by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Street`对象。
   *
   * @param {string} code
   *     要清除的`Street`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/street/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Street by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Street`对象。
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
    return http.delete('/street/purge')
      .then(() => logger.info('Successfully purge all deleted Street.'));
  }

  /**
   * 导出符合条件的`Street`对象为XML文件。
   *
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
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkObjectArgument('criteria', criteria, STREET_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Street);
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
    return http.download('/street/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Street to XML:', result);
      return result;
    });
  }
}

const streetApi = new StreetApi();

export default streetApi;
