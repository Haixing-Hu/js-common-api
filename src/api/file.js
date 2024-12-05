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
import { assignOptions, toJsonOptions } from './impl/options';
import extractContentDispositionFilename from '../utils/extract-content-disposition-filename';

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
   *     待下载文件在服务器上的相对路径。
   * @returns {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，浏览器会自动开始下载文件；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  download(path) {
    checkArgumentType('path', path, String);
    // 注意：我们没有采用直接拼接URL的方式带上query string，
    // 因为需要对参数做 URI encoding，否则如果参数中也带有hash或query，就会出错。
    const params = toJSON({
      path,
    }, toJsonOptions);
    return http.get('/file/download', {
      params,
      responseType: 'blob',  // 告诉 Axios 返回二进制 Blob 数据
    }).then((response) => {
      // 获取返回的 Content-Type 头，注意，response.headers 是一个 AxiosHeaders 对象，
      // 必须用 get 方法获取值，不能直接用下标，否则大小写不同的键名会被认为是不同的键
      const contentType = response.headers.get('Content-Type');
      // 获取返回的 Blob 数据
      const blob = new Blob([response.data], { type: contentType });
      // 创建一个临时 URL
      const url = window.URL.createObjectURL(blob);
      // 创建一个隐藏的 <a> 元素触发下载
      const a = window.document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // 从响应头中解析文件名（可选，后端需提供文件名）
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = extractContentDispositionFilename(contentDisposition) ?? 'downloaded_file';
      a.download = decodeURIComponent(filename);
      // 将 <a> 元素添加到 DOM，触发点击事件，然后移除
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      // 释放 URL
      window.URL.revokeObjectURL(url);
    });
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
