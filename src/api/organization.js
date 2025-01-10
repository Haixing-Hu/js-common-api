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
  Organization,
  CommonMimeType,
  State,
  StatefulInfo,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('OrganizationApi');

/**
 * 提供管理`Organization`对象的API。
 *
 * @author 胡海星
 */
class OrganizationApi {
  /**
   * 列出符合条件的`Organization`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父机构的ID；
   *  - `parentCode: string` 所属父机构的编码；
   *  - `parentName: string` 所属父机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<Organization>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Organization`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Organization);
    checkSortRequestArgument(sortRequest, Organization);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/organization', {
      params,
    }).then((obj) => {
      const page = Organization.createPage(obj, assignOptions);
      logger.info('Successfully list the Organization.');
      logger.debug('The page of Organization is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Organization`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父机构的ID；
   *  - `parentCode: string` 所属父机构的编码；
   *  - `parentName: string` 所属父机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<StatefulInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Organization`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Organization);
    checkSortRequestArgument(sortRequest, Organization);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/organization/info', {
      params,
    }).then((obj) => {
      const page = StatefulInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of Organization.');
      logger.debug('The page of infos of Organization is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Organization`对象。
   *
   * @param {string|number|bigint} id
   *     `Organization`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Organization|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Organization`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/organization/${stringifyId(id)}`).then((obj) => {
      const result = Organization.create(obj, assignOptions);
      logger.info('Successfully get the Organization by ID:', id);
      logger.debug('The Organization is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Organization`对象。
   *
   * @param {string} code
   *     `Organization`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Organization|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Organization`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/organization/code/${code}`).then((obj) => {
      const result = Organization.create(obj, assignOptions);
      logger.info('Successfully get the Organization by code:', code);
      logger.debug('The Organization is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Organization`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Organization`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/organization/${stringifyId(id)}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Organization by ID:', id);
      logger.debug('The info of the Organization is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Organization`对象的基本信息。
   *
   * @param {string} code
   *     `Organization`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<StatefulInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/organization/code/${code}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Organization by code:', code);
      logger.debug('The info of the Organization is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Organization`对象。
   *
   * @param {Organization|object} organization
   *     要添加的`Organization`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Organization|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Organization`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(organization, showLoading = true) {
    checkArgumentType('organization', organization, [Organization, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(organization, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/organization', data).then((obj) => {
      const result = Organization.create(obj, assignOptions);
      logger.info('Successfully add the Organization:', result.id);
      logger.debug('The added Organization is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Organization`对象。
   *
   * @param {Organization|object} organization
   *     要更新的`Organization`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Organization|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Organization`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(organization, showLoading = true) {
    checkArgumentType('organization', organization, [Organization, Object]);
    checkIdArgumentType(organization.id, 'organization.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(organization.id);
    const data = toJSON(organization, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/organization/${id}`, data).then((obj) => {
      const result = Organization.create(obj, assignOptions);
      logger.info('Successfully update the Organization by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Organization is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Organization`对象。
   *
   * @param {Organization|object} organization
   *     要更新的`Organization`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Organization|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Organization`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(organization, showLoading = true) {
    checkArgumentType('organization', organization, [Organization, Object]);
    checkArgumentType('organization.code', organization.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(organization, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/organization/code/${organization.code}`, data).then((obj) => {
      const result = Organization.create(obj, assignOptions);
      logger.info('Successfully update the Organization by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Organization is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Organization`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Organization`对象的ID。
   * @param {State|string} state
   *     要更新的`Organization`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('state', state, [State, String]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = { state: String(state) };
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/organization/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Organization by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`Organization`对象的状态。
   *
   * @param {string} code
   *     要更新的`Organization`对象的编码。
   * @param {State|string} state
   *     要更新的`Organization`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('state', state, [State, String]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = { state: String(state) };
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/organization/code/${code}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Organization by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Organization`对象。
   *
   * @param {string} id
   *     要标记删除的`Organization`对象的ID。
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
    return http.delete(`/organization/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Organization by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Organization`对象。
   *
   * @param {string} code
   *     要标记删除的`Organization`对象的编码。
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
    return http.delete(`/organization/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Organization by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Organization`对象。
   *
   * @param {string} id
   *     要恢复的`Organization`对象的ID，该对象必须已经被标记删除。
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
    return http.patch(`/organization/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Organization by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Organization`对象。
   *
   * @param {string} code
   *     要恢复的`Organization`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/organization/code/${code}`)
      .then(() => logger.info('Successfully restore the Organization by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Organization`对象。
   *
   * @param {string} id
   *     要清除的`Organization`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/organization/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Organization by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Organization`对象。
   *
   * @param {string} code
   *     要清除的`Organization`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/organization/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Organization by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Organization`对象。
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
    return http.delete('/organization/purge')
      .then(() => logger.info('Successfully purge all deleted Organization.'));
  }

  /**
   * 导出符合条件的`Organization`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父机构的ID；
   *  - `parentCode: string` 所属父机构的编码；
   *  - `parentName: string` 所属父机构名称中应包含的字符串；
   *  - `countryId: string|number|bigint` 所在国家的ID；
   *  - `countryCode: string` 所在国家的编码；
   *  - `countryName: string` 所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 所在省份的ID；
   *  - `provinceCode: string` 所在省份的编码；
   *  - `provinceName: string` 所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 所在城市的ID；
   *  - `cityCode: string` 所在城市的编码；
   *  - `cityName: string` 所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 所在区县的ID；
   *  - `districtCode: string` 所在区县的编码；
   *  - `districtName: string` 所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 所在街道的ID；
   *  - `streetCode: string` 所在街道的编码；
   *  - `streetName: string` 所在街道的名称中应包含的字符串；
   *  - `postalcode: string` 邮政编码；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `state: State|string` 状态；
   *  - `test: boolean` 是否是测试数据；
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
    checkCriteriaArgument(criteria, Organization);
    checkSortRequestArgument(sortRequest, Organization);
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
    return http.download('/organization/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Organization to XML:', result);
      return result;
    });
  }
}

const organizationApi = new OrganizationApi();

export default organizationApi;
