////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Address,
  CredentialType,
  Device,
  DeviceInfo,
  Hardware,
  Location,
  PersonInfo,
  State,
} from '@qubit-ltd/common-model';
import { HasLogger, Log } from '@qubit-ltd/logging';
import addImpl from './impl/add-impl';
import {
  batchDeleteImpl,
  deleteByKeyImpl,
  deleteImpl,
} from './impl/delete-impl';
import { batchEraseImpl, eraseByKeyImpl, eraseImpl } from './impl/erase-impl';
import exportImpl from './impl/export-impl';
import {
  getByKeyImpl,
  getImpl,
  getInfoByKeyImpl,
  getInfoImpl,
} from './impl/get-impl';
import importImpl from './impl/import-impl';
import { listImpl, listInfoImpl } from './impl/list-impl';
import {
  batchPurgeImpl,
  purgeAllImpl,
  purgeByKeyImpl,
  purgeImpl,
} from './impl/purge-impl';
import {
  batchRestoreImpl,
  restoreByKeyImpl,
  restoreImpl,
} from './impl/restore-impl';
import {
  updateByKeyImpl,
  updateImpl,
  updatePropertyByKeyImpl,
  updatePropertyImpl,
} from './impl/update-impl';

/**
 * 提供管理`Device`对象的API。
 *
 * @author 胡海星
 */
@HasLogger
class DeviceApi {
  /**
   * 此API所管理的实体对象的类。
   *
   * @type {Function}
   */
  entityClass = Device;

  /**
   * 此API所管理的实体对象的基本信息的类。
   *
   * @type {Function}
   */
  entityInfoClass = DeviceInfo;

  /**
   * 查询条件定义
   *
   * @type {Array<Object>}
   */
  CRITERIA_DEFINITIONS = [
    // 所属应用的ID
    { name: 'appId', type: [String, Number, BigInt] },
    // 所属应用的编码
    { name: 'appCode', type: String },
    // 所属应用的名称中应包含的字符串
    { name: 'appName', type: String },
    // 设备名称中应包含的字符串
    { name: 'name', type: String },
    // 所有者ID
    { name: 'ownerId', type: [String, Number, BigInt] },
    // 所有者的用户名
    { name: 'ownerUsername', type: String },
    // 所有者的姓名
    { name: 'ownerName', type: String },
    // 所有者的手机号码
    { name: 'ownerMobile', type: String },
    // 所有者的证件类型
    { name: 'ownerCredentialType', type: [CredentialType, String] },
    // 所有者的证件号码
    { name: 'ownerCredentialNumber', type: String },
    // 设备IP地址
    { name: 'ipAddress', type: String },
    // 设备部署地址所在国家的ID
    { name: 'countryId', type: [String, Number, BigInt] },
    // 设备部署地址所在国家的编码
    { name: 'countryCode', type: String },
    // 设备部署地址所在国家的名称中应包含的字符串
    { name: 'countryName', type: String },
    // 设备部署地址所在省份的ID
    { name: 'provinceId', type: [String, Number, BigInt] },
    // 设备部署地址所在省份的编码
    { name: 'provinceCode', type: String },
    // 设备部署地址所在省份的名称中应包含的字符串
    { name: 'provinceName', type: String },
    // 设备部署地址所在城市的ID
    { name: 'cityId', type: [String, Number, BigInt] },
    // 设备部署地址所在城市的编码
    { name: 'cityCode', type: String },
    // 设备部署地址所在城市的名称中应包含的字符串
    { name: 'cityName', type: String },
    // 设备部署地址所在区县的ID
    { name: 'districtId', type: [String, Number, BigInt] },
    // 设备部署地址所在区县的编码
    { name: 'districtCode', type: String },
    // 设备部署地址所在区县的名称中应包含的字符串
    { name: 'districtName', type: String },
    // 设备部署地址所在街道的ID
    { name: 'streetId', type: [String, Number, BigInt] },
    // 设备部署地址所在街道的编码
    { name: 'streetCode', type: String },
    // 设备部署地址所在街道的名称中应包含的字符串
    { name: 'streetName', type: String },
    // 设备注册时间范围的（闭区间）起始值
    { name: 'registerTimeStart', type: String },
    // 设备注册时间范围的（闭区间）结束值
    { name: 'registerTimeEnd', type: String },
    // 设备最后一次启动时间范围的（闭区间）起始值
    { name: 'lastStartupTimeStart', type: String },
    // 设备最后一次启动时间范围的（闭区间）结束值
    { name: 'lastStartupTimeEnd', type: String },
    // 设备最后一次心跳连接时间范围的（闭区间）起始值
    { name: 'lastHeartbeatTimeStart', type: String },
    // 设备最后一次心跳连接时间范围的（闭区间）结束值
    { name: 'lastHeartbeatTimeEnd', type: String },
    // 设备状态
    { name: 'state', type: [State, String] },
    // 是否已经被标记删除
    { name: 'deleted', type: Boolean },
    // 创建时间范围的（闭区间）起始值
    { name: 'createTimeStart', type: String },
    // 创建时间范围的（闭区间）结束值
    { name: 'createTimeEnd', type: String },
    // 修改时间范围的（闭区间）起始值
    { name: 'modifyTimeStart', type: String },
    // 修改时间范围的（闭区间）结束值
    { name: 'modifyTimeEnd', type: String },
    // 标记删除时间范围的（闭区间）起始值
    { name: 'deleteTimeStart', type: String },
    // 标记删除时间范围的（闭区间）结束值
    { name: 'deleteTimeEnd', type: String },
  ];

