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
import { Json } from '@qubit-ltd/json';
import checkIdArgumentType from '../../utils/check-id-argument-type';
import { assignOptions, toJsonOptions } from './options';

/**
 * 根据ID，获取指定的实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string|number|bigint} id
 *     实体对象的ID。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     其他附加的查询参数。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getImpl(api, url, id, showLoading, options = {}) {
  checkIdArgumentType(id);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll('{id}', stringifyId(id)), { params }).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s by its ID "%s"', api.entityClass.name, id);
    api.logger.debug('The %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的键名和键值，获取指定的实体对象。
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
 *     其他附加的查询参数。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getByKeyImpl(api, url, keyName, keyValue, showLoading, options = {}) {
  // 检查调用方传入的参数：keyName 是参数名（如 'code'），keyValue 是要检查的值
  // 这样错误信息会显示为 "The value of the argument 'code' must be a String"
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll(`{${keyName}}`, keyValue), { params }).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s by its %s "%s".', api.entityClass.name, keyName, keyValue);
    api.logger.debug('The %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据ID，获取指定的实体对象的基本信息。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string|number|bigint} id
 *     实体对象的ID。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @return {Promise<StatefulInfo|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的基本信息；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getInfoImpl(api, url, id, showLoading) {
  checkIdArgumentType(id);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll('{id}', stringifyId(id))).then((obj) => {
    const result = api.entityInfoClass.create(obj, assignOptions);
    api.logger.info('Successfully get the info of the %s by its ID "%s".', api.entityClass.name, id);
    api.logger.debug('The info of the %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的键名和键值，获取指定的实体对象的基本信息。
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
 * @return {Promise<StatefulInfo|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的基本信息；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getInfoByKeyImpl(api, url, keyName, keyValue, showLoading) {
  // 检查调用方传入的参数：keyName 是参数名（如 'code'），keyValue 是要检查的值
  // 这样错误信息会显示为 "The value of the argument 'code' must be a String"
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll(`{${keyName}}`, keyValue)).then((obj) => {
    const result = api.entityInfoClass.create(obj, assignOptions);
    api.logger.info('Successfully get the info of the %s by its %s "%s".', api.entityClass.name, keyName, keyValue);
    api.logger.debug('The info of the %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据ID，获取指定的实体对象的指定属性值。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} propertyName
 *     指定的属性的名称。
 * @param {function} propertyClass
 *     指定的属性的类型。
 * @param {string|number|bigint} id
 *     实体对象的ID。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     其他附加的查询参数。
 * @return {Promise<InfoWithEntity|null|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的指定属性值，
 *     或`null`若该对象的属性值为`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getPropertyImpl(api, url, propertyName, propertyClass, id, showLoading, options = {}) {
  checkIdArgumentType(id);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll('{id}', stringifyId(id)), { params }).then((obj) => {
    const result = propertyClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s of the %s by its ID "%s".', propertyName, api.entityClass.name, id);
    api.logger.debug('The %s of the %s is:', propertyName, api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据实体对象指定的主键，获取指定的实体对象的指定属性值。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} propertyName
 *     指定的属性的名称。
 * @param {function} propertyClass
 *     指定的属性的类型。
 * @param {string} keyName
 *     指定的主键的名称。
 * @param {string} keyValue
 *     指定的主键的值，这个值必须是字符串类型。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     其他附加的查询参数。
 * @return {Promise<InfoWithEntity|null|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的指定属性值，
 *     或`null`若该对象的属性值为`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getPropertyByKeyImpl(api, url, propertyName, propertyClass, keyName, keyValue, showLoading, options = {}) {
  // 检查调用方传入的参数：keyName 是参数名（如 'code'），keyValue 是要检查的值
  // 这样错误信息会显示为 "The value of the argument 'code' must be a String"
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url.replaceAll(`{${keyName}}`, keyValue), { params }).then((obj) => {
    const result = propertyClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s of the %s by its %s "%s".', propertyName, api.entityClass.name, keyName, keyValue);
    api.logger.debug('The %s of the %s is:', propertyName, api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的父键名、父键值以及子键名、子键值，获取指定的实体对象。
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
 *     其他附加的查询参数。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getByParentAndKeyImpl(api, url, parentKeyName, parentKeyValue, keyName, keyValue, showLoading, options = {}) {
  // 检查调用方传入的参数：parentKeyName 是父参数名，parentKeyValue 是要检查的父参数值
  // 这样错误信息会显示为 "The value of the argument 'organizationId' must be a String, Number or BigInt"
  checkArgumentType(parentKeyName, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType('keyName', keyName, String);
  checkArgumentType('keyValue', keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(
    url.replaceAll(`{${parentKeyName}}`, Json.stringify(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue),
    { params },
  ).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s by parent %s "%s" and its %s "%s".',
        api.entityClass.name, parentKeyName, parentKeyValue, keyName, keyValue);
    api.logger.debug('The %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的父键名、父键值以及子键名、子键值，获取指定的实体对象的基本信息。
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
 * @return {Promise<StatefulInfo|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的基本信息；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getInfoByParentAndKeyImpl(api, url, parentKeyName, parentKeyValue, keyName, keyValue, showLoading) {
  // 检查调用方传入的参数：parentKeyName 是父参数名，parentKeyValue 是要检查的父参数值
  // 这样错误信息会显示为 "The value of the argument 'organizationId' must be a String, Number or BigInt"
  checkArgumentType(parentKeyName, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType('keyName', keyName, String);
  checkArgumentType('keyValue', keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(
    url.replaceAll(`{${parentKeyName}}`, Json.stringify(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue),
  ).then((obj) => {
    const result = api.entityInfoClass.create(obj, assignOptions);
    api.logger.info('Successfully get the info of the %s by parent %s "%s" and its %s "%s".',
      api.entityClass.name,
      parentKeyName,
      parentKeyValue,
      keyName,
      keyValue,
    );
    api.logger.debug('The info of the %s is:', api.entityClass.name, result);
    return result;
  });
}

/**
 * 根据指定的父键名、父键值以及子键名、子键值，获取指定的实体对象的指定属性值。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} propertyName
 *     指定的属性的名称。
 * @param {function} propertyClass
 *     指定的属性的类型。
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
 *     其他附加的查询参数。
 * @return {Promise<InfoWithEntity|null|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象的指定属性值，
 *     或`null`若该对象的属性值为`null`；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function getPropertyByParentAndKeyImpl(api, url, propertyName, propertyClass,
    parentKeyName, parentKeyValue, keyName, keyValue, showLoading, options = {}) {
  // 检查调用方传入的参数：parentKeyName 是父参数名，parentKeyValue 是要检查的父参数值
  // 这样错误信息会显示为 "The value of the argument 'organizationId' must be a String, Number or BigInt"
  checkArgumentType(parentKeyName, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType('keyName', keyName, String);
  checkArgumentType('keyValue', keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(
    url.replaceAll(`{${parentKeyName}}`, Json.stringify(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue),
    { params },
  ).then((obj) => {
    const result = propertyClass.create(obj, assignOptions);
    api.logger.info('Successfully get the %s of the %s by parent %s "%s" and its %s "%s".',
      propertyName,
      api.entityClass.name,
      parentKeyName,
      parentKeyValue,
      keyName,
      keyValue,
    );
    api.logger.debug('The %s of the %s is:', propertyName, api.entityClass.name, result);
    return result;
  });
}

export {
  getImpl,
  getByKeyImpl,
  getInfoImpl,
  getInfoByKeyImpl,
  getPropertyImpl,
  getPropertyByKeyImpl,
  getByParentAndKeyImpl,
  getInfoByParentAndKeyImpl,
  getPropertyByParentAndKeyImpl,
};
