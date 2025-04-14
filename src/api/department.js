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
  Department,
  CommonMimeType,
  InfoWithEntity,
  State,
  StatefulInfo,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkObjectArgument from '../utils/check-object-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('DepartmentApi');

// 定义 Department 类的查询条件
const DEPARTMENT_CRITERIA_DEFINITIONS = [
  { name: 'internalCode', type: String },
  { name: 'name', type: String },
  { name: 'categoryId', type: [String, Number, BigInt] },
  { name: 'categoryCode', type: String },
  { name: 'categoryName', type: String },
  { name: 'parentId', type: [String, Number, BigInt] },
  { name: 'parentCode', type: String },
  { name: 'parentName', type: String },
  { name: 'organizationId', type: [String, Number, BigInt] },
  { name: 'organizationCode', type: String },
  { name: 'organizationName', type: String },
  { name: 'countryId', type: [String, Number, BigInt] },
  { name: 'countryCode', type: String },
  { name: 'countryName', type: String },
  { name: 'provinceId', type: [String, Number, BigInt] },
  { name: 'provinceCode', type: String },
  { name: 'provinceName', type: String },
  { name: 'cityId', type: [String, Number, BigInt] },
  { name: 'cityCode', type: String },
  { name: 'cityName', type: String },
  { name: 'districtId', type: [String, Number, BigInt] },
  { name: 'districtCode', type: String },
  { name: 'districtName', type: String },
  { name: 'streetId', type: [String, Number, BigInt] },
  { name: 'streetCode', type: String },
  { name: 'streetName', type: String },
  { name: 'postalcode', type: String },
  { name: 'phone', type: String },
  { name: 'mobile', type: String },
  { name: 'email', type: String },
  { name: 'state', type: [State, String] },
  { name: 'test', type: Boolean },
  { name: 'predefined', type: Boolean },
  { name: 'deleted', type: Boolean },
  { name: 'createTimeStart', type: String },
  { name: 'createTimeEnd', type: String },
  { name: 'modifyTimeStart', type: String },
  { name: 'modifyTimeEnd', type: String },
  { name: 'deleteTimeStart', type: String },
  { name: 'deleteTimeEnd', type: String },
];

/**
 * 提供管理`Department`对象的API。
 *
 * @author 胡海星
 */
class DepartmentApi {
  /**
   * 列出符合条件的`Department`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
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
   * @return {Promise<Page<Department>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Department`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, DEPARTMENT_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Department);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/department', {
      params,
    }).then((obj) => {
      const page = Department.createPage(obj, assignOptions);
      logger.info('Successfully list the Department.');
      logger.debug('The page of Department is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Department`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
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
   *     件的`Department`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, DEPARTMENT_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Department);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/department/info', {
      params,
    }).then((obj) => {
      const page = StatefulInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of Department.');
      logger.debug('The page of infos of Department is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Department`对象。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/department/${stringifyId(id)}`).then((obj) => {
      const result = Department.create(obj, assignOptions);
      logger.info('Successfully get the Department by ID:', id);
      logger.debug('The Department is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Department`对象。
   *
   * @param {string} code
   *     `Department`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/department/code/${code}`).then((obj) => {
      const result = Department.create(obj, assignOptions);
      logger.info('Successfully get the Department by code:', code);
      logger.debug('The Department is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Department`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
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
    return http.get(`/department/${stringifyId(id)}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Department by ID:', id);
      logger.debug('The info of the Department is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Department`对象的基本信息。
   *
   * @param {string} code
   *     `Department`对象的编码。
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
    return http.get(`/department/code/${code}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Department by code:', code);
      logger.debug('The info of the Department is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Department`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategory(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/department/${stringifyId(id)}/category`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the category of the Department by ID:', id);
      logger.debug('The category of the Department is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Department`对象所属分类的基本信息。
   *
   * @param {string} code
   *     `Department`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Department`对象
   *     所属分类的基本信息，或`null`若该对象没有所属分类；若操作失败，则解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  getCategoryByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/department/code/${code}/category`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the category of the Department by code:', code);
      logger.debug('The category of the Department is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Department`对象。
   *
   * @param {Department|object} department
   *     要添加的`Department`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(department, showLoading = true) {
    checkArgumentType('department', department, [Department, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(department, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/department', data).then((obj) => {
      const result = Department.create(obj, assignOptions);
      logger.info('Successfully add the Department:', result.id);
      logger.debug('The added Department is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Department`对象。
   *
   * @param {Department|object} department
   *     要更新的`Department`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(department, showLoading = true) {
    checkArgumentType('department', department, [Department, Object]);
    checkIdArgumentType(department.id, 'department.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(department.id);
    const data = toJSON(department, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/department/${id}`, data).then((obj) => {
      const result = Department.create(obj, assignOptions);
      logger.info('Successfully update the Department by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Department is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Department`对象。
   *
   * @param {Department|object} department
   *     要更新的`Department`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Department|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Department`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(department, showLoading = true) {
    checkArgumentType('department', department, [Department, Object]);
    checkArgumentType('department.code', department.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(department, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/department/code/${department.code}`, data).then((obj) => {
      const result = Department.create(obj, assignOptions);
      logger.info('Successfully update the Department by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Department is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Department`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Department`对象的ID。
   * @param {State|string} state
   *     要更新的`Department`对象的状态，必须是`State`枚举类型或表示其值的字符串。
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
    const data = toJSON(state, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/department/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Department by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`Department`对象的状态。
   *
   * @param {string} code
   *     要更新的`Department`对象的编码。
   * @param {State|string} state
   *     要更新的`Department`对象的状态，必须是`State`枚举类型或表示其值的字符串。
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
    const data = toJSON(state, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/department/code/${code}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the Department by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Department`对象。
   *
   * @param {string} id
   *     要标记删除的`Department`对象的ID。
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
    return http.delete(`/department/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Department by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Department`对象。
   *
   * @param {string} code
   *     要标记删除的`Department`对象的编码。
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
    return http.delete(`/department/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Department by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Department`对象。
   *
   * @param {string} id
   *     要恢复的`Department`对象的ID，该对象必须已经被标记删除。
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
    return http.patch(`/department/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Department by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Department`对象。
   *
   * @param {string} code
   *     要恢复的`Department`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/department/code/${code}`)
      .then(() => logger.info('Successfully restore the Department by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Department`对象。
   *
   * @param {string} id
   *     要清除的`Department`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/department/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Department by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Department`对象。
   *
   * @param {string} code
   *     要清除的`Department`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/department/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Department by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Department`对象。
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
    return http.delete('/department/purge')
      .then(() => logger.info('Successfully purge all deleted Department.'));
  }

  /**
   * 导出符合条件的`Department`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `internalCode: string` 内部编码中应包含的字符串；
   *  - `name: string` 名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `parentId: string|number|bigint` 所属父部门的ID；
   *  - `parentCode: string` 所属父部门的编码；
   *  - `parentName: string` 所属父部门名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
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
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkObjectArgument('criteria', criteria, DEPARTMENT_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Department);
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
    return http.download('/department/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Department to XML:', result);
      return result;
    });
  }
}

const departmentApi = new DepartmentApi();

export default departmentApi;
