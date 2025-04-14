////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { toJSON } from '@qubit-ltd/common-decorator';
import {
  Setting,
  CommonMimeType,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkObjectArgument from '../utils/check-object-argument';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('SettingApi');

const SETTING_CRITERIA_DEFINITIONS = [
  { name: 'name', type: String },
  { name: 'readonly', type: Boolean },
  { name: 'nullable', type: Boolean },
  { name: 'multiple', type: Boolean },
  { name: 'encrypted', type: Boolean },
];

/**
 * 提供管理`Setting`对象的API。
 *
 * @author 胡海星
 */
class SettingApi {
  /**
   * 列出符合条件的`Setting`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {string} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `readonly: boolean` 是否只读；
   *  - `nullable: boolean` 是否可以为空；
   *  - `multiple: boolean` 是否可以取多个值；
   *  - `encrypted: boolean` 是否加密；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Setting>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Setting`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkObjectArgument('criteria', criteria, SETTING_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Setting);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(name, showLoading = true) {
    checkArgumentType('name', name, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
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
   * @param {Setting|object} setting
   *     要添加的`Setting`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(setting, showLoading = true) {
    checkArgumentType('setting', setting, [Setting, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(setting, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
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
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Setting|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Setting`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(name, value, showLoading = true) {
    checkArgumentType('name', name, String);
    checkArgumentType('value', value, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(value, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/setting/${name}`, data).then((timestamp) => {
      logger.info('Successfully update the Setting "%s" at:', name, timestamp);
      return timestamp;
    });
  }

  /**
   * 导出符合条件的`Setting`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `readonly: boolean` 是否只读；
   *  - `nullable: boolean` 是否可以为空；
   *  - `multiple: boolean` 是否可以取多个值；
   *  - `encrypted: boolean` 是否加密；
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
    checkObjectArgument('criteria', criteria, SETTING_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Setting);
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
    return http.download('/setting/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Setting to XML:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Setting`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `readonly: boolean` 是否只读；
   *  - `nullable: boolean` 是否可以为空；
   *  - `multiple: boolean` 是否可以取多个值；
   *  - `encrypted: boolean` 是否加密；
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
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkObjectArgument('criteria', criteria, SETTING_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Setting);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.JSON;
    return http.download('/setting/export/json', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Setting to JSON:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Setting`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `readonly: boolean` 是否只读；
   *  - `nullable: boolean` 是否可以为空；
   *  - `multiple: boolean` 是否可以取多个值；
   *  - `encrypted: boolean` 是否加密；
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
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkObjectArgument('criteria', criteria, SETTING_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Setting);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.EXCEL;
    return http.download('/setting/export/excel', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Setting to Excel:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Setting`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `name: string` 名称中应包含的字符串；
   *  - `readonly: boolean` 是否只读；
   *  - `nullable: boolean` 是否可以为空；
   *  - `multiple: boolean` 是否可以取多个值；
   *  - `encrypted: boolean` 是否加密；
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
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkObjectArgument('criteria', criteria, SETTING_CRITERIA_DEFINITIONS);
    checkSortRequestArgument(sortRequest, Setting);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    const mimeType = CommonMimeType.CSV;
    return http.download('/setting/export/csv', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Setting to CSV:', result);
      return result;
    });
  }

  /**
   * 从XML文件导入`Setting`对象。
   *
   * @param {File|Blob} file
   *     待导入的XML文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Setting`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, [File, Blob]);
    checkArgumentType('parallel', parallel, Boolean);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', String(parallel));
    }
    if (threads !== null) {
      formData.append('threads', String(threads));
    }
    if (showLoading) {
      loading.showUploading();
    }
    return http.post('/setting/import/xml', formData).then((count) => {
      logger.info('Successfully import %d Settings from the XML file.', count);
      return count;
    });
  }

  /**
   * 从JSON文件导入`Setting`对象。
   *
   * @param {File|Blob} file
   *     待导入的JSON文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Setting`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, [File, Blob]);
    checkArgumentType('parallel', parallel, Boolean);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', String(parallel));
    }
    if (threads !== null) {
      formData.append('threads', String(threads));
    }
    if (showLoading) {
      loading.showUploading();
    }
    return http.post('/setting/import/json', formData).then((count) => {
      logger.info('Successfully import %d Settings from the JSON file.', count);
      return count;
    });
  }

  /**
   * 从Excel文件导入`Setting`对象。
   *
   * @param {File|Blob} file
   *     待导入的Excel文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Setting`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, [File, Blob]);
    checkArgumentType('parallel', parallel, Boolean);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', String(parallel));
    }
    if (threads !== null) {
      formData.append('threads', String(threads));
    }
    if (showLoading) {
      loading.showUploading();
    }
    return http.post('/setting/import/excel', formData).then((count) => {
      logger.info('Successfully import %d Settings from the Excel file.', count);
      return count;
    });
  }

  /**
   * 从CSV文件导入`Setting`对象。
   *
   * @param {File|Blob} file
   *     待导入的CSV文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number|null} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，则使用默认
   *     线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Setting`对象的
   *     数量；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, [File, Blob]);
    checkArgumentType('parallel', parallel, Boolean);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', String(parallel));
    }
    if (threads !== null) {
      formData.append('threads', String(threads));
    }
    if (showLoading) {
      loading.showUploading();
    }
    return http.post('/setting/import/csv', formData).then((count) => {
      logger.info('Successfully import %d Settings from the CSV file.', count);
      return count;
    });
  }
}

const settingApi = new SettingApi();

export default settingApi;
