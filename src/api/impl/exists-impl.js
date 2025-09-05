////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { stringifyId } from '@qubit-ltd/common-decorator';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import checkIdArgumentType from '../../utils/check-id-argument-type';

/**
 * 检测指定的实体对象是否存在。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string|number|bigint} id
 *     实体对象的ID。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @return {Promise<boolean|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的实体对象是否存在；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function existsImpl(api, url, id, showLoading) {
  checkIdArgumentType(id);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  return http.head(url.replaceAll('{id}', stringifyId(id))).then(() => {
    api.logger.info('Successfully checked the existence of %s by its ID "%s".', api.entityClass.name, id);
    return true;
  });
}

/**
 * 检测指定键值的实体对象是否存在。
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
 * @return {Promise<boolean|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定键值的实体对象是否存在；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function existsKeyImpl(api, url, keyName, keyValue, showLoading) {
  // 检查调用方传入的参数：keyName 是参数名（如 'code'），keyValue 是要检查的值
  // 这样错误信息会显示为 "The value of the argument 'code' must be a String"
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  return http.head(url.replaceAll(`{${keyName}}`, keyValue)).then(() => {
    api.logger.info('Successfully checked the existence of %s by its %s "%s".', api.entityClass.name, keyName, keyValue);
    return true;
  });
}

/**
 * 检测指定父键值和子键值的实体对象是否存在。
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
 * @return {Promise<boolean|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定父键值和子键值的实体对象是否存在；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function existsParentAndKeyImpl(api, url, parentKeyName, parentKeyValue, keyName, keyValue, showLoading) {
  // 检查调用方传入的参数：parentKeyName 是父参数名，parentKeyValue 是要检查的父参数值
  // keyName 是子参数名，keyValue 是要检查的子参数值
  checkArgumentType(parentKeyName, parentKeyValue, [String, Number, BigInt]);
  checkArgumentType(keyName, keyValue, String);
  checkArgumentType('showLoading', showLoading, Boolean);
  if (showLoading) {
    loading.showGetting();
  }
  const theUrl = url.replaceAll(`{${parentKeyName}}`, stringifyId(parentKeyValue)).replaceAll(`{${keyName}}`, keyValue);
  return http.head(theUrl).then(() => {
    api.logger.info('Successfully checked the existence of %s by parent %s "%s" and its %s "%s".',
        api.entityClass.name, parentKeyName, parentKeyValue, keyName, keyValue);
    return true;
  });
}

export {
  existsImpl,
  existsKeyImpl,
  existsParentAndKeyImpl,
};
