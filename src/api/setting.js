////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Setting } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import exportImpl from './impl/export-impl';
import { getImpl } from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl } from './impl/list-impl';
import { updatePropertyImpl } from './impl/update-impl';

/**
 * 提供管理`Setting`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class SettingApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Setting;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    { name: 'name', type: String },
    { name: 'readonly', type: Boolean },
    { name: 'nullable', type: Boolean },
    { name: 'multiple', type: Boolean },
    { name: 'encrypted', type: Boolean },
  ];

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
    return listImpl(this, '/setting', pageRequest, criteria, sortRequest, showLoading);
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
    return getImpl(this, '/setting/{id}', name, showLoading);
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
    return addImpl(this, '/setting', setting, showLoading);
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
    return updatePropertyImpl(this, '/setting/{id}', name, 'value', String, value, showLoading);
  }

  /**
   * 以布尔值形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<boolean|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为布尔值），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getBool(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting && setting.value !== null && setting.value !== undefined) {
      if (setting.value.toLowerCase() === 'true') {
        return true;
      } else if (setting.value.toLowerCase() === 'false') {
        return false;
      } else {
        return Boolean(setting.value);
      }
    }
    return null;
  }

  /**
   * 以数字形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为数字），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getInt(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting && setting.value !== null && setting.value !== undefined) {
      return parseInt(setting.value, 10);
    }
    return null;
  }

  /**
   * 以长整数形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|bigint|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为长整数），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getLong(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting && setting.value !== null && setting.value !== undefined) {
      try {
        return BigInt(setting.value);
      } catch {
        return parseInt(setting.value, 10);
      }
    }
    return null;
  }

  /**
   * 以浮点数形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为浮点数），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getFloat(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting && setting.value !== null && setting.value !== undefined) {
      return parseFloat(setting.value);
    }
    return null;
  }

  /**
   * 以双精度浮点数形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为双精度浮点数），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getDouble(name, showLoading = true) {
    return this.getFloat(name, showLoading);
  }

  /**
   * 以字符串形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为字符串），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getString(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting) {
      return setting.value;
    }
    return null;
  }

  /**
   * 以日期形式获取指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Date|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定设置的值（转换为日期），注意可能为`null`；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async getDate(name, showLoading = true) {
    const setting = await this.get(name, showLoading);
    if (setting && setting.value !== null && setting.value !== undefined) {
      return new Date(setting.value);
    }
    return null;
  }

  /**
   * 以布尔值的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {boolean} value
   *     要设置的布尔值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setBool(name, value, showLoading = true) {
    const strValue = value === null || value === undefined ? null : String(value);
    return this.update(name, strValue, showLoading);
  }

  /**
   * 以整数的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {number} value
   *     要设置的整数值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setInt(name, value, showLoading = true) {
    const strValue = value === null || value === undefined ? null : String(value);
    return this.update(name, strValue, showLoading);
  }

  /**
   * 以长整数的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {number|bigint} value
   *     要设置的长整数值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setLong(name, value, showLoading = true) {
    const strValue = value === null || value === undefined ? null : String(value);
    return this.update(name, strValue, showLoading);
  }

  /**
   * 以浮点数的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {number} value
   *     要设置的浮点数值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setFloat(name, value, showLoading = true) {
    const strValue = value === null || value === undefined ? null : String(value);
    return this.update(name, strValue, showLoading);
  }

  /**
   * 以双精度浮点数的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {number} value
   *     要设置的双精度浮点数值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setDouble(name, value, showLoading = true) {
    return this.setFloat(name, value, showLoading);
  }

  /**
   * 以字符串的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {string} value
   *     要设置的字符串值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setString(name, value, showLoading = true) {
    return this.update(name, value, showLoading);
  }

  /**
   * 以日期的形式设置指定设置的值。
   *
   * @param {string} name
   *     指定设置的名称。
   * @param {Date} value
   *     要设置的日期值。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  setDate(name, value, showLoading = true) {
    const strValue = value === null || value === undefined ? null : value.toISOString();
    return this.update(name, strValue, showLoading);
  }

  /**
   * 检查并更新指定的设置的值。
   *
   * @param {string} name
   *     指定的设置的名称。
   * @param {*} value
   *     待更新的新的值，若为`null`则不做更新。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的值；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  async checkAndUpdate(name, value, showLoading = true) {
    if (value === null || value === undefined) {
      return this.getString(name, showLoading);
    }
    const strValue = String(value);
    await this.update(name, strValue, showLoading);
    return strValue;
  }

  /**
   * 根据名称更新一个已存在的`Setting`的类型和取值。
   *
   * @param {Setting|object} setting
   *     待更新的`Setting`对象，必须指定其`name`属性。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被修改时的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateTypeValueByName(setting, showLoading = true) {
    // 确保setting是Setting类的实例
    const settingObj = Setting.create(setting);
    if (!settingObj.name) {
      throw new Error('设置对象必须指定名称');
    }
    // 由于缺少专用接口，我们只能通过更新值来实现部分功能
    // 注意：这种方式无法更新类型，只能更新值
    return this.update(settingObj.name, settingObj.value, showLoading);
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
    return exportImpl(this, '/setting/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
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
    return exportImpl(this, '/setting/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
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
    return exportImpl(this, '/setting/export/excel', 'EXCEL', criteria, sortRequest, autoDownload, showLoading);
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
    return exportImpl(this, '/setting/export/csv', 'CSV', criteria, sortRequest, autoDownload, showLoading);
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
    return importImpl(this, '/setting/import/xml', 'XML', file, parallel, threads, showLoading);
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
    return importImpl(this, '/setting/import/json', 'JSON', file, parallel, threads, showLoading);
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
    return importImpl(this, '/setting/import/excel', 'EXCEL', file, parallel, threads, showLoading);
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
    return importImpl(this, '/setting/import/csv', 'CSV', file, parallel, threads, showLoading);
  }
}

const settingApi = new SettingApi();

export default settingApi;
