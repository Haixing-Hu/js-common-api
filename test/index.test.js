////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import * as api from '../src/index';

describe('index.js', () => {
  it('应当正确导出所有 API 和工具函数', () => {
    // 测试 API 导出
    expect(api.userApi).toBeDefined();
    expect(api.appApi).toBeDefined();
    expect(api.categoryApi).toBeDefined();
    expect(api.countryApi).toBeDefined();
    expect(api.cityApi).toBeDefined();
    expect(api.districtApi).toBeDefined();
    expect(api.streetApi).toBeDefined();
    expect(api.provinceApi).toBeDefined();
    expect(api.organizationApi).toBeDefined();
    expect(api.departmentApi).toBeDefined();
    expect(api.employeeApi).toBeDefined();
    expect(api.personApi).toBeDefined();
    expect(api.roleApi).toBeDefined();
    expect(api.userRoleApi).toBeDefined();
    expect(api.deviceApi).toBeDefined();
    expect(api.deviceInitApi).toBeDefined();
    expect(api.dictApi).toBeDefined();
    expect(api.dictEntryApi).toBeDefined();
    expect(api.attachmentApi).toBeDefined();
    expect(api.fileApi).toBeDefined();
    expect(api.uploadApi).toBeDefined();
    expect(api.settingApi).toBeDefined();
    expect(api.systemApi).toBeDefined();
    expect(api.taskInfoApi).toBeDefined();
    expect(api.operationLogApi).toBeDefined();
    expect(api.feedbackApi).toBeDefined();
    expect(api.faqApi).toBeDefined();
    expect(api.socialNetworkAccountApi).toBeDefined();
    expect(api.currentUserApi).toBeDefined();
    expect(api.userAuthenticateApi).toBeDefined();
    expect(api.appAuthenticateApi).toBeDefined();
    expect(api.verifyCodeApi).toBeDefined();
    expect(api.wechatApi).toBeDefined();

    // 测试实现函数导出
    expect(api.addImpl).toBeDefined();
    expect(api.deleteImpl).toBeDefined();
    expect(api.deleteByKeyImpl).toBeDefined();
    expect(api.deleteAllImpl).toBeDefined();
    expect(api.batchDeleteImpl).toBeDefined();
    expect(api.deleteByParentAndKeyImpl).toBeDefined();
    expect(api.eraseImpl).toBeDefined();
    expect(api.eraseByKeyImpl).toBeDefined();
    expect(api.eraseAllImpl).toBeDefined();
    expect(api.batchEraseImpl).toBeDefined();
    expect(api.eraseByParentAndKeyImpl).toBeDefined();
    expect(api.existsImpl).toBeDefined();
    expect(api.existsKeyImpl).toBeDefined();
    expect(api.existsParentAndKeyImpl).toBeDefined();
    expect(api.exportImpl).toBeDefined();
    expect(api.getImpl).toBeDefined();
    expect(api.getByKeyImpl).toBeDefined();
    expect(api.getInfoImpl).toBeDefined();
    expect(api.getInfoByKeyImpl).toBeDefined();
    expect(api.getPropertyImpl).toBeDefined();
    expect(api.getPropertyByKeyImpl).toBeDefined();
    expect(api.getByParentAndKeyImpl).toBeDefined();
    expect(api.getInfoByParentAndKeyImpl).toBeDefined();
    expect(api.getPropertyByParentAndKeyImpl).toBeDefined();
    expect(api.importImpl).toBeDefined();
    expect(api.listImpl).toBeDefined();
    expect(api.listInfoImpl).toBeDefined();
    expect(api.purgeImpl).toBeDefined();
    expect(api.purgeByKeyImpl).toBeDefined();
    expect(api.purgeAllImpl).toBeDefined();
    expect(api.batchPurgeImpl).toBeDefined();
    expect(api.purgeByParentAndKeyImpl).toBeDefined();
    expect(api.restoreImpl).toBeDefined();
    expect(api.restoreByKeyImpl).toBeDefined();
    expect(api.restoreAllImpl).toBeDefined();
    expect(api.batchRestoreImpl).toBeDefined();
    expect(api.restoreByParentAndKeyImpl).toBeDefined();
    expect(api.updateImpl).toBeDefined();
    expect(api.updateByKeyImpl).toBeDefined();
    expect(api.updatePropertyImpl).toBeDefined();
    expect(api.updatePropertyByKeyImpl).toBeDefined();
    expect(api.updateByParentAndKeyImpl).toBeDefined();

    // 测试工具函数导出
    expect(api.checkObjectArgument).toBeDefined();
    expect(api.checkIdArgumentType).toBeDefined();
    expect(api.checkIdArrayArgumentType).toBeDefined();
    expect(api.checkPageRequestArgument).toBeDefined();
    expect(api.checkSortRequestArgument).toBeDefined();
    expect(api.wechat).toBeDefined();
    expect(api.TaskFilter).toBeDefined();
    expect(api.assignOptions).toBeDefined();
    expect(api.toJsonOptions).toBeDefined();

    // 测试函数类型
    expect(typeof api.addImpl).toBe('function');
    expect(typeof api.deleteImpl).toBe('function');
    expect(typeof api.getImpl).toBe('function');
    expect(typeof api.listImpl).toBe('function');
    expect(typeof api.updateImpl).toBe('function');
    expect(typeof api.checkObjectArgument).toBe('function');
    expect(typeof api.checkIdArgumentType).toBe('function');
    expect(typeof api.TaskFilter).toBe('function');
  });
});
