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
  Employee,
  EmployeeInfo,
  PageRequest,
  State,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('EmployeeApi');

/**
 * 提供管理`Employee`对象的API。
 *
 * @author 胡海星
 */
class EmployeeApi {
  /**
   * 列出符合条件的`Employee`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *
   *     - `username: string` 对应的用户的用户名；
   *     - `personId: string|number|bigint` 对应的个人信息的ID；
   *     - `internalCode: string` 内部编码中应包含的字符串；
   *     - `name: string` 姓名中应包含的字符串；
   *     - `gender: Gender|string` 性别；
   *     - `credentialType: CredentialType|string` 证件类型；
   *     - `credentialNumber: string` 证件号码；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationCode: string` 所属机构的编码；
   *     - `organizationName: string` 所属机构名称中应包含的字符串；
   *     - `departmentId: string|number|bigint` 所属部门的ID；
   *     - `departmentCode: string` 所属部门的编码；
   *     - `departmentName: string` 所属部门名称中应包含的字符串；
   *     - `phone: string` 座机号码；
   *     - `mobile: string` 手机号码；
   *     - `email: string` 电子邮件地址中应包含的字符串；
   *     - `jobTitle: string` 职称中应包含的字符串；
   *     - `state: State|string` 状态；
   *     - `test: boolean` 是否是测试数据；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Employee>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Employee`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/employee', {
      params,
    }).then((obj) => {
      const page = Employee.createPage(obj, assignOptions);
      logger.info('Successfully list the Employee.');
      logger.debug('The page of Employee is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Employee`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *
   *     - `username: string` 对应的用户的用户名；
   *     - `personId: string|number|bigint` 对应的个人信息的ID；
   *     - `internalCode: string` 内部编码中应包含的字符串；
   *     - `name: string` 姓名中应包含的字符串；
   *     - `gender: Gender|string` 性别；
   *     - `credentialType: CredentialType|string` 证件类型；
   *     - `credentialNumber: string` 证件号码；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationCode: string` 所属机构的编码；
   *     - `organizationName: string` 所属机构名称中应包含的字符串；
   *     - `departmentId: string|number|bigint` 所属部门的ID；
   *     - `departmentCode: string` 所属部门的编码；
   *     - `departmentName: string` 所属部门名称中应包含的字符串；
   *     - `phone: string` 座机号码；
   *     - `mobile: string` 手机号码；
   *     - `email: string` 电子邮件地址中应包含的字符串；
   *     - `jobTitle: string` 职称中应包含的字符串；
   *     - `state: State|string` 状态；
   *     - `test: boolean` 是否是测试数据；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<EmployeeInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Employee`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/employee/info', {
      params,
    }).then((obj) => {
      const page = EmployeeInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of Employee.');
      logger.debug('The page of infos of Employee is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Employee`对象。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/employee/${stringifyId(id)}`).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully get the Employee by ID:', id);
      logger.debug('The Employee is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Employee`对象。
   *
   * @param {string} code
   *     `Employee`对象的编码。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/employee/code/${code}`).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully get the Employee by code:', code);
      logger.debug('The Employee is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Employee`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`EmployeeInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/employee/${stringifyId(id)}/info`).then((obj) => {
      const result = EmployeeInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Employee by ID:', id);
      logger.debug('The info of the Employee is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Employee`对象的基本信息。
   *
   * @param {string} code
   *     `Employee`对象的编码。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`EmployeeInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/employee/code/${code}/info`).then((obj) => {
      const result = EmployeeInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Employee by code:', code);
      logger.debug('The info of the Employee is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Employee`对象。
   *
   * @param {Employee} employee
   *     要添加的`Employee`对象。
   * @param {boolean} withUser
   *     是否同时添加新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(employee, withUser = false) {
    checkArgumentType('employee', employee, Employee);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(employee, toJsonOptions);
    loading.showAdding();
    return http.post('/employee', data, { params }).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully add the Employee:', result.id);
      logger.debug('The added Employee is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Employee`对象。
   *
   * @param {Employee} employee
   *     要更新的`Employee`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(employee, withUser = false) {
    checkArgumentType('employee', employee, Employee);
    checkArgumentType('withUser', withUser, Boolean);
    const id = stringifyId(employee.id);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(employee, toJsonOptions);
    loading.showUpdating();
    return http.put(`/employee/${id}`, data, { params }).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully update the Employee by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Employee is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Employee`对象。
   *
   * @param {Employee} employee
   *     要更新的`Employee`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @return {Promise<Employee|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Employee`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(employee, withUser = false) {
    checkArgumentType('employee', employee, Employee);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(employee, toJsonOptions);
    loading.showUpdating();
    return http.put(`/employee/code/${employee.code}`, data, { params }).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully update the Employee by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Employee is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Employee`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Employee`对象的ID。
   * @param {State|string} state
   *     要更新的`Employee`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`的状态。默认值为`false`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, withUser = false) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('state', state, [State, String]);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/employee/${stringifyId(id)}/state`, data, { params }).then((timestamp) => {
      logger.info('Successfully update the state of the Employee by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`Employee`对象的状态。
   *
   * @param {string} code
   *     要更新的`Employee`对象的编码。
   * @param {State|string} state
   *     要更新的`Employee`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} withUser
   *     是否同时更新`Employee`对象所绑定的用户对象`User`的状态。默认值为`false`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, withUser = false) {
    checkArgumentType('code', code, String);
    checkArgumentType('state', state, [State, String]);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/employee/code/${code}/state`, data, { params }).then((timestamp) => {
      logger.info('Successfully update the state of the Employee by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Employee`对象。
   *
   * @param {string} id
   *     要标记删除的`Employee`对象的ID。
   * @param {boolean} withUser
   *     是否同时标记删除`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, withUser = false) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showDeleting();
    return http.delete(`/employee/${stringifyId(id)}`, { params }).then((timestamp) => {
      logger.info('Successfully delete the Employee by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Employee`对象。
   *
   * @param {string} code
   *     要标记删除的`Employee`对象的编码。
   * @param {boolean} withUser
   *     是否同时标记删除`Employee`对象所绑定的用户对象`User`。默认值为`false`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, withUser = false) {
    checkArgumentType('code', code, String);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showDeleting();
    return http.delete(`/employee/code/${code}`, { params }).then((timestamp) => {
      logger.info('Successfully delete the Employee by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Employee`对象。
   *
   * @param {string} id
   *     要恢复的`Employee`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, withUser = false) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showRestoring();
    return http.patch(`/employee/${stringifyId(id)}`, undefined, { params })
      .then(() => logger.info('Successfully restore the Employee by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Employee`对象。
   *
   * @param {string} code
   *     要恢复的`Employee`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, withUser = false) {
    checkArgumentType('code', code, String);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showRestoring();
    return http.patch(`/employee/code/${code}`, undefined, { params })
      .then(() => logger.info('Successfully restore the Employee by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Employee`对象。
   *
   * @param {string} id
   *     要清除的`Employee`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, withUser = false) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showPurging();
    return http.delete(`/employee/${stringifyId(id)}/purge`, { params })
      .then(() => logger.info('Successfully purge the Employee by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Employee`对象。
   *
   * @param {string} code
   *     要清除的`Employee`对象的编码，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Employee`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, withUser = false) {
    checkArgumentType('code', code, String);
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showPurging();
    return http.delete(`/employee/code/${code}/purge`, { params })
      .then(() => logger.info('Successfully purge the Employee by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Employee`对象。
   *
   * @param {boolean} withUser
   *     是否同时彻底清除所有已被标记删除的`Employee`对象所绑定的已被标记标记删除的用户对象`User`。
   *     若某个已被标记删除的`Employee`对象未绑定`User`对象，或其绑定的`User`对象未被标记
   *     删除，则不对该`User`对象做操作。此参数默认值为`false`。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(withUser = false) {
    checkArgumentType('withUser', withUser, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    loading.showPurging();
    return http.delete('/employee/purge', { params })
      .then(() => logger.info('Successfully purge all deleted Employee.'));
  }
}

const employeeApi = new EmployeeApi();

export default employeeApi;
