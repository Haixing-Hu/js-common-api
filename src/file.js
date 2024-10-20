////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { Log, Logger } from '@haixing_hu/logging';

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
   * @param filename
   *     待上传的文件的原始文件名。
   * @param file
   *     待上传的文件对象。
   * @param contentType
   *     待上传文件的Content Type。可以为`null`或者`undefined`。
   * @return {Promise<Upload|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回根据上传的文件所创建的
   *     `Upload`对象；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  upload(filename, file, contentType = undefined) {
    const formData = new FormData();
    formData.append('filename', filename);
    if (contentType) {
      formData.append('contentType', contentType);
    }
    formData.append('file', file);
    return http.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 下载指定的文件。
   *
   * FIXME: 该如何处理返回的文件？
   *
   * @param path
   *     待下载文件在服务器上的相对路径。
   * @returns {Promise}
   *     一个`Promise`对象。
   */
  @Log
  download(path) {
    // 注意：我们没有采用直接拼接URL的方式带上query string，
    // 因为需要对参数做 URI encoding，否则如果参数中也带有hash或query，就会出错。
    const params = {
      path,
    };
    return http.get('/file/download', { params });
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
    const params = {
      path,
    };
    return http.get('/file/download/url', { params }).then((response) => {
      const url = String(response);
      logger.info('Successfully get the download URL for file %s:', path, url);
      return url;
    });
  }
}

const fileApi = new FileApi();

export default fileApi;
