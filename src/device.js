////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { stringifyId, toJSON } from '@haixing_hu/common-decorator';
import {
  Address,
  Device,
  DeviceInfo,
  Hardware,
  Location,
  Page,
  PageRequest, PersonInfo, Software, State,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('DeviceApi');

/**
 * 提供管理`Device`对象的API。
 *
 * @author 胡海星
 */
class DeviceApi {
  /**
   * 列出符合条件的`Device`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `appId: string|number|bigint` 所属应用的ID；
   *     - `appCode: string` 所属应用的编码；
   *     - `appName: string` 所属应用的名称中应包含的字符串；
   *     - `name: string` 设备名称中应包含的字符串；
   *     - `ownerId: string|number|bigint` 所有者ID；
   *     - `ownerUsername: string` 所有者的用户名；
   *     - `ownerName: string` 所有者的姓名；
   *     - `ownerMobile: string` 所有者的手机号码；
   *     - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *     - `ownerCredentialNumber: string` 所有者的证件号码；
   *     - `ipAddress: string` 设备IP地址；
   *     - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *     - `countryCode: string` 设备部署地址所在国家的编码；
   *     - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *     - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *     - `provinceCode: string` 设备部署地址所在省份的编码；
   *     - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *     - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *     - `cityCode: string` 设备部署地址所在城市的编码；
   *     - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *     - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *     - `districtCode: string` 设备部署地址所在区县的编码；
   *     - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *     - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *     - `streetCode: string` 设备部署地址所在街道的编码；
   *     - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *     - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *     - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *     - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *     - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *     - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *     - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *     - `state: State|string` 设备状态；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<Device>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Device`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/device', {
      params,
    }).then((obj) => {
      const page = Page.create(obj, assignOptions);
      page.content = Device.createArray(page.content, assignOptions);
      logger.deviceInfo('Successfully list the Device.');
      logger.debug('The page of Device is:', page);
      return page;
    });
  }

  /**
   * 列出符合条件的`Device`对象的基本信息。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *     - `appId: string|number|bigint` 所属应用的ID；
   *     - `appCode: string` 所属应用的编码；
   *     - `appName: string` 所属应用的名称中应包含的字符串；
   *     - `name: string` 设备名称中应包含的字符串；
   *     - `ownerId: string|number|bigint` 所有者ID；
   *     - `ownerUsername: string` 所有者的用户名；
   *     - `ownerName: string` 所有者的姓名；
   *     - `ownerMobile: string` 所有者的手机号码；
   *     - `ownerCredentialType: string|CredentialType` 所有者的证件类型；
   *     - `ownerCredentialNumber: string` 所有者的证件号码；
   *     - `ipAddress: string` 设备IP地址；
   *     - `countryId: string|number|bigint` 设备部署地址所在国家的ID；
   *     - `countryCode: string` 设备部署地址所在国家的编码；
   *     - `countryName: string` 设备部署地址所在国家的名称中应包含的字符串；
   *     - `provinceId: string|number|bigint` 设备部署地址所在省份的ID；
   *     - `provinceCode: string` 设备部署地址所在省份的编码；
   *     - `provinceName: string` 设备部署地址所在省份的名称中应包含的字符串；
   *     - `cityId: string|number|bigint` 设备部署地址所在城市的ID；
   *     - `cityCode: string` 设备部署地址所在城市的编码；
   *     - `cityName: string` 设备部署地址所在城市的名称中应包含的字符串；
   *     - `districtId: string|number|bigint` 设备部署地址所在区县的ID；
   *     - `districtCode: string` 设备部署地址所在区县的编码；
   *     - `districtName: string` 设备部署地址所在区县的名称中应包含的字符串；
   *     - `streetId: string|number|bigint` 设备部署地址所在街道的ID；
   *     - `streetCode: string` 设备部署地址所在街道的编码；
   *     - `streetName: string` 设备部署地址所在街道的名称中应包含的字符串；
   *     - `registerTimeStart: string`设备注册时间范围的（闭区间）起始值；
   *     - `registerTimeEnd: string` 设备注册时间范围的（闭区间）结束值；
   *     - `lastStartupTimeStart: string`设备最后一次启动时间范围的（闭区间）起始值；
   *     - `lastStartupTimeEnd: string` 设备最后一次启动时间范围的（闭区间）结束值；
   *     - `lastHeartbeatTimeStart: string` 设备最后一次心跳连接时间范围的（闭区间）起始值；
   *     - `lastHeartbeatTimeEnd: string` 设备最后一次心跳连接时间范围的（闭区间）结束值；
   *     - `state: State|string` 设备状态；
   *     - `deleted: boolean` 是否已经被标记删除；
   *     - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *     - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *     - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *     - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *     - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *     - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序。允许的条件包括：
   *     - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *     - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @return {Promise<Page<DeviceInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Device`对象的基本信息的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  listDeviceInfo(pageRequest, criteria = {}, sort = {}) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    loading.showGetting();
    return http.get('/device/info', {
      params,
    }).then((obj) => {
      const page = Page.create(obj);
      page.content = DeviceInfo.createArray(page.content);
      logger.deviceInfo('Successfully list the info of Device.');
      logger.debug('The page of info of Device is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Device`对象。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/device/${stringifyId(id)}}`).then((obj) => {
      const result = Device.create(obj, assignOptions);
      logger.deviceInfo('Successfully get the Device by ID:', id);
      logger.debug('The Device is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Device`对象。
   *
   * @param {string} code
   *     `Device`对象的编码。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/device/code/${code}`).then((obj) => {
      const result = Device.create(obj, assignOptions);
      logger.deviceInfo('Successfully get the Device by code:', code);
      logger.debug('The Device is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Device`对象的基本信息。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @return {Promise<DeviceInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DeviceInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getDeviceInfo(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showGetting();
    return http.get(`/device/${stringifyId(id)}/info`).then((obj) => {
      const result = DeviceInfo.create(obj, assignOptions);
      logger.deviceInfo('Successfully get the info of the Device by ID:', id);
      logger.debug('The deviceInfo of the Device is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Device`对象的基本信息。
   *
   * @param {string} code
   *     `Device`对象的编码。
   * @return {Promise<DeviceInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`DeviceInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getDeviceInfoByCode(code) {
    checkArgumentType('code', code, String);
    loading.showGetting();
    return http.get(`/device/code/${code}/info`).then((obj) => {
      const result = DeviceInfo.create(obj, assignOptions);
      logger.deviceInfo('Successfully get the info of the Device by code:', code);
      logger.debug('The deviceInfo of the Device is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Device`对象。
   *
   * @param {Device} device
   *     要添加的`Device`对象。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(device) {
    checkArgumentType('device', device, Device);
    const data = toJSON(device, toJsonOptions);
    loading.showAdding();
    return http.post('/device', data).then((obj) => {
      const result = Device.create(obj, assignOptions);
      logger.deviceInfo('Successfully add the Device:', result.id);
      logger.debug('The added Device is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象。
   *
   * @param {Device} device
   *     要更新的`Device`对象的数据，根据其ID确定要更新的对象。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  update(device) {
    checkArgumentType('device', device, Device);
    const id = stringifyId(device.id);
    const data = toJSON(device, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${id}`, data).then((obj) => {
      const result = Device.create(obj, assignOptions);
      logger.deviceInfo('Successfully update the Device by ID %s at:', id, result.modifyTime);
      logger.debug('The updated Device is:', result);
      return result;
    });
  }

  /**
   * 根据编码，更新一个`Device`对象。
   *
   * @param {Device} device
   *     要更新的`Device`对象的数据，根据其编码确定要更新的对象。
   * @return {Promise<Device|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新后的`Device`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateByCode(device) {
    checkArgumentType('device', device, Device);
    const data = toJSON(device, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/code/${device.code}`, data).then((obj) => {
      const result = Device.create(obj, assignOptions);
      logger.deviceInfo('Successfully update the Device by code "%s" at:', result.code, result.modifyTime);
      logger.debug('The updated Device is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的硬件信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Hardware} hardware
   *     待更新的`Device`对象的硬件信息。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateHardware(id, hardware) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('hardware', hardware, Hardware);
    const data = toJSON(hardware, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/hardware`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the hardware of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的操作系统信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Software} operatingSystem
   *     待更新的`Device`对象的操作系统信息。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateOperatingSystem(id, operatingSystem) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('operatingSystem', operatingSystem, Software);
    const data = toJSON(operatingSystem, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/operating-system`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the operating system of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的软件信息。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Array<Software>} softwares
   *     待更新的`Device`对象的软件信息。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateSoftwares(id, softwares) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('softwares', softwares, Array);
    const data = toJSON(softwares, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/softwares`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the softwares of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的部署地址。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Address} deployAddress
   *     待更新的`Device`对象的部署地址。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateDeployAddress(id, deployAddress) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('deployAddress', deployAddress, Address);
    const data = toJSON(deployAddress, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/deploy-address`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the deploy address of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的地理位置坐标。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {Location} location
   *     待更新的`Device`对象的地理位置坐标。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLocation(id, location) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('location', location, Location);
    const data = toJSON(location, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/location`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the location of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的IP地址。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} ipAddress
   *     待更新的`Device`对象的IP地址。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateIpAddress(id, ipAddress) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('ipAddress', ipAddress, String);
    const data = toJSON(ipAddress, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/ip-address`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the IP address of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的所有者。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {PersonInfo} owner
   *     待更新的`Device`对象的所有者。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateOwner(id, owner) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('owner', owner, PersonInfo);
    const data = toJSON(owner, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/owner`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the owner of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的最后一次启动时间。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} lastStartupTime
   *     待更新的`Device`对象的最后一次启动时间。该参数值为UTC时间戳，以ISO-8601时间戳的形
   *     式表示为字符串，其格式为`"uuuu-MM-dd[[' ']['T']HH:mm[':'ss[.SSS]]][' ']['Z'][Z][z]"`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLastStartupTime(id, lastStartupTime) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('lastStartupTime', lastStartupTime, String);
    const data = toJSON(lastStartupTime, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/last-startup-time`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the last startup time of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的IP地址。
   *
   * @param {string|number|bigint} id
   *     待更新的`Device`对象的ID。
   * @param {string} lastHeartbeatTime
   *     待更新的`Device`对象的最后一次启动时间。该参数值为UTC时间戳，以ISO-8601时间戳的形
   *     式表示为字符串，其格式为`"uuuu-MM-dd[[' ']['T']HH:mm[':'ss[.SSS]]][' ']['Z'][Z][z]"`。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回更新的时间戳；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateLastHeartbeatTime(id, lastHeartbeatTime) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('lastHeartbeatTime', lastHeartbeatTime, String);
    const data = toJSON(lastHeartbeatTime, toJsonOptions);
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/last-heartbeat-time`, data).then((timestamp) => {
      logger.deviceInfo('Successfully update the last heartbeat time of the Device %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，更新一个`Device`对象的状态。
   *
   * @param {string|number|bigint} id
   *     `Device`对象的ID。
   * @param {State|string} state
   *     要更新的`Device`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateState(id, state) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('state', state, [State, String]);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/device/${stringifyId(id)}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the App by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，更新一个`Device`对象的状态。
   *
   * @param {string} code
   *     要更新的`Device`对象的编码。
   * @param {State|string} state
   *     要更新的`Device`对象的状态，必须是`State`枚举类型或表示其值的字符串。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据更新的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateStateByCode(code, state) {
    checkArgumentType('code', code, String);
    checkArgumentType('state', state, [State, String]);
    const data = { state: String(state) };
    loading.showUpdating();
    return http.put(`/device/code/${code}/state`, data).then((timestamp) => {
      logger.info('Successfully update the state of the App by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，标记删除一个`Device`对象。
   *
   * @param {string} id
   *     要标记删除的`Device`对象的ID。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  delete(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showDeleting();
    return http.delete(`/device/${stringifyId(id)}`).then((timestamp) => {
      logger.deviceInfo('Successfully delete the Device by ID %s at:', id, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据编码，标记删除一个`Device`对象。
   *
   * @param {string} code
   *     要标记删除的`Device`对象的编码。
   * @return {Promise<string|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回数据被标记删除的UTC时间戳，
   *     以ISO-8601格式表示为字符串；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  deleteByCode(code) {
    checkArgumentType('code', code, String);
    loading.showDeleting();
    return http.delete(`/device/code/${code}`).then((timestamp) => {
      logger.deviceInfo('Successfully delete the Device by code "%s" at:', code, timestamp);
      return timestamp;
    });
  }

  /**
   * 根据ID，恢复一个被标记删除的`Device`对象。
   *
   * @param {string} id
   *     要恢复的`Device`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restore(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showRestoring();
    return http.patch(`/device/${stringifyId(id)}`)
      .then(() => logger.deviceInfo('Successfully restore the Device by ID:', id));
  }

  /**
   * 根据编码，恢复一个被标记删除的`Device`对象。
   *
   * @param {string} code
   *     要恢复的`Device`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  restoreByCode(code) {
    checkArgumentType('code', code, String);
    loading.showRestoring();
    return http.patch(`/device/code/${code}`)
      .then(() => logger.deviceInfo('Successfully restore the Device by code:', code));
  }

  /**
   * 根据ID，清除一个被标记删除的`Device`对象。
   *
   * @param {string} id
   *     要清除的`Device`对象的ID，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purge(id) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    loading.showPurging();
    return http.delete(`/device/${stringifyId(id)}/purge`)
      .then(() => logger.deviceInfo('Successfully purge the Device by ID:', id));
  }

  /**
   * 根据编码，清除一个被标记删除的`Device`对象。
   *
   * @param {string} code
   *     要清除的`Device`对象的编码，该对象必须已经被标记删除。
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeByCode(code) {
    checkArgumentType('code', code, String);
    loading.showPurging();
    return http.delete(`/device/code/${code}/purge`)
      .then(() => logger.deviceInfo('Successfully purge the Device by code:', code));
  }

  /**
   * 根彻底清除全部已被标记删除的`Device`对象。
   *
   * @return {Promise<void|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功且没有返回值；若操作失败，
   *     则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  purgeAll() {
    loading.showPurging();
    return http.delete('/device/purge')
      .then(() => logger.deviceInfo('Successfully purge all deleted Device.'));
  }
}

const deviceApi = new DeviceApi();

export default deviceApi;
