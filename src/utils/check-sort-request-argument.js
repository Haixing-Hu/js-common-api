////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkArgumentType } from '@qubit-ltd/common-util';
import { SortRequest, SortOrder } from '@qubit-ltd/common-model';

/**
 * 检查指定的排序请求参数是否合法。
 *
 * @param {SortRequest|object} sortRequest
 *     要检查的排序请求参数。
 * @param {Function|undefined} Class
 *     待检索的实体类的构造器函数，用于检查`sortRequest.sortField`是否为指定类的字段。若
 *     未提供此参数，则忽略。
 * @throws TypeError
 *     如果`pageRequest`不是一个合法的排序请求参数，则抛出此异常。
 */
function checkSortRequestArgument(sortRequest, Class = undefined) {
  checkArgumentType('sortRequest', sortRequest, [SortRequest, Object]);
  checkArgumentType('sortRequest.sortField', sortRequest.sortField, String, true);
  checkArgumentType('sortRequest.sortOrder', sortRequest.sortOrder, [SortOrder, String], true);
  if ((typeof Class === 'function') && (sortRequest.sortField)) {
    // 检查`sortRequest.sortField`是否为指定类的字段
    const obj = new Class();
    const fields = Object.keys(obj);
    if (!fields.includes(sortRequest.sortField)) {
      throw new TypeError(`The sort field '${sortRequest.sortField}' is not a field of the class ${Class.name}.`);
    }
  }
}

export default checkSortRequestArgument;
