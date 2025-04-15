////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { stringifyId, toJSON } from '@qubit-ltd/common-decorator';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import Json from '@qubit-ltd/json';
import checkIdArgumentType from '../../utils/check-id-argument-type';
import checkIdArrayArgumentType from '../../utils/check-id-array-argument-type';
import { toJsonOptions } from './options';

/**
 * 根据ID，彻底清除一个实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} id
 *     要清除的实体对象的ID。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<void|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
 *     则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function eraseImpl(api, url, id, showLoading, options = {}) {
  checkIdArgumentType(id);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showErasing();
  }
  return http.delete(url.replaceAll('{id}', stringifyId(id)), { params }).then(() => {
    api.logger.info('Successfully erase the %s by its ID "%s".', api.entityClass.name, id);
  });
}

/**
 * 根据指定的键名和键值，彻底清除一个实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} keyName
 *     实体对象的键名。
 * @param {string} keyValue
 *     实体对象的键值，必须是字符串类型。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<void|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
 *     则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function eraseByKeyImpl(api, url, keyName, keyValue, showLoading, options = {}) {
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showErasing();
  }
  return http.delete(url.replaceAll(`{${keyName}}`, keyValue), { params }).then(() => {
    api.logger.info('Successfully erased the %s by its %s "%s".', api.entityClass.name, keyName, keyValue);
  });
}

/**
 * 彻底清除全部实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<void|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
 *     则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function eraseAllImpl(api, url, showLoading, options = {}) {
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showErasing();
  }
  return http.delete(url, { params }).then((count) => {
    api.logger.info('Successfully erase %d deleted %ss.', count, api.entityClass.name);
    return count;
  });
}

/**
 * 批量彻底清除实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {Array<string|number|bigint>} ids
 *     待批量彻底清除的实体对象的ID列表。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<number|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function batchEraseImpl(api, url, ids, showLoading, options = {}) {
  checkIdArrayArgumentType(ids);
  checkArgumentType('showLoading', showLoading, Boolean);
  const data = toJSON(ids, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showErasing();
  }
  return http.delete(url, { data, params }).then((count) => {
    api.logger.info('Successfully batch erased %d %ss.', count, api.entityClass.name);
    return count;
  });
}

/**
 * 根据指定的父键名、父键值以及子键名、子键值，彻底清除指定的实体对象（无论其是否被标记删除）。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} parentKeyName
 *     父实体对象的键名。
 * @param {string|number|bigint} parentKeyValue
 *     父实体对象的键值。
 * @param {string} keyName
 *     实体对象的键名。
 * @param {string} keyValue
 *     实体对象的键值，必须是字符串类型。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<void|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
 *     则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function eraseByParentAndKeyImpl(api, url, parentKeyName, parentKeyValue, keyName, keyValue, showLoading, options = {}) {
  checkArgumentType(parentKeyName, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showErasing();
  }
  return http.delete(
    url.replaceAll(`{${parentKeyName}}`, Json.stringify(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue),
    { params },
  ).then(() => {
    api.logger.info('Successfully erase the %s by parent %s "%s" and its %s "%s"',
      api.entityClass.name,
      parentKeyName,
      parentKeyValue,
      keyName,
      keyValue);
  });
}

export {
  eraseImpl,
  eraseByKeyImpl,
  eraseAllImpl,
  batchEraseImpl,
  eraseByParentAndKeyImpl,
};
