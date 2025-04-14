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
 * @param {Array<object>} criteriaDefinitions
 *     该API支持的查询条件定义数组。每个定义包含name（字段名）和type（类型）。
 *     例如：[{ name: 'field1', type: String }, { name: 'field2', type: Number }]
 * @throws TypeError
 *     如果`criteria`不是一个合法的查询条件参数，则抛出此异常。
 */
function checkCriteriaArgument(criteria, criteriaDefinitions = []) {
  // 接受 null 参数
  if (criteria === null) {
    return;
  }
  // 检查criteria参数类型
  checkArgumentType('criteria', criteria, Object);
  // 如果criteria为空对象，直接返回
  if (Object.keys(criteria).length === 0) {
    return;
  }
  // 如果没有提供criteriaDefinitions，也直接返回
  if (!Array.isArray(criteriaDefinitions) || criteriaDefinitions.length === 0) {
    return;
  }
  // 构建字段类型映射
  const definedFields = new Map();
  for (const def of criteriaDefinitions) {
    if (def && typeof def.name === 'string' && def.type) {
      definedFields.set(def.name, def.type);
    }
  }
  // 检查criteria中的每个字段
  for (const [key, value] of Object.entries(criteria)) {
    // 跳过null和undefined值
    if (value === null || value === undefined) {
      continue;
    }
    // 检查是否是定义的字段
    if (definedFields.has(key)) {
      checkArgumentType(`criteria.${key}`, value, definedFields.get(key));
    } else {
      throw new TypeError(`不支持的查询条件字段: "${key}"`);
    }
  }
}

export default checkCriteriaArgument;
