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
import { assignOptions, toJsonOptions } from './options';

/**
 * 添加一个实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {object} entity
 *     要添加的实体对象。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @param {object} options
 *     附加的选项。
 * @return {Promise<App|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的实体对象；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 */
function addImpl(api, url, entity, showLoading, options = {}) {
  checkArgumentType('entity', entity, [api.entityClass, Object]);
  checkArgumentType('showLoading', showLoading, Boolean);
  const data = toJSON(entity, toJsonOptions);
  const params = toJSON({ ...options }, toJsonOptions);
  if (showLoading) {
    loading.showAdding();
  }
  return http.post(url, data, { params }).then((obj) => {
    const result = api.entityClass.create(obj, assignOptions);
    api.logger.info('Successfully add the %s:', api.entityClass.name, entity.id);
    api.logger.debug('The added %s is:', api.entityClass.name, result);
    return result;
  });
}

export default addImpl;
