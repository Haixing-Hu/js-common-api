////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { toJSON } from '@qubit-ltd/common-decorator';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import checkObjectArgument from '../../utils/check-object-argument';
import checkPageRequestArgument from '../../utils/check-page-request-argument';
import checkSortRequestArgument from '../../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './options';

/**
 * 列出符合条件的实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {PageRequest|object} pageRequest
 *     分页请求。
 * @param {object} criteria
 *     查询条件参数，所有条件之间用`AND`连接。
 * @param {object} sortRequest
 *     排序参数，指定按照哪个属性排序。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     其他附加的查询参数。
 * @return {Promise<Page<App>|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
 *     件的实体对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function listImpl(api, url, pageRequest, criteria, sortRequest, showLoading, options = {}) {
  checkPageRequestArgument(pageRequest);
  checkObjectArgument('criteria', criteria, api.CRITERIA_DEFINITIONS);
  checkSortRequestArgument(sortRequest, api.entityClass);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...pageRequest,
    ...criteria,
    ...sortRequest,
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url, { params }).then((obj) => {
    const page = api.entityClass.createPage(obj, assignOptions);
    api.logger.info('Successfully list %ss.', api.entityClass.name);
    api.logger.debug('The page of %ss is:', api.entityClass.name, page);
    return page;
  });
}

/**
 * 列出符合条件的实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {PageRequest|object} pageRequest
 *     分页请求。
 * @param {object} criteria
 *     查询条件参数，所有条件之间用`AND`连接。
 * @param {object} sortRequest
 *     排序参数，指定按照哪个属性排序。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     其他附加的查询参数。
 * @return {Promise<Page<App>|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
 *     件的实体对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function listInfoImpl(api, url, pageRequest, criteria, sortRequest, showLoading, options = {}) {
  checkPageRequestArgument(pageRequest);
  checkObjectArgument('criteria', criteria, api.CRITERIA_DEFINITIONS);
  checkSortRequestArgument(sortRequest, api.entityClass);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...pageRequest,
    ...criteria,
    ...sortRequest,
    ...options,
  }, toJsonOptions);
  if (showLoading) {
    loading.showGetting();
  }
  return http.get(url, { params }).then((obj) => {
    const page = api.entityInfoClass.createPage(obj, assignOptions);
    api.logger.info('Successfully list infos of %ss.', api.entityClass.name);
    api.logger.debug('The page of infos of %ss is:', api.entityClass.name, page);
    return page;
  });
}

export {
  listImpl,
  listInfoImpl,
};
