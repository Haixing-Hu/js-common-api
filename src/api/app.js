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
  App,
  CommonMimeType,
  InfoWithEntity,
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

const logger = Logger.getLogger('AppApi');

/**
 * 提供管理`App`对象的API。
 *
 * @author 胡海星
 */
class AppApi {
  /**
   * 列出符合条件的`App`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationName: string` 所属机构的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
   *  - `lastAuthorizeTimeStart: string` 最后一次认证时间范围的（闭区间）起始值；
   *  - `lastAuthorizeTimeEnd: string` 最后一次认证时间范围的（闭区间）结束值；
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
   * @return {Promise<Page<App>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`App`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, App);
    checkSortRequestArgument(sortRequest, App);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/app', {
      params,
    }).then((obj) => {
      const page = App.createPage(obj, assignOptions);
      logger.info('Successfully list the App.');
      logger.debug('The page of App is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`App`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationName: string` 所属机构的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
   *  - `lastAuthorizeTimeStart: string` 最后一次认证时间范围的（闭区间）起始值；
   *  - `lastAuthorizeTimeEnd: string` 最后一次认证时间范围的（闭区间）结束值；
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
   *     件的`App`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, App);
    checkSortRequestArgument(sortRequest, App);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/app/info', {
      params,
    }).then((obj) => {
      const page = StatefulInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of App.');
      logger.debug('The page of infos of App is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`App`对象。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<App|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/app/${stringifyId(id)}`).then((obj) => {
      const result = App.create(obj, assignOptions);
      logger.info('Successfully get the App by ID:', id);
      logger.debug('The App is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`App`对象。
   *
   * @param {string} code
   *     `App`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<App|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/app/code/${code}`).then((obj) => {
      const result = App.create(obj, assignOptions);
      logger.info('Successfully get the App by code:', code);
      logger.debug('The App is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`App`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
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
    return http.get(`/app/${stringifyId(id)}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the App by ID:', id);
      logger.debug('The info of the App is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`App`对象的基本信息。
   *
   * @param {string} code
   *     `App`对象的编码。
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
    return http.get(`/app/code/${code}/info`).then((obj) => {
      const result = StatefulInfo.create(obj, assignOptions);
      logger.info('Successfully get the info of the App by code:', code);
      logger.debug('The info of the App is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`App`对象所属分类的基本信息。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象
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
    return http.get(`/app/${stringifyId(id)}/category`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the category of the App by ID:', id);
      logger.debug('The category of the App is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`App`对象所属分类的基本信息。
   *
   * @param {string} code
   *     `App`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象
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
    return http.get(`/app/code/${code}/category`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the category of the App by code:', code);
      logger.debug('The category of the App is:', result);
      return result;
    });
  }

  /**
   * 添加一个`App`对象。
   *
   * @param {App|object} app
   *     要添加的`App`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<App|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(app, showLoading = true) {
    checkArgumentType('app', app, [App, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(app, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/app', data).then((obj) => {
      const result = App.create(obj, assignOptions);
      logger.info('Successfully add the App:', result.id);
      logger.debug('The added App is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`App`对象。
   *
   * @param {App|object} app
   *     要更新的`App`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<App|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(app, showLoading = true) {
    checkArgumentType('app', app, [App, Object]);
    checkIdArgumentType(app.id, 'app.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(app.id);
    const data = toJSON(app, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/app/${id}`, data).then((obj) => {
      const result = App.create(obj, assignOptions);
      logger.info('Successfully update the App by ID %s at:', id, result.modifyTime);
      logger.debug('The updated App is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`App`对象。
   *
   * @param {App} app
   *     要更新的`App`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<App|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(app, showLoading = true) {
    checkArgumentType('app', app, App);
    checkArgumentType('app.code', app.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(app, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/app/code/${app.code}`, data).then((obj) => {
      const result = App.create(obj, assignOptions);
      logger.info('Successfully update the App by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated App is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`App`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
   * @param {State|string} state
   *     要更新的`App`对象的状态，必须是`State`枚举类型或表示其值的字符串。
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
    return http.put(`/app/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`App`对象的状态。
   *
   * @param {string} code
   *     要更新的`App`对象的编码。
   * @param {State|string} state
   *     要更新的`App`对象的状态，必须是`State`枚举类型或表示其值的字符串。
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
    return http.put(`/app/code/${code}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the App by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`App`对象。
   *
   * @param {string} id
   *     要标记删除的`App`对象的ID。
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
    return http.delete(`/app/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`App`对象。
   *
   * @param {string} code
   *     要标记删除的`App`对象的编码。
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
    return http.delete(`/app/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the App by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`App`对象。
   *
   * @param {string} id
   *     要恢复的`App`对象的ID，该对象必须已经被标记删除。
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
    return http.patch(`/app/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the App by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`App`对象。
   *
   * @param {string} code
   *     要恢复的`App`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/app/code/${code}`)
      .then(() => logger.info('Successfully restore the App by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`App`对象。
   *
   * @param {string} id
   *     要清除的`App`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/app/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the App by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`App`对象。
   *
   * @param {string} code
   *     要清除的`App`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/app/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the App by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`App`对象。
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
    return http.delete('/app/purge')
      .then(() => logger.info('Successfully purge all deleted App.'));
  }

  /**
   * 导出符合条件的`App`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `organizationId: string|number|bigint` 所属机构的ID；
   *  - `organizationName: string` 所属机构的名称包含的字符串；
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `state: State|string` 状态；
   *  - `lastAuthorizeTimeStart: string` 最后一次认证时间范围的（闭区间）起始值；
   *  - `lastAuthorizeTimeEnd: string` 最后一次认证时间范围的（闭区间）结束值；
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
    checkCriteriaArgument(criteria, App);
    checkSortRequestArgument(sortRequest, App);
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
    return http.download('/app/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the App to XML:', result);
      return result;
    });
  }
}

const appApi = new AppApi();

export default appApi;
