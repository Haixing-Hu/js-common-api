////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkArgumentType } from '@qubit-ltd/common-util';
import checkIdArgumentType from './check-id-argument-type';

/**
 * 检查指定的ID数组参数是否合法。
 *
 * @param {Array<string|number|bigint>} value
 *     要检查的ID数组参数的值。
 * @param {string} name
 *     该参数的名称，默认值为`ids`。
 * @throws TypeError
 *     如果`value`不是一个合法的ID数组，则抛出此异常。
 */
function checkIdArrayArgumentType(value, name = 'ids') {
  if ((typeof name !== 'string') && (!(name instanceof String))) {
    throw new TypeError('The name must be a string.');
  }
  checkArgumentType(name, value, Array);  
  // 检查数组中的每个元素是否为合法的ID
  if (value && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      checkIdArgumentType(value[i], `${name}[${i}]`);
    }
  }
}

export default checkIdArrayArgumentType; 