////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { toJSON } from '@haixing_hu/common-decorator';
import {
  Setting,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('SettingApi');

/**
 * 提供管理`Setting`对象的API。
 *
 * @author 胡海星
 */
class SettingApi {
  /**
   * 列出符合条件的`Setting`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {string} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *
   *     - `name: string` 名称中应包含的字符串；
   *     - `readonly: boolean` 是否只读；
   *     - `nullable: boolean` 是否可以为空；
   *     - `multiple: boolean` 是否可以取多个值；
   *     - `encrypted: boolean` 是否加密；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Setting>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Setting`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
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
    return http.get('/setting', {
      params,
    }).then((obj) => {
      const page = Setting.createPage(obj, assignOptions);
      logger.info('Successfully list the Setting.');
      logger.debug('The page of Setting is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Setting`对象。
   *
   * @param {string} name
   *     指定的{@link Setting}的名称。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(name) {
    checkArgumentType('name', name, String);
    loading.showGetting();
    return http.get(`/setting/${name}`).then((obj) => {
      const result = Setting.create(obj, assignOptions);
      logger.info('Successfully get the Setting:', name);
      logger.debug('The Setting is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Setting`对象。
   *
   * @param {Setting} setting
   *     要添加的`Setting`对象。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(setting) {
    checkArgumentType('setting', setting, Setting);
    const data = toJSON(setting, toJsonOptions);
    loading.showAdding();
    return http.post('/setting', data).then((obj) => {
      const result = Setting.create(obj, assignOptions);
      logger.info('Successfully add the Setting:', result.id);
      logger.debug('The added Setting is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Setting`对象。
   *
   * @param {string} name
   *     指定的{@link Setting}的名称。
   * @param {string} value
   *     待{@link Setting}的新取值，若不指定则表示将该{@link Setting}的值修改为{@code null}。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(name, value) {
    checkArgumentType('setting', name, Setting);
    checkArgumentType('setting', value, Setting);
    const data = toJSON(value, toJsonOptions);
    loading.showUpdating();
    return http.put(`/setting/${name}`, data).then((timestamp) => {
      logger.info('Successfully update the Setting "%s" at:', name, timestamp);
      return timestamp;
    });
  }
}

const settingApi = new SettingApi();

export default settingApi;
