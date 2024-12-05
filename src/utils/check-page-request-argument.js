////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkArgumentType } from '@haixing_hu/common-util';
import { PageRequest } from '@haixing_hu/common-model';

/**
 * 检查指定的分页请求参数是否合法。
 *
 * @param {PageRequest|object} pageRequest
 *     要检查的分页请求参数。
 * @throws TypeError
 *     如果`pageRequest`不是一个合法的分页请求参数，则抛出此异常。
 */
function checkPageRequestArgument(pageRequest) {
  checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
  checkArgumentType('pageRequest.pageIndex', pageRequest.pageIndex, Number, true);
  checkArgumentType('pageRequest.pageSize', pageRequest.pageSize, Number, true);
}

export default checkPageRequestArgument;
