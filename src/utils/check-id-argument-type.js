////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkArgumentType } from '@haixing_hu/common-util';

/**
 * 检查指定的ID参数是否合法。
 *
 * @param {string|number|bigint} value
 *     要检查的ID参数的值。
 * @param {string} name
 *     该参数的名称，默认值为`id`。
 * @throws TypeError
 *     如果`value`不是一个合法的ID，则抛出此异常。
 */
function checkIdArgumentType(value, name = 'id') {
  if ((typeof name !== 'string') && (!(name instanceof String))) {
    throw new TypeError('The name must be a string.');
  }
  checkArgumentType(name, value, [String, Number, BigInt]);
}

export default checkIdArgumentType;
