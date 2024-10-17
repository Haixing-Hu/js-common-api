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
  App,
  Page,
  PageRequest,
  State,
  StatefulInfo,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
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
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationName: string` 所属机构的名称包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `state: string|State` 状态；
   *     - `lastAuthorizeTimeStart: string` 最后一次认证时间范围的（闭区间）起始值；
   *     - `lastAuthorizeTimeEnd: string` 最后一次认证时间范围的（闭区间）结束值；
   *     - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<App>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`App`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/app', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = App.createArray(page.content, assignOptions);
      logger.info('Successfully list the App.');
      logger.debug('The page of App is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`App`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `name: string` 名称中应包含的字符串；
   *     - `organizationId: string|number|bigint` 所属机构的ID；
   *     - `organizationName: string` 所属机构的名称包含的字符串；
   *     - `categoryId: string|number|bigint` 所属类别的ID；
   *     - `categoryCode: string` 所属类别的编码；
   *     - `categoryName: string` 所属类别的名称包含的字符串；
   *     - `state: string|State` 状态；
   *     - `lastAuthorizeTimeStart: string` 最后一次认证时间范围的（闭区间）起始值；
   *     - `lastAuthorizeTimeEnd: string` 最后一次认证时间范围的（闭区间）结束值；
   *     - `predefined: boolean` 是否是预定义数据；
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
   * @return {Promise<Page<StatefulInfo>>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`App`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/app/info', {
      params,
    }).then((data) => {
      const page = Page.create(data, assignOptions);
      page.content = StatefulInfo.createArray(page.content, assignOptions);
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
   * @return {Promise<App>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/app/${stringifyId(id)}`).then((data) => {
      const app = App.create(data, assignOptions);
      logger.info('Successfully get the App by ID:', id);
      logger.debug('The App is:', app);
      return app;
    });
  }

  /**
   * 获取指定的`App`对象。
   *
   * @param {string} code
   *     `App`对象的编码。
   * @return {Promise<App>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/app/code/${code}`).then((data) => {
      const app = App.create(data, assignOptions);
      logger.info('Successfully get the App by code:', code);
      logger.debug('The App is:', app);
      return app;
    });
  }

  /**
   * 获取指定的`App`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
   * @return {Promise<StatefulInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/app/${stringifyId(id)}/info`).then((data) => {
      const info = StatefulInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the App by ID:', id);
      logger.debug('The info of the App is:', info);
      return info;
    });
  }

  /**
   * 获取指定的`App`对象的基本信息。
   *
   * @param {string} code
   *     `App`对象的编码。
   * @return {Promise<StatefulInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`StatefulInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/app/code/${code}/info`).then((data) => {
      const info = StatefulInfo.create(data, assignOptions);
      logger.info('Successfully get the info of the App by code:', code);
      logger.debug('The info of the App is:', info);
      return info;
    });
  }

  /**
   * 添加一个`App`对象。
   *
   * @param {App} app
   *     要添加的`App`对象。
   * @return {Promise<App>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(app) {
    checkArgumentType('app', app, App);
    loading.showAdding();
    return http.post('/app', toJSON(app, toJsonOptions)).then((data) => {
      const app = App.create(data, assignOptions);
      logger.info('Successfully add the App:', app.id);
      logger.debug('The added App is:', app);
      return app;
    });
  }

  /**
   * 根据ID，更新一个`App`对象。
   *
   * @param {App} app
   *     要更新的`App`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<App>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(app) {
    checkArgumentType('app', app, App);
    loading.showUpdating();
    return http.put(`/app/${stringifyId(app.id)}`, toJSON(app, toJsonOptions)).then((data) => {
      const app = App.create(data, assignOptions);
      logger.info('Successfully update the App by ID %s at:', app.id, app.modifyTime);
      logger.debug('The updated App is:', app);
      return app;
    });
  }

  /**
   * 根据编码，更新一个`App`对象。
   *
   * @param {App} app
   *     要更新的`App`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<App>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`App`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(app) {
    checkArgumentType('app', app, App);
    loading.showUpdating();
    return http.put(`/app/code/${app.code}`, toJSON(app, toJsonOptions)).then((data) => {
      const app = App.create(data, assignOptions);
      logger.info('Successfully update the App by code "%s" at:', app.code, app.modifyTime);
      logger.debug('The updated App is:', app);
      return app;
    });
  }

  /**
   * 根据ID，更新一个`App`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `App`对象的ID。
   * @param {State} state
   *     要更新的`App`对象的状态，必须是`State`枚举类型。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('state', state, State);
    loading.showUpdating();
    return http.put(`/app/${stringifyId(id)}/state`, { state: state.value }).then((timestamp) => {
      logger.info('Successfully update the state of the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`App`对象的状态。
   *
   * @param {string} code
   *     要更新的`App`对象的编码。
   * @param {State} state
   *     要更新的`App`对象的状态，必须是`State`枚举类型。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state) {
    checkArgumentType('code', code, String);
    checkArgumentType('state', state, State);
    loading.showUpdating();
    return http.put(`/app/code/${code}/state`, { state: state.value }).then((timestamp) => {
      logger.info('Successfully update the state of the App by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`App`对象。
   *
   * @param {string} id
   *     要标记删除的`App`对象的ID。
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
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
   * @return {Promise<string>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
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
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/app/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the App by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`App`对象。
   *
   * @param {string} code
   *     要恢复的`App`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/app/code/${code}`)
      .then(() => logger.info('Successfully restore the App by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`App`对象。
   *
   * @param {string} id
   *     要清除的`App`对象的ID，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/app/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the App by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`App`对象。
   *
   * @param {string} code
   *     要清除的`App`对象的编码，该对象必须已经被标记删除。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/app/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the App by code:', code));
  }

  /**
   * 根据ID，清除一个`App`对象。
   *
   * @param {string} id
   *     要清除的`App`对象的ID，该对象不必是已经被标记删除的。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showErasing();
    return http.delete(`/app/${stringifyId(id)}/erase`)
      .then(() => logger.info('Successfully erase the App by ID:', id));
  }

  /**
   * 根据编码，清除一个`App`对象。
   *
   * @param {string} code
   *     要清除的`App`对象的编码，该对象不必是已经被标记删除的。
   * @return {Promise}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code) {
    checkArgumentType('code', code, String);
    loading.showErasing();
    return http.delete(`/app/code/${code}/erase`)
      .then(() => logger.info('Successfully erase the App by code:', code));
  }
}

const appApi = new AppApi();

export default appApi;
