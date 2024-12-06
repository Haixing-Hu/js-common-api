////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { toJSON } from '@haixing_hu/common-decorator';
import { Upload } from '@haixing_hu/common-model';
import { Log, Logger } from '@haixing_hu/logging';
import { checkArgumentType } from '@haixing_hu/common-util';
import { loading } from '@haixing_hu/common-ui';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('FileApi');

/**
 * 提供文件上传、下载服务的API。
 *
 * @author 胡海星
 */
class FileApi {
  /**
   * 上载一个文件。
   *
   * @param {string} filename
   *     待上传的文件的原始文件名。
   * @param {Blob|File} file
   *     待上传的文件对象。
   * @param {string|null|undefined} contentType
   *     待上传文件的 Content-Type。可以为`null`或者`undefined`。
   * @param {function|null|undefined} onUploadProgress
   *     上传进度回调函数。可以为`null`或者`undefined`。如果非空，则必须是 axios
   *     的`onUploadProgress`回调函数，该函数接收一个`progressEvent`参数，
   *     用于监控上传进度，其中`progressEvent.loaded`表示已上传的字节数，
   *     `progressEvent.total`表示总字节数。
   * @return {Promise<Upload|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回根据上传的文件所创建的
   *     `Upload`对象；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  upload(filename, file, contentType = undefined, onUploadProgress = undefined) {
    checkArgumentType('filename', filename, String);
    checkArgumentType('file', file, [Blob, File]);
    checkArgumentType('contentType', contentType, String, true);
    checkArgumentType('onUploadProgress', onUploadProgress, Function, true);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const formData = new FormData();
    formData.append('filename', filename);
    if (contentType) {
      formData.append('contentType', contentType);
    }
    formData.append('file', file);
    return http.post('/file/upload', formData, { headers, onUploadProgress }).then((obj) => {
      const result = Upload.create(obj, assignOptions);
      logger.info('Successfully update the file.');
      logger.debug('The upload file is:', result);
      return result;
    });
  }

  /**
   * 下载指定的文件。
   *
   * @param {string} path
   *    待下载文件在服务器上的相对路径。
   * @param {string|null} mimeType
   *    文件的MIME类型，若为`null`或`undefined`则从响应头中自动解析。默认值为`null`。
   * @param {boolean} autoDownload
   *    是否自动下载文件。默认值为`true`。如此参数为`false`，则返回一个包含下载的文件的信息
   *    的对象，详见返回值说明。
   * @param {boolean} showLoading
   *    是否显示加载提示。默认值为`true`。
   * @return {Promise<object|ErrorInfo>}
   *    此HTTP请求的`Promise`对象。若操作成功，则解析成功，并返回一个包含下载的文件的信息的
   *    对象，其中包含以下属性：
   *    - `blob: Blob` 下载的文件的二进制数据；
   *    - `filename: string` 下载的文件的名称；
   *    - `mimeType: string` 下载的文件的MIME类型；
   *
   *    如果操作失败，则解析失败并返回一个`ErrorInfo`对象。如果操作成功且`autoDownload`
   *    设置为`true`，浏览器会自动开始下载文件。
   */
  @Log
  download(path, mimeType = null, autoDownload = true, showLoading = true) {
    checkArgumentType('path', path, String);
    checkArgumentType('mimeType', mimeType, String, true);
    checkArgumentType('autoDownload', autoDownload, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    // 注意：我们没有采用直接拼接URL的方式带上query string，
    // 因为需要对参数做 URI encoding，否则如果参数中也带有hash或query，就会出错。
    const params = toJSON({ path }, toJsonOptions);
    if (showLoading) {
      loading.showDownloading();
    }
    return http.download('/file/download', params, mimeType, autoDownload);
  }

  /**
   * 获取待下载文件在服务器上相对路径的绝对下载URL。
   *
   * @param path
   *     待下载文件在服务器上的相对路径。
   * @returns {Promise<String>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回待下载文件在服务器上相对路径
   *     的绝对下载URL；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getDownloadUrl(path) {
    const params = toJSON({
      path,
    }, toJsonOptions);
    return http.get('/file/download/url', { params }).then((response) => {
      const url = String(response);
      logger.info('Successfully get the download URL for file %s:', path, url);
      return url;
    });
  }
}

const fileApi = new FileApi();

export default fileApi;
