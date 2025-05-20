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
import { assignOptions, toJsonOptions } from './options';

/**
 * 根据ID，更新一个实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {object} entity
 *     要更新的实体对象。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function updateImpl(api, url, entity, showLoading, options = {}) {
  checkArgumentType('entity', entity, [api.entityClass, Object]);
  checkIdArgumentType(entity.id, 'entity.id');
  checkArgumentType('showLoading', showLoading, Boolean);
  const data = toJSON(entity, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showUpdating();
  }
  return http.put(url.replaceAll('{id}', stringifyId(entity.id)), data, { params }).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully update the %s by its ID:', api.entityClass.name, result.id);
    api.logger.debug('The updated %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的主键，更新一个实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} keyName
 *     指定的主键的名称，此主键值必须是字符串类型。
 * @param {object} entity
 *     要更新的实体对象。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function updateByKeyImpl(api, url, keyName, entity, showLoading, options = {}) {
  checkArgumentType('entity', entity, [api.entityClass, Object]);
  checkArgumentType(`entity.${keyName}`, entity[keyName], String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const keyValue = entity[keyName];
  const data = toJSON(entity, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showUpdating();
  }
  return http.put(url.replaceAll(`{${keyName}}`, keyValue), data, { params }).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully update the %s by its %s:', api.entityClass.name, keyName, keyValue);
    api.logger.debug('The updated %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据ID，更新一个实体对象的指定属性。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} id
 *     指定的实体的ID。
 * @param {string} propertyName
 *     指定的属性的名称。
 * @param {function|array<function>} propertyClass
 *     指定的属性的类型。
 * @param {any} propertyValue
 *     指定的属性的值。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function updatePropertyImpl(api, url, id, propertyName, propertyClass,
    propertyValue, showLoading, options = {}) {
  checkIdArgumentType(id);
  checkArgumentType(propertyName, propertyValue, propertyClass);
  checkArgumentType('showLoading', showLoading, Boolean);
  const data = toJSON(propertyValue, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showUpdating();
  }
  return http.put(url.replaceAll('{id}', stringifyId(id)), data, { params }).then((timestamp) => {
    api.logger.info('Successfully update the %s of a %s by its ID "%s" at:',
      propertyName, api.entityClass.name, id, timestamp);
    return timestamp;
  });
}

/**
 * 根据指定的主键，更新一个实体对象的指定属性。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} keyName
 *     指定的主键的名称，此主键值必须是字符串类型。
 * @param {string} keyValue
 *     指定的主键的值。
 * @param {string} propertyName
 *     指定的属性的名称。
 * @param {function} propertyClass
 *     指定的属性的类型。
 * @param {any} propertyValue
 *     指定的属性的值。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function updatePropertyByKeyImpl(api, url, keyName, keyValue, propertyName,
    propertyClass, propertyValue, showLoading, options = {}) {
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType(propertyName, propertyValue, propertyClass);
  checkArgumentType('showLoading', showLoading, Boolean);
  const data = toJSON(propertyValue, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showUpdating();
  }
  return http.put(url.replaceAll(`{${keyName}}`, keyValue), data, { params }).then((timestamp) => {
    api.logger.info('Successfully update the %s of a %s by its %s "%s" at:',
      propertyName, api.entityClass.name, keyName, keyValue, timestamp);
    return timestamp;
  });
}

/**
 * 根据指定的父键名、父键值以及子键名、子键值，更新一个实体对象。
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
 * @param {object} entity
 *     要更新的实体对象。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function updateByParentAndKeyImpl(api, url, parentKeyName, parentKeyValue,
    keyName, entity, showLoading, options = {}) {
  checkArgumentType('entity', entity, [api.entityClass, Object]);
  checkArgumentType(`entity.${parentKeyName}`, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType(`entity.${keyName}`, entity[keyName], String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const keyValue = entity[keyName];
  const data = toJSON(entity, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showUpdating();
  }
  return http.put(
    url.replaceAll(`{${parentKeyName}}`, Json.stringify(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue),
    data,
    { params },
  ).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully update the %s by parent %s "%s" and its %s "%s"',
      api.entityClass.name,
      parentKeyName,
      parentKeyValue,
      keyName,
      keyValue);
    api.logger.debug('The updated %s is:', api.entityClass.name, result);
    return result;
  });
}

export {
  updateImpl,
  updateByKeyImpl,
  updatePropertyImpl,
  updatePropertyByKeyImpl,
  updateByParentAndKeyImpl,
};
