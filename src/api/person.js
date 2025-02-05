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
  Attachment,
  Contact,
  CommonMimeType,
  InfoWithEntity,
  Person,
  PersonInfo,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
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
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `username: string` 对应的用户的用户名；
   *  - `gender: Gender|string` 性别；
   *  - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *  - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `hasMedicare: boolean` 是否有医保；
   *  - `medicareType: MedicareType|string` 医保类型；
   *  - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *  - `medicareCityCode: string` 医保所在城市的编码；
   *  - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *  - `hasSocialSecurity: boolean` 是否有社保；
   *  - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *  - `socialSecurityCityCode: string` 社保所在城市的编码；
   *  - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *  - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *  - `sourceCode: string` 数据来源渠道的编码；
   *  - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `guardianId: string|number|bigint` 监护人的ID；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `test: boolean` 是否是测试数据；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - sortField: string 用于排序的属性名称（CamelCase形式）；
   *  - sortOrder: SortOrder 指定是正序还是倒序。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Person>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Person);
    checkSortRequestArgument(sortRequest, Person);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/person', {
      params,
    }).then((obj) => {
      const page = Person.createPage(obj, assignOptions);
      logger.info('Successfully list the Person.');
      logger.debug('The page of Person is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Person`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `username: string` 对应的用户的用户名；
   *  - `gender: Gender|string` 性别；
   *  - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *  - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `hasMedicare: boolean` 是否有医保；
   *  - `medicareType: MedicareType|string` 医保类型；
   *  - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *  - `medicareCityCode: string` 医保所在城市的编码；
   *  - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *  - `hasSocialSecurity: boolean` 是否有社保；
   *  - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *  - `socialSecurityCityCode: string` 社保所在城市的编码；
   *  - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *  - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *  - `sourceCode: string` 数据来源渠道的编码；
   *  - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `guardianId: string|number|bigint` 监护人的ID；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `test: boolean` 是否是测试数据；
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
   * @return {Promise<Page<PersonInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Person`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Person);
    checkSortRequestArgument(sortRequest, Person);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/person/info', {
      params,
    }).then((obj) => {
      const page = PersonInfo.createPage(obj, assignOptions);
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
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/person/${stringifyId(id)}`, { params }).then((obj) => {
      const person = Person.create(obj, assignOptions);
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
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByUsername(username, transformUrls = true, showLoading = true) {
    checkArgumentType('username', username, String);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/person/username/${username}`, { params }).then((obj) => {
      const person = Person.create(obj, assignOptions);
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/person/${stringifyId(id)}/info`).then((obj) => {
      const info = PersonInfo.create(obj, assignOptions);
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`PersonInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByUsername(username, showLoading = true) {
    checkArgumentType('username', username, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/person/username/${username}/info`).then((obj) => {
      const info = PersonInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the Person by username:', username);
      logger.debug('The info of the Person is:', info);
      return info;
    });
  }

  /**
   * 获取指定的`Person`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象
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
    return http.get(`/person/${stringifyId(id)}/category`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the category of the Person by ID:', id);
      logger.debug('The category of the Person is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Person`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Person`对象的照片，
   *     注意若没有照片会返回`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPhoto(id, transformUrls = true, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/person/${stringifyId(id)}/photo`, { params }).then((obj) => {
      const result = Attachment.create(obj, assignOptions);
      logger.info('Successfully get the photo of the Person by ID:', id);
      logger.debug('The photo of the Person is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Person`对象。
   *
   * @param {Person|object} person
   *     要添加的`Person`对象。
   * @param {boolean} withUser
   *     是否同时添加新`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(person, withUser = false, transformUrls = true, showLoading = true) {
    checkArgumentType('person', person, [Person, Object]);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser, transformUrls }, toJsonOptions);
    const data = toJSON(person, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/person', data, { params }).then((obj) => {
      const person = Person.create(obj, assignOptions);
      logger.info('Successfully add the Person:', person.id);
      logger.debug('The added Person is:', person);
      return person;
    });
  }

  /**
   * 根据ID，更新一个`Person`对象。
   *
   * @param {Person|object} person
   *     要更新的`Person`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Person`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(person, withUser = false, showLoading = true) {
    checkArgumentType('person', person, [Person, Object]);
    checkIdArgumentType(person.id, 'person.id');
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(person.id);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(person, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/person/${id}`, data, { params }).then((obj) => {
      const person = Person.create(obj, assignOptions);
      logger.info('Successfully update the Person by ID %s at:', id, person.modifyTime);
      logger.debug('The updated Person is:', person);
      return person;
    });
  }

  /**
   * 根据ID，更新一个`Person`对象的联系方式。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {Contact|object} contact
   *     要更新的`Person`对象的联系方式。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的`User`对象的联系方式。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateContact(id, contact, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('contact', contact, [Contact, Object]);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(contact, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/person/${stringifyId(id)}/contact`, data, { params }).then((timestamp) => {
      logger.info('Successfully update the Contact of a Person by ID "%s" at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Person`对象的备注。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {string} comment
   *     要更新的`Person`对象的备注。
   * @param {boolean} withUser
   *     是否同时更新`Person`对象所绑定的`User`对象的备注。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<String|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回则数据被更新的UTC时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateComment(id, comment, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('comment', comment, String);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    const data = toJSON(comment, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/person/${stringifyId(id)}/comment`, data, { params }).then((timestamp) => {
      logger.info('Successfully update the comment of a Person by ID "%s" at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Person`对象的照片。
   *
   * @param {string|number|bigint} id
   *     `Person`对象的ID。
   * @param {Attachment|object} photo
   *     要更新的`Person`对象的照片，必须先调用`fileApi.update()` 上传文件，并利用返回
   *     的`Upload`对象构造一个`Attachment`对象。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL地址。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Attachment|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`photo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updatePhoto(id, photo, transformUrls = true, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('photo', photo, [Attachment, Object]);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ transformUrls }, toJsonOptions);
    const data = toJSON(photo, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/person/${stringifyId(id)}/photo`, data, { params }).then((obj) => {
      const result = Attachment.create(obj, assignOptions);
      logger.info('Successfully update the photo of the Person by ID:', id);
      logger.debug('The updated photo of the Person is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`Person`对象。
   *
   * @param {string} id
   *     要标记删除的`Person`对象的ID。
   * @param {boolean} withUser
   *     是否同时标记删除`Person`对象所绑定的用户对象`User`。默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete(`/person/${stringifyId(id)}`, { params }).then((timestamp) => {
      logger.info('Successfully delete the Person by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要恢复的`Person`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时恢复`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch(`/person/${stringifyId(id)}`, undefined, { params })
      .then(() => logger.info('Successfully restore the Person by ID:', id));
  }

  /**
   * 根据ID，清除一个被标记删除的`Person`对象。
   *
   * @param {string} id
   *     要清除的`Person`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} withUser
   *     是否同时彻底清除`Person`对象所绑定的已被标记标记删除的用户对象`User`。若指定的
   *     `Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记删除，则不对该`User`
   *     对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, withUser = false, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/person/${stringifyId(id)}/purge`, { params })
      .then(() => logger.info('Successfully purge the Person by ID:', id));
  }

  /**
   * 根彻底清除全部已被标记删除的`Person`对象。
   *
   * @param {boolean} withUser
   *     是否同时彻底清除所有已被标记删除的`Person`对象所绑定的已被标记标记删除的用户对象`User`。
   *     若某个已被标记删除的`Person`对象未绑定`User`对象，或其绑定的`User`对象未被标记
   *     删除，则不对该`User`对象做操作。此参数默认值为`false`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(withUser = false, showLoading = true) {
    checkArgumentType('withUser', withUser, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({ withUser }, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/person/purge', { params })
      .then(() => logger.info('Successfully purge all deleted Person.'));
  }

  /**
   * 导出符合条件的`Person`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 姓名中应包含的字符串；
   *  - `username: string` 对应的用户的用户名；
   *  - `gender: Gender|string` 性别；
   *  - `birthdayStart: string` 生日范围的（闭区间）起始值；
   *  - `birthdayEnd: string` 生日范围的（闭区间）结束值；
   *  - `credentialType: CredentialType|string` 证件类型；
   *  - `credentialNumber: string` 证件号码；
   *  - `hasMedicare: boolean` 是否有医保；
   *  - `medicareType: MedicareType|string` 医保类型；
   *  - `medicareCityId: string|number|bigint` 医保所在城市的ID；
   *  - `medicareCityCode: string` 医保所在城市的编码；
   *  - `medicareCityName: string` 医保所在城市名称中应包含的字符串；
   *  - `hasSocialSecurity: boolean` 是否有社保；
   *  - `socialSecurityCityId: string|number|bigint` 社保所在城市的ID；
   *  - `socialSecurityCityCode: string` 社保所在城市的编码；
   *  - `socialSecurityCityName: string` 社保所在城市名称中应包含的字符串；
   *  - `sourceId: string|number|bigint` 数据来源渠道的ID；
   *  - `sourceCode: string` 数据来源渠道的编码；
   *  - `sourceName: string` 数据来源渠道的名称中应包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `phone: string` 座机号码；
   *  - `mobile: string` 手机号码；
   *  - `email: string` 电子邮件地址中应包含的字符串；
   *  - `guardianId: string|number|bigint` 监护人的ID；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationCode: string` 所属机构的编码；
   *  - `organizationName: string` 所属机构名称中应包含的字符串；
   *  - `test: boolean` 是否是测试数据；
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
    checkCriteriaArgument(criteria, Person);
    checkSortRequestArgument(sortRequest, Person);
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
    return http.download('/person/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Person to XML:', result);
      return result;
    });
  }
}

const personApi = new PersonApi();

export default personApi;
