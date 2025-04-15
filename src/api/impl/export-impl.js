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
import { CommonMimeType } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import checkObjectArgument from '../../utils/check-object-argument';
import checkSortRequestArgument from '../../utils/check-sort-request-argument';
import { toJsonOptions } from './options';

/**
 * 导出符合条件的实体对象为指定格式的文件。
 *
 * @param {object} api
 *     调用此函数的API对象。
 * @param {string} url
 *     请求的URL。
 * @param {string} format
 *     指定的文件的格式。
 * @param {object} criteria
 *     查询条件参数，所有条件之间用`AND`连接。
 * @param {object} sortRequest
 *     排序参数，指定按照哪个属性排序。
 * @param {boolean} autoDownload
 *     是否自动下载文件。
 * @param {boolean} showLoading
 *     是否显示加载提示。
 * @return {Promise<string|null|ErrorInfo>}
 *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
 *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
 *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
 *     则解析失败并返回一个`ErrorInfo`对象。
 * @author 胡海星
 */
function exportImpl(api, url, format, criteria, sortRequest, autoDownload, showLoading) {
  checkObjectArgument('criteria', criteria, api.CRITERIA_DEFINITIONS);
  checkSortRequestArgument(sortRequest, api.entityClass);
  checkArgumentType('autoDownload', autoDownload, Boolean);
  checkArgumentType('showLoading', showLoading, Boolean);
  const params = toJSON({
    ...criteria,
    ...sortRequest,
  }, toJsonOptions);
  if (showLoading) {
    loading.showExporting();
  }
  const mimeType = CommonMimeType[format.toUpperCase()];
  return http.download(url, params, mimeType, autoDownload).then((result) => {
    api.logger.info('Successfully export Apps to a CSV file:', result.filename);
    return result;
  });
}

export default exportImpl;
