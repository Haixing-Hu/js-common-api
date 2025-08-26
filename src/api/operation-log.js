////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { OperationLog, OperationLogInfo } from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import { getImpl, getInfoImpl } from './impl/get-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';

/**
 * 提供管理`OperationLog`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class OperationLogApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = OperationLog;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = OperationLogInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 执行的动作的名称
    { name: 'action', type: String },
    // 操作的目标资源的名称
    { name: 'resource', type: String },
    // 操作的目标资源的具体属性的名称
    { name: 'property', type: String },
    // 调用此操作的用户的用户名
    { name: 'username', type: String },
    // 调用此操作的用户的ID
    { name: 'userId', type: [String, Number, BigInt] },
    // 调用此操作的App的ID
    { name: 'appId', type: [String, Number, BigInt] },
    // 调用此操作的App的编码
    { name: 'appCode', type: String },
    // 操作是否成功
    { name: 'success', type: Boolean },
    // 操作失败时的错误类型
    { name: 'errorType', type: String },
    // 操作失败时的错误代码
    { name: 'errorCode', type: String },
    // 请求发生时间范围的（闭区间）起始值
    { name: 'requestTimeStart', type: String },
    // 请求发生时间范围的（闭区间）结束值
    { name: 'requestTimeEnd', type: String },
    // 响应发生时间范围的（闭区间）起始值
    { name: 'responseTimeStart', type: String },
    // 响应发生时间范围的（闭区间）结束值
    { name: 'responseTimeEnd', type: String },
    // 操作耗时范围的（闭区间）起始值，单位为毫秒
    { name: 'latencyStart', type: [Number, BigInt] },
    // 操作耗时范围的（闭区间）结束值，单位为毫秒
    { name: 'latencyEnd', type: [Number, BigInt] },
    // 发起请求的客户端IP
    { name: 'clientIp', type: String },
    // 请求的目标主机名
    { name: 'requestHost', type: String },
    // 调用时的HTTP方法
    { name: 'httpMethod', type: String },
    // 分布式链路ID
    { name: 'traceId', type: String },
    // 分布式Span ID
    { name: 'spanId', type: String },
    // 业务相关的关联ID
    { name: 'correlationId', type: String },
    // 网关/应用生成的请求ID
    { name: 'requestId', type: String },
    // API版本号
    { name: 'apiVersion', type: String },
    // API端点中应包含的字符串
    { name: 'endpoint', type: String },
    // 服务名/应用名
    { name: 'service', type: String },
    // 服务端主机名/节点ID
    { name: 'serviceHost', type: String },
    // 线程名
    { name: 'thread', type: String },
    // 实例ID（容器/Pod标识）
    { name: 'instance', type: String },
  ];

  /**
   * 列出符合条件的`OperationLog`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `action: string` 执行的动作的名称；
   *  - `resource: string` 操作的目标资源的名称；
   *  - `property: string` 操作的目标资源的具体属性的名称；
   *  - `username: string` 调用此操作的用户的用户名；
   *  - `userId: string|number|bigint` 调用此操作的用户的ID；
   *  - `appId: string|number|bigint` 调用此操作的App的ID；
   *  - `appCode: string` 调用此操作的App的编码；
   *  - `success: boolean` 操作是否成功；
   *  - `errorType: string` 操作失败时的错误类型；
   *  - `errorCode: string` 操作失败时的错误代码；
   *  - `requestTimeStart: string` 请求发生时间范围的（闭区间）起始值；
   *  - `requestTimeEnd: string` 请求发生时间范围的（闭区间）结束值；
   *  - `responseTimeStart: string` 响应发生时间范围的（闭区间）起始值；
   *  - `responseTimeEnd: string` 响应发生时间范围的（闭区间）结束值；
   *  - `latencyStart: number|bigint` 操作耗时范围的（闭区间）起始值，单位为毫秒；
   *  - `latencyEnd: number|bigint` 操作耗时范围的（闭区间）结束值，单位为毫秒；
   *  - `clientIp: string` 发起请求的客户端IP；
   *  - `requestHost: string` 请求的目标主机名；
   *  - `httpMethod: string` 调用时的HTTP方法；
   *  - `traceId: string` 分布式链路ID；
   *  - `spanId: string` 分布式Span ID；
   *  - `correlationId: string` 业务相关的关联ID；
   *  - `requestId: string` 网关/应用生成的请求ID；
   *  - `apiVersion: string` API版本号；
   *  - `endpoint: string` API端点中应包含的字符串；
   *  - `service: string` 服务名/应用名；
   *  - `serviceHost: string` 服务端主机名/节点ID；
   *  - `thread: string` 线程名；
   *  - `instance: string` 实例ID（容器/Pod标识）；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<OperationLog>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`OperationLog`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/system/operation-log/', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`OperationLog`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `action: string` 执行的动作的名称；
   *  - `resource: string` 操作的目标资源的名称；
   *  - `property: string` 操作的目标资源的具体属性的名称；
   *  - `username: string` 调用此操作的用户的用户名；
   *  - `userId: string|number|bigint` 调用此操作的用户的ID；
   *  - `appId: string|number|bigint` 调用此操作的App的ID；
   *  - `appCode: string` 调用此操作的App的编码；
   *  - `success: boolean` 操作是否成功；
   *  - `errorType: string` 操作失败时的错误类型；
   *  - `errorCode: string` 操作失败时的错误代码；
   *  - `requestTimeStart: string` 请求发生时间范围的（闭区间）起始值；
   *  - `requestTimeEnd: string` 请求发生时间范围的（闭区间）结束值；
   *  - `responseTimeStart: string` 响应发生时间范围的（闭区间）起始值；
   *  - `responseTimeEnd: string` 响应发生时间范围的（闭区间）结束值；
   *  - `latencyStart: number|bigint` 操作耗时范围的（闭区间）起始值，单位为毫秒；
   *  - `latencyEnd: number|bigint` 操作耗时范围的（闭区间）结束值，单位为毫秒；
   *  - `clientIp: string` 发起请求的客户端IP；
   *  - `requestHost: string` 请求的目标主机名；
   *  - `httpMethod: string` 调用时的HTTP方法；
   *  - `traceId: string` 分布式链路ID；
   *  - `spanId: string` 分布式Span ID；
   *  - `correlationId: string` 业务相关的关联ID；
   *  - `requestId: string` 网关/应用生成的请求ID；
   *  - `apiVersion: string` API版本号；
   *  - `endpoint: string` API端点中应包含的字符串；
   *  - `service: string` 服务名/应用名；
   *  - `serviceHost: string` 服务端主机名/节点ID；
   *  - `thread: string` 线程名；
   *  - `instance: string` 实例ID（容器/Pod标识）；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<OperationLogInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`OperationLog`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/system/operation-log/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`OperationLog`对象。
   *
   * @param {string|number|bigint} id
   *     `OperationLog`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<OperationLog|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`OperationLog`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/system/operation-log/{id}', id, showLoading);
  }

  /**
   * 根据ID，获取指定的`OperationLog`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `OperationLog`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<OperationLogInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`OperationLogInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/system/operation-log/{id}/info', id, showLoading);
  }
}

const operationLogApi = new OperationLogApi();

export default operationLogApi;
