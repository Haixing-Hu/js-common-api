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
  Person,
  PersonInfo,
  Page,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('PersonApi');

/**
 * 提供管理`Person`对象的API。
 *
 * @author 胡海星
 */
class PersonApi {
  /**
   * 列出符合条件的`Person`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 姓名中应包含的字符串；
   *     - `username: string` 对应的用户的用户名；
   *     - `gender: Gender|string` 性别；
   *     - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *     - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *     - `credentialType: CredentialType|string` 证件类型；
   *     - `credentialNumber: string` 证件号码；
   *     - `hasMedicare: boolean` 是否有医保；
   *     - `medicareType: MedicareType|string` 医保类型；
   *     - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *     - `medicareCityCode: string` 医保所在城市的编码；
   *     - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *     - `hasSocialSecurity: boolean` 是否有社保；
   *     - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *     - `socialSecurityCityCode: string` 社保所在城市的编码；
   *     - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *     - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *     - `sourceCode: string` 数据来源渠道的编码；
   *     - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `phone: string` 座机号码；
   *     - `mobile: string` 手机号码；
   *     - `email: string` 电子邮件地址中应包含的字符串；
   *     - `guardianId: string|number|bigint` 监护人的ID；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationCode: string` 所属机构的编码；
   *     - `organizationName: string` 所属机构名称中应包含的字符串；
   *     - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<Person>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/person', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = Person.createArray(page.content, assignOptions);
      logger.info('Successfully list the Person.');
      logger.debug('The page of Person is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Person`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 姓名中应包含的字符串；
   *     - `username: string` 对应的用户的用户名；
   *     - `gender: Gender|string` 性别；
   *     - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *     - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *     - `credentialType: CredentialType|string` 证件类型；
   *     - `credentialNumber: string` 证件号码；
   *     - `hasMedicare: boolean` 是否有医保；
   *     - `medicareType: MedicareType|string` 医保类型；
   *     - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *     - `medicareCityCode: string` 医保所在城市的编码；
   *     - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *     - `hasSocialSecurity: boolean` 是否有社保；
   *     - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *     - `socialSecurityCityCode: string` 社保所在城市的编码；
   *     - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *     - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *     - `sourceCode: string` 数据来源渠道的编码；
   *     - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `phone: string` 座机号码；
   *     - `mobile: string` 手机号码；
   *     - `email: string` 电子邮件地址中应包含的字符串；
   *     - `guardianId: string|number|bigint` 监护人的ID；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationCode: string` 所属机构的编码；
   *     - `organizationName: string` 所属机构名称中应包含的字符串；
   *     - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<PersonInfo>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/person/info', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = PersonInfo.createArray(page.content, assignOptions);
      logger.info('Successfully list the infos of Person.');
      logger.debug('The page of infos of Person is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Person`对象。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @return {Promise<Person>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/person/${stringifyId(id)}`).then((data) => {
      const person = Person.create(data, assignOptions);
      logger.info('Successfully get the Person by ID:', id);
      logger.debug('The Person is:', person);
      return person;
    });
  }

  /**
   * 获取指定的`Person`对象。
   *
   * @param {string} username
   *     `Person`对象对应的用户的用户名。
   * @return {Promise<Person>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByUsername(username) {
    checkArgumentType('username', username, String);
    loading.showGetting();
    return http.get(`/person/username/${username}`).then((data) => {
      const person = Person.create(data, assignOptions);
      logger.info('Successfully get the Person by username:', username);
      logger.debug('The Person is:', person);
      return person;
    });
  }

  /**
   * 获取指定的`Person`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @return {Promise<PersonInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/person/${stringifyId(id)}/info`).then((data) => {
      const info = PersonInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the Person by ID:', id);
      logger.debug('The info of the Person is:', info);
      return info;
    });
  }

  /**
   * 获取指定的`Person`对象的基本信息。
   *
   * @param {string} username
   *     `Person`对象对应的用户的用户名。
   * @return {Promise<PersonInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByUsername(username) {
    checkArgumentType('username', username, String);
    loading.showGetting();
    return http.get(`/person/username/${username}/info`).then((data) => {
      const info = PersonInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the Person by username:', username);
      logger.debug('The info of the Person is:', info);
      return info;
    });
  }

  /**
   * 添加一个`Person`对象。
   *
   * @param {Person} person
   *     要添加的`Person`对象。
   * @return {Promise<Person>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(person) {
    checkArgumentType('person', person, Person);
    const data = toJSON(person, toJsonOptions);
    loading.showAdding();
    return http.post('/person', data).then((data) => {
      const person = Person.create(data, assignOptions);
      logger.info('Successfully add the Person:', person.id);
      logger.debug('The added Person is:', person);
      return person;
    });
  }

  /**
   * 根据ID，更新一个`Person`对象。
   *
   * @param {Person} person
   *     要更新的`Person`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Person>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(person) {
    checkArgumentType('person', person, Person);
    const data = toJSON(person, toJsonOptions);
    loading.showUpdating();
    return http.put(`/person/${stringifyId(person.id)}`, data).then((data) => {
      const person = Person.create(data, assignOptions);
      logger.info('Successfully update the Person by ID %s at:', person.id, person.modifyTime);
      logger.debug('The updated Person is:', person);
      return person;
    });
  }

  /**
   * 根据ID，标记删除一个`Person`对象。
   *
   * @param {string} id
   *     要标记删除的`Person`对象的ID。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/person/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Person by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要恢复的`Person`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/person/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Person by ID:', id));
  }

  /**
   * 根据ID，清除一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要清除的`Person`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/person/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Person by ID:', id));
  }

  /**
   * 根彻底清除全部已被标记删除的`Person`对象。
   *
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/person/purge')
      .then(() => logger.info('Successfully purge all deleted Person.'));
  }
}

const personApi = new PersonApi();

export default personApi;