  /**
   * 列出符合条件的`Device`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `name: string` 设备名称中应包含的字符串；
   *  - `ownerId: string|number|bigint` 所有者ID；
   *  - `ownerUsername: string` 所有者的用户名；
   *  - `ownerName: string` 所有者的姓名；
   *  - `ownerMobile: string` 所有者的手机号码；
   *  - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *  - `ownerCredentialNumber: string` 所有者的证件号码；
   *  - `ipAddress: string` 设备IP地址；
   *  - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *  - `countryCode: string` 设备部署地址所在国家的编码；
   *  - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *  - `provinceCode: string` 设备部署地址所在省份的编码；
   *  - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *  - `cityCode: string` 设备部署地址所在城市的编码；
   *  - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *  - `districtCode: string` 设备部署地址所在区县的编码；
   *  - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *  - `streetCode: string` 设备部署地址所在街道的编码；
   *  - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *  - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *  - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *  - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *  - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *  - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *  - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *  - `state: State|string` 设备状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Device>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Device`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listImpl(this, '/device', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 列出符合条件的`Device`对象的基本信息。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `name: string` 设备名称中应包含的字符串；
   *  - `ownerId: string|number|bigint` 所有者ID；
   *  - `ownerUsername: string` 所有者的用户名；
   *  - `ownerName: string` 所有者的姓名；
   *  - `ownerMobile: string` 所有者的手机号码；
   *  - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *  - `ownerCredentialNumber: string` 所有者的证件号码；
   *  - `ipAddress: string` 设备IP地址；
   *  - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *  - `countryCode: string` 设备部署地址所在国家的编码；
   *  - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *  - `provinceCode: string` 设备部署地址所在省份的编码；
   *  - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *  - `cityCode: string` 设备部署地址所在城市的编码；
   *  - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *  - `districtCode: string` 设备部署地址所在区县的编码；
   *  - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *  - `streetCode: string` 设备部署地址所在街道的编码；
   *  - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *  - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *  - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *  - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *  - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *  - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *  - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *  - `state: State|string` 设备状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<DeviceInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Device`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listInfo(pageRequest = {}, criteria = {}, sortRequest = {}, showLoading = true) {
    return listInfoImpl(this, '/device/info', pageRequest, criteria, sortRequest, showLoading);
  }

  /**
   * 根据ID，获取指定的`Device`对象。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    return getImpl(this, '/device/{id}', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Device`对象。
   *
   * @param {string} code
   *     `Device`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code, showLoading = true) {
    return getByKeyImpl(this, '/device/code/{code}', 'code', code, showLoading);
  }

  /**
   * 根据ID，获取指定的`Device`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DeviceInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DeviceInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfo(id, showLoading = true) {
    return getInfoImpl(this, '/device/{id}/info', id, showLoading);
  }

  /**
   * 根据代码，获取指定的`Device`对象的基本信息。
   *
   * @param {string} code
   *     `Device`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<DeviceInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DeviceInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getInfoByCode(code, showLoading = true) {
    return getInfoByKeyImpl(this, '/device/code/{code}/info', 'code', code, showLoading);
  }

  /**
   * 添加一个`Device`对象。
   *
   * @param {Device|object} entity
   *     要添加的`Device`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(entity, showLoading = true) {
    return addImpl(this, '/device', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象。
   *
   * @param {Device|object} entity
   *     要更新的`Device`对象的数据，根据其ID确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(entity, showLoading = true) {
    return updateImpl(this, '/device/{id}', entity, showLoading);
  }

  /**
   * 根据代码，更新一个`Device`对象。
   *
   * @param {Device} entity
   *     要更新的`Device`对象的数据，根据其代码确定要更新的对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(entity, showLoading = true) {
    return updateByKeyImpl(this, '/device/code/{code}', 'code', entity, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的硬件信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Hardware|object} hardware
   *     待更新的`Device`对象的硬件信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateHardware(id, hardware, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/hardware', id, 'hardware', Hardware, hardware, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的操作系统信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Software|object} operatingSystem
   *     待更新的`Device`对象的操作系统信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateOperatingSystem(id, operatingSystem, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/operating-system', id, 'operatingSystem', Object, operatingSystem, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的软件信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Array<Software|object>} softwares
   *     待更新的`Device`对象的软件信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateSoftwares(id, softwares, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/softwares', id, 'softwares', Array, softwares, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的部署地址。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Address|object} deployAddress
   *     待更新的`Device`对象的部署地址。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateDeployAddress(id, deployAddress, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/deploy-address', id, 'deployAddress', Address, deployAddress, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的地理位置坐标。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Location|object} location
   *     待更新的`Device`对象的地理位置坐标。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLocation(id, location, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/location', id, 'location', Location, location, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的IP地址。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} ipAddress
   *     待更新的`Device`对象的IP地址。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateIpAddress(id, ipAddress, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/ip-address', id, 'ipAddress', String, ipAddress, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的所有者。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {PersonInfo|object} owner
   *     待更新的`Device`对象的所有者。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateOwner(id, owner, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/owner', id, 'owner', PersonInfo, owner, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的最后一次启动时间。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} lastStartupTime
   *     待更新的`Device`对象的最后一次启动时间。该参数值为UTC时间戳，以ISO-8601时间戳的形
   *     式表示为字符串，其格式为`"uuuu-MM-dd[[' ']['T']HH:mm[':'ss[.SSS]]][' ']['Z'][Z][z]"`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLastStartupTime(id, lastStartupTime, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/last-startup-time', id, 'lastStartupTime', String, lastStartupTime, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的最后一次心跳时间。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} lastHeartbeatTime
   *     待更新的`Device`对象的最后一次心跳时间。该参数值为UTC时间戳，以ISO-8601时间戳的形
   *     式表示为字符串，其格式为`"uuuu-MM-dd[[' ']['T']HH:mm[':'ss[.SSS]]][' ']['Z'][Z][z]"`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLastHeartbeatTime(id, lastHeartbeatTime, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/last-heartbeat-time', id, 'lastHeartbeatTime', String, lastHeartbeatTime, showLoading);
  }

  /**
   * 根据ID，更新一个`Device`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @param {State|string} state
   *     要更新的`Device`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state, showLoading = true) {
    return updatePropertyImpl(this, '/device/{id}/state', id, 'state', State, state, showLoading);
  }

  /**
   * 根据代码，更新一个`Device`对象的状态。
   *
   * @param {string} code
   *     要更新的`Device`对象的代码。
   * @param {State|string} state
   *     要更新的`Device`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state, showLoading = true) {
    return updatePropertyByKeyImpl(this, '/device/code/{code}/state', 'code', code, 'state', State, state, showLoading);
  }

  /**
   * 根据ID，标记删除一个`Device`对象。
   *
   * @param {string|number|bigint} id
   *     要标记删除的`Device`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id, showLoading = true) {
    return deleteImpl(this, '/device/{id}', id, showLoading);
  }

  /**
   * 根据代码，标记删除一个`Device`对象。
   *
   * @param {string} code
   *     要标记删除的`Device`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code, showLoading = true) {
    return deleteByKeyImpl(this, '/device/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量标记删除指定的`Device`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量删除的`Device`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回被标记删除的记录数；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchDelete(ids, showLoading = true) {
    return batchDeleteImpl(this, '/device/batch', ids, showLoading);
  }

  /**
   * 根据ID，恢复一个被标记删除的`Device`对象。
   *
   * @param {string|number|bigint} id
   *     要恢复的`Device`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id, showLoading = true) {
    return restoreImpl(this, '/device/{id}', id, showLoading);
  }

  /**
   * 根据代码，恢复一个被标记删除的`Device`对象。
   *
   * @param {string} code
   *     要恢复的`Device`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code, showLoading = true) {
    return restoreByKeyImpl(this, '/device/code/{code}', 'code', code, showLoading);
  }

  /**
   * 批量恢复已被标记删除的`Device`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量恢复的已被标记删除的`Device`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际恢复的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchRestore(ids, showLoading = true) {
    return batchRestoreImpl(this, '/device/batch', ids, showLoading);
  }

  /**
   * 根据ID，清除一个被标记删除的`Device`对象。
   *
   * @param {string|number|bigint} id
   *     要清除的`Device`对象的ID，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id, showLoading = true) {
    return purgeImpl(this, '/device/{id}/purge', id, showLoading);
  }

  /**
   * 根据代码，清除一个被标记删除的`Device`对象。
   *
   * @param {string} code
   *     要清除的`Device`对象的代码，该对象必须已经被标记删除。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code, showLoading = true) {
    return purgeByKeyImpl(this, '/device/code/{code}/purge', 'code', code, showLoading);
  }

  /**
   * 彻底清除全部已被标记删除的`Device`对象。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll(showLoading = true) {
    return purgeAllImpl(this, '/device/purge', showLoading);
  }

  /**
   * 批量彻底清除已被标记删除的`Device`对象。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的已被标记删除的`Device`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际被彻底清除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchPurge(ids, showLoading = true) {
    return batchPurgeImpl(this, '/device/batch/purge', ids, showLoading);
  }

  /**
   * 彻底清除指定的`Device`对象（无论其是否被标记删除）。
   *
   * @param {string|number|bigint} id
   *     要彻底清除的`Device`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  erase(id, showLoading = true) {
    return eraseImpl(this, '/device/{id}/erase', id, showLoading);
  }

  /**
   * 根据代码，彻底清除指定的`Device`对象（无论其是否被标记删除）。
   *
   * @param {string} code
   *     要彻底清除的`Device`对象的代码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  eraseByCode(code, showLoading = true) {
    return eraseByKeyImpl(this, '/device/code/{code}/erase', 'code', code, showLoading);
  }

  /**
   * 批量彻底清除指定的`Device`对象（无论其是否被标记删除）。
   *
   * @param {Array<string|number|bigint>} ids
   *     待批量彻底清除的`Device`对象的ID列表。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回实际删除的实体的数目；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  batchErase(ids, showLoading = true) {
    return batchEraseImpl(this, '/device/batch/erase', ids, showLoading);
  }

  /**
   * 导出符合条件的`Device`对象为XML文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `name: string` 设备名称中应包含的字符串；
   *  - `ownerId: string|number|bigint` 所有者ID；
   *  - `ownerUsername: string` 所有者的用户名；
   *  - `ownerName: string` 所有者的姓名；
   *  - `ownerMobile: string` 所有者的手机号码；
   *  - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *  - `ownerCredentialNumber: string` 所有者的证件号码；
   *  - `ipAddress: string` 设备IP地址；
   *  - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *  - `countryCode: string` 设备部署地址所在国家的编码；
   *  - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *  - `provinceCode: string` 设备部署地址所在省份的编码；
   *  - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *  - `cityCode: string` 设备部署地址所在城市的编码；
   *  - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *  - `districtCode: string` 设备部署地址所在区县的编码；
   *  - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *  - `streetCode: string` 设备部署地址所在街道的编码；
   *  - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *  - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *  - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *  - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *  - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *  - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *  - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *  - `state: State|string` 设备状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportXml(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/device/export/xml', 'XML', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 导出符合条件的`Device`对象为JSON文件。
   *
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `name: string` 设备名称中应包含的字符串；
   *  - `ownerId: string|number|bigint` 所有者ID；
   *  - `ownerUsername: string` 所有者的用户名；
   *  - `ownerName: string` 所有者的姓名；
   *  - `ownerMobile: string` 所有者的手机号码；
   *  - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *  - `ownerCredentialNumber: string` 所有者的证件号码；
   *  - `ipAddress: string` 设备IP地址；
   *  - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *  - `countryCode: string` 设备部署地址所在国家的编码；
   *  - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *  - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *  - `provinceCode: string` 设备部署地址所在省份的编码；
   *  - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *  - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *  - `cityCode: string` 设备部署地址所在城市的编码；
   *  - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *  - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *  - `districtCode: string` 设备部署地址所在区县的编码；
   *  - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *  - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *  - `streetCode: string` 设备部署地址所在街道的编码；
   *  - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *  - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *  - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *  - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *  - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *  - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *  - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *  - `state: State|string` 设备状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} autoDownload
   *     是否自动下载文件。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<string|null|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功，如果`autoDownload`设置为`true`，
   *     浏览器会自动下载导出的文件，并返回`null`，否则返回导出的文件的 Blob URL（注意：
   *     这个Blob URL稍后需要通过`window.URL.revokeObjectURL(url)`释放）；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  exportJson(criteria = {}, sortRequest = {}, autoDownload = true, showLoading = true) {
    return exportImpl(this, '/device/export/json', 'JSON', criteria, sortRequest, autoDownload, showLoading);
  }

  /**
   * 从XML文件导入`Device`对象。
   *
   * @param {File} file
   *     XML文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Device`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importXml(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/device/import/xml', 'XML', file, parallel, threads, showLoading);
  }

  /**
   * 从JSON文件导入`Device`对象。
   *
   * @param {File} file
   *     JSON文件对象。
   * @param {boolean} parallel
   *     是否并行导入。如果为`true`，则并行导入；否则，单线程导入。默认值为`false`。
   * @param {number} threads
   *     并行导入的线程数。若`parallel`为`false`，此参数无效。若此参数为`null`，
   *     则使用默认线程数。默认线程数由当前系统的CPU核心数决定。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<number|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回成功导入的`Device`对象的数量；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  importJson(file, parallel = false, threads = null, showLoading = true) {
    return importImpl(this, '/device/import/json', 'JSON', file, parallel, threads, showLoading);
  }
}

const deviceApi = new DeviceApi();

export default deviceApi;
