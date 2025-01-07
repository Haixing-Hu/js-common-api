////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkArgumentType } from '@qubit-ltd/common-util';

/**
 * 检查指定的查询条件参数是否合法。
 *
 * @param {object} criteria
 *     要检查的查询条件参数。
 * @param {Function|undefined} Class
 *     待检索的实体类的构造器函数，用于检查`criteria`中的属性是否对应于指定类的字段。若
 *     未提供此参数，则忽略。
 * @throws TypeError
 *     如果`criteria`不是一个合法的查询条件参数，则抛出此异常。
 */
function checkCriteriaArgument(criteria, Class = undefined) {
  checkArgumentType('criteria', criteria, Object);
  if ((typeof Class === 'function') && (criteria)) {
    // 检查`criteria`是否为指定类的字段
    const obj = new Class();
    const fields = Object.keys(obj);
    for (const field of fields) {
      // TODO: 实现检查
    }
  }
}

export default checkCriteriaArgument;
