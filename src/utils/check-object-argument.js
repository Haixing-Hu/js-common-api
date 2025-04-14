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
 * 检查指定的对象参数是否合法。
 *
 * @param {string} name
 *     要检查的参数的名称。
 * @param {object} obj
 *     要检查的参数的值。
 * @param {Array<object>} definition
 *     要检查的参数的属性定义。每个定义包含name（字段名）和type（类型）。
 *     例如：[{ name: 'field1', type: String }, { name: 'field2', type: Number }]
 * @param {boolean} nullable
 *     要检查的参数是否允许为`null`或`undefined`。
 * @throws TypeError
 *     如果`criteria`不是一个合法的查询条件参数，则抛出此异常。
 */
function checkObjectArgument(name, obj, definition = [], nullable = false) {
  if (obj === null) {
    if (!nullable) {
      throw new TypeError(`The value of the argument '${name}' cannot be null.`);
    }
    return;  // 允许null值时提前返回
  } else if (obj === undefined) {
    if (!nullable) {
      throw new TypeError(`The value of the argument '${name}' cannot be undefined.`);
    }
    return;  // 允许undefined值时提前返回
  }
  // 检查参数类型
  checkArgumentType(name, obj, Object);
  // 如果参数为空对象，直接返回
  if (Object.keys(obj).length === 0) {
    return;
  }
  // 如果没有提供definitions，也直接返回
  if (!Array.isArray(definition) || definition.length === 0) {
    return;
  }
  // 构建字段类型映射
  const fields = new Map();
  for (const def of definition) {
    if (def && typeof def.name === 'string' && def.type) {
      fields.set(def.name, def.type);
    }
  }
  // 检查criteria中的每个字段
  for (const [key, val] of Object.entries(obj)) {
    // 跳过null和undefined值
    if (val === null || val === undefined) {
      continue;
    }
    // 检查是否是定义的字段
    if (fields.has(key)) {
      checkArgumentType(`${name}.${key}`, val, fields.get(key));
    } else {
      throw new TypeError(`Unsupported field: "${name}.${key}"`);
    }
  }
}

export default checkObjectArgument;
