////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 从Content-Disposition头中提取文件名。
 *
 * @param {string} contentDisposition
 *     Content-Disposition 头的值。
 * @return {string|null}
 *     从Content-Disposition头中提取的文件名，如果提取失败，则返回`null`。
 */
function extractContentDispositionFilename(contentDisposition) {
  if (!contentDisposition) {
    return null;
  }
  const match = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)|filename="([^"]+)"/);
  if (match) {
    // 判断是哪种格式，选择对应的捕获组
    return match[1] ? decodeURIComponent(match[1]) : match[2];
  } else {
    return null;
  }
}

export default extractContentDispositionFilename;
