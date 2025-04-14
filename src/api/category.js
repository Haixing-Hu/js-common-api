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
import { Category, InfoWithEntity, CommonMimeType } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('CategoryApi');

/**
 * 提供管理`Category`对象的API。
 *
 * @author 胡海星
 */
class CategoryApi {
  /**
   * 列出符合条件的`Category`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
   * @return {Promise<Page<Category>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Category`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/category', {
      params,
    }).then((obj) => {
      const page = Category.createPage(obj, assignOptions);
      logger.info('Successfully list the Category.');
      logger.debug('The page of Category is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Category`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
   * @return {Promise<Page<InfoWithEntity>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Category`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/category/info', {
      params,
    }).then((obj) => {
      const page = InfoWithEntity.createPage(obj, assignOptions);
      logger.info('Successfully list the infos of Category.');
      logger.debug('The page of infos of Category is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Category`对象。
   *
   * @param {string|number|bigint} id
   *     `Category`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Category|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Category`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/category/${stringifyId(id)}`).then((obj) => {
      const result = Category.create(obj, assignOptions);
      logger.info('Successfully get the Category by ID:', id);
      logger.debug('The Category is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Category`对象。
   *
   * @param {string} code
   *     `Category`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Category|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Category`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/category/code/${code}`).then((obj) => {
      const result = Category.create(obj, assignOptions);
      logger.info('Successfully get the Category by code:', code);
      logger.debug('The Category is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Category`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Category`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`InfoWithEntity`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/category/${stringifyId(id)}/info`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the info of the Category by ID:', id);
      logger.debug('The info of the Category is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Category`对象的基本信息。
   *
   * @param {string} code
   *     `Category`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<InfoWithEntity|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`InfoWithEntity`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/category/code/${code}/info`).then((obj) => {
      const result = InfoWithEntity.create(obj, assignOptions);
      logger.info('Successfully get the info of the Category by code:', code);
      logger.debug('The info of the Category is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Category`对象。
   *
   * @param {Category|object} category
   *     要添加的`Category`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Category|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Category`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(category, showLoading = true) {
    checkArgumentType('category', category, [Category, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(category, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/category', data).then((obj) => {
      const result = Category.create(obj, assignOptions);
      logger.info('Successfully add the Category:', result.id);
      logger.debug('The added Category is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Category`对象。
   *
   * @param {Category} category
   *     要更新的`Category`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Category|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Category`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(category, showLoading = true) {
    checkArgumentType('category', category, [Category, Object]);
    checkIdArgumentType(category.id, 'category.id');
    checkArgumentType('showLoading', showLoading, Boolean);
    const id = stringifyId(category.id);
    const data = toJSON(category, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/category/${id}`, data).then((obj) => {
      const result = Category.create(obj, assignOptions);
      logger.info('Successfully update the Category by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Category is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Category`对象。
   *
   * @param {Category} category
   *     要更新的`Category`对象的数据，根据其编码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Category|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Category`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(category, showLoading = true) {
    checkArgumentType('category', category, [Category, Object]);
    checkArgumentType('category.code', category.code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(category, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(`/category/code/${category.code}`, data).then((obj) => {
      const result = Category.create(obj, assignOptions);
      logger.info('Successfully update the Category by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Category is:', result);
      return result;
    });
  }

  /**
   * 根据ID，标记删除一个`Category`对象。
   *
   * @param {string} id
   *     要标记删除的`Category`对象的ID。
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
    return http.delete(`/category/${stringifyId(id)}`).then((timestamp) => {
      logger.info('Successfully delete the Category by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Category`对象。
   *
   * @param {string} code
   *     要标记删除的`Category`对象的编码。
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
    return http.delete(`/category/code/${code}`).then((timestamp) => {
      logger.info('Successfully delete the Category by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 批量标记删除指定的`Category`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Category`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    checkArgumentType('ids', ids, Array);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(ids, toJsonOptions);
    if (showLoading) {
      loading.showDeleting();
    }
    return http.delete('/category/batch', data).then((count) => {
      logger.info('Successfully batch delete %d Category(s).', count);
      return count;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Category`对象。
   *
   * @param {string} id
   *     要恢复的`Category`对象的ID，该对象必须已经被标记删除。
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
    return http.patch(`/category/${stringifyId(id)}`)
      .then(() => logger.info('Successfully restore the Category by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Category`对象。
   *
   * @param {string} code
   *     要恢复的`Category`对象的编码，该对象必须已经被标记删除。
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
    return http.patch(`/category/code/${code}`)
      .then(() => logger.info('Successfully restore the Category by code:', code));
  }

  /**
   * 批量恢复已被标记删除的`Category`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Category`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    checkArgumentType('ids', ids, Array);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(ids, toJsonOptions);
    if (showLoading) {
      loading.showRestoring();
    }
    return http.patch('/category/batch', data).then((count) => {
      logger.info('Successfully batch restore %d Category(s).', count);
      return count;
    });
  }

  /**
   * 根据ID，清除一个被标记删除的`Category`对象。
   *
   * @param {string} id
   *     要清除的`Category`对象的ID，该对象必须已经被标记删除。
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
    return http.delete(`/category/${stringifyId(id)}/purge`)
      .then(() => logger.info('Successfully purge the Category by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Category`对象。
   *
   * @param {string} code
   *     要清除的`Category`对象的编码，该对象必须已经被标记删除。
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
    return http.delete(`/category/code/${code}/purge`)
      .then(() => logger.info('Successfully purge the Category by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Category`对象。
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
    return http.delete('/category/purge')
      .then(() => logger.info('Successfully purge all deleted Category.'));
  }

  /**
   * 批量彻底清除已被标记删除的`Category`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Category`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    checkArgumentType('ids', ids, Array);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(ids, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/category/batch/purge', data).then((count) => {
      logger.info('Successfully batch purge %d Category(s).', count);
      return count;
    });
  }

  /**
   * 彻底清除指定的`Category`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Category`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/category/${stringifyId(id)}/erase`)
      .then(() => logger.info('Successfully erase the Category by ID:', id));
  }

  /**
   * 根据编码，彻底清除指定的`Category`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Category`对象的编码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    checkArgumentType('code', code, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete(`/category/code/${code}/erase`)
      .then(() => logger.info('Successfully erase the Category by code:', code));
  }

  /**
   * 批量彻底清除指定的`Category`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Category`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    checkArgumentType('ids', ids, Array);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(ids, toJsonOptions);
    if (showLoading) {
      loading.showPurging();
    }
    return http.delete('/category/batch/erase', data).then((count) => {
      logger.info('Successfully batch erase %d Category(s).', count);
      return count;
    });
  }

  /**
   * 从XML文件导入`Category`对象。
   *
   * @param {File} file
   *     要导入的XML文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。默认值为`null`，表示使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Category`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showImporting();
    }
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', parallel);
    }
    if (threads !== null) {
      formData.append('threads', threads);
    }
    return http.post('/category/import/xml', formData).then((count) => {
      logger.info('Successfully import %d Category(s) from XML file.', count);
      return count;
    });
  }

  /**
   * 从JSON文件导入`Category`对象。
   *
   * @param {File} file
   *     要导入的JSON文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。默认值为`null`，表示使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Category`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showImporting();
    }
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', parallel);
    }
    if (threads !== null) {
      formData.append('threads', threads);
    }
    return http.post('/category/import/json', formData).then((count) => {
      logger.info('Successfully import %d Category(s) from JSON file.', count);
      return count;
    });
  }

  /**
   * 从Excel文件导入`Category`对象。
   *
   * @param {File} file
   *     要导入的Excel文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。默认值为`null`，表示使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Category`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importExcel(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showImporting();
    }
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', parallel);
    }
    if (threads !== null) {
      formData.append('threads', threads);
    }
    return http.post('/category/import/excel', formData).then((count) => {
      logger.info('Successfully import %d Category(s) from Excel file.', count);
      return count;
    });
  }

  /**
   * 从CSV文件导入`Category`对象。
   *
   * @param {File} file
   *     要导入的CSV文件。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。默认值为`null`，表示使用默认线程数。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Category`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importCsv(file, parallel = false, threads = null, showLoading = true) {
    checkArgumentType('file', file, File);
    checkArgumentType('parallel', parallel, Boolean, true);
    checkArgumentType('threads', threads, Number, true);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showImporting();
    }
    const formData = new FormData();
    formData.append('file', file);
    if (parallel !== null) {
      formData.append('parallel', parallel);
    }
    if (threads !== null) {
      formData.append('threads', threads);
    }
    return http.post('/category/import/csv', formData).then((count) => {
      logger.info('Successfully import %d Category(s) from CSV file.', count);
      return count;
    });
  }

  /**
   * 导出符合条件的`Category`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
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
    return http.download('/category/export/xml', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Category to XML:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Category`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
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
    return http.download('/category/export/json', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Category to JSON:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Category`对象为Excel文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
  exportExcel(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
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
    return http.download('/category/export/excel', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Category to Excel:', result);
      return result;
    });
  }

  /**
   * 导出符合条件的`Category`对象为CSV文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `entity: string` 所属实体名称；
   *  - `name: string` 名称中应包含的字符串；
   *  - `parentId: string|number|bigint` 所属父类别的ID；
   *  - `parentCode: string` 所属父类别的编码；
   *  - `parentName: string` 所属父类别名称中应包含的字符串；
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
  exportCsv(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    checkCriteriaArgument(criteria, Category);
    checkSortRequestArgument(sortRequest, Category);
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
    return http.download('/category/export/csv', params, mimeType, autoDownload).then((result) => {
      logger.info('Successfully export the Category to CSV:', result);
      return result;
    });
  }
}

const categoryApi = new CategoryApi();

export default categoryApi;
