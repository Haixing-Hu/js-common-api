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
import { toJsonOptions } from './options';

/**
 * 从指定格式的文件导入指定的实体对象。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} format
 *     指定的文件的格式。
 * @param {File} file
 *     CSV文件对象。
 * @param {boolean} parallel
 *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。
 * @param {number} threads
 *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
 *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @return {Promise<number|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`App`对象的数量；
 *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function importImpl(api, url, format, file, parallel, threads, showLoading) {
  checkArgumentType('file', file, File);
  checkArgumentType('parallel', parallel, Boolean, true);
  checkArgumentType('threads', threads, Number, true);
  checkArgumentType('showLoading', showLoading, Boolean);
  const formData = new FormData();
  formData.append('file', file);
  const params = toJSON({
    parallel,
    threads,
  }, toJsonOptions);
  if (showLoading) {
    loading.showImporting();
  }
  return http.post(url, formData, {
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((count) => {
    api.logger.info('Successfully import %d %ss from a %s file: %s', count, api.entityClass.name, format, file.name);
    return count;
  });
}

export default importImpl;
