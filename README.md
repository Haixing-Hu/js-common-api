# @qubit-ltd/common-api

[![npm 包](https://img.shields.io/npm/v/@qubit-ltd/common-api.svg)](https://npmjs.com/package/@qubit-ltd/common-api)
[![许可证](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-api/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-api/tree/master)
[![覆盖率状态](https://coveralls.io/repos/github/Haixing-Hu/js-common-api/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-api?branch=master)

[@qubit-ltd/common-api] 是一个对常用 API 进行封装的 JavaScript 库。该库提供了一套统一的接口，用于与后端服务进行交互，简化了前端开发过程中的 API 调用操作。

## 目录

- [安装](#安装)
- [使用](#使用)
- [功能特性](#功能特性)
  - [API 基本模式](#api-基本模式)
  - [API 模块](#api-模块)
  - [自定义 API 开发](#自定义-api-开发)
  - [实现工具](#实现工具)
  - [通用工具函数](#通用工具函数)
- [贡献](#贡献)
- [许可证](#许可证)

## <span id="安装">安装</span>

您可以通过 npm 或 yarn 安装 [@qubit-ltd/common-api]：

```bash
# 使用 npm
npm install @qubit-ltd/common-api

# 使用 yarn
yarn add @qubit-ltd/common-api
```

## <span id="使用">使用</span>

```javascript
// 导入特定 API 模块
import { userApi, dictApi, categoryApi } from '@qubit-ltd/common-api';

// 获取用户信息
async function getUserInfo(userId) {
  try {
    const user = await userApi.get(userId);
    console.log('用户信息:', user);
    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

// 获取字典列表
async function getDictList(filter) {
  try {
    const result = await dictApi.list(filter);
    console.log('字典列表:', result);
    return result;
  } catch (error) {
    console.error('获取字典列表失败:', error);
    throw error;
  }
}

// 创建新分类
async function createCategory(category) {
  try {
    const result = await categoryApi.add(category);
    console.log('创建分类成功:', result);
    return result;
  } catch (error) {
    console.error('创建分类失败:', error);
    throw error;
  }
}
```

## <span id="功能特性">功能特性</span>

### <span id="api-基本模式">API 基本模式</span>

该库中的所有 API 模块都遵循统一的设计模式，每个 API 类都包含以下核心要素：

#### 核心属性
- **`entityClass`**: 实体对象的类，用于创建和反序列化实体对象
- **`entityInfoClass`**: 实体信息类，用于创建基本信息对象
- **`CRITERIA_DEFINITIONS`**: 查询条件定义数组，用于验证查询参数
- **`@HasLogger`**: 装饰器，为类自动注入日志记录器

#### 标准方法模式
每个 API 类通常包含以下标准方法：

- **查询操作**: `get()`, `getInfo()`, `getByCode()`, `list()`, `listInfo()`
- **创建更新**: `add()`, `update()`, `updateProperty()`
- **删除恢复**: `delete()`, `restore()`, `purge()`, `batchDelete()`, `batchRestore()`
- **其他操作**: `exists()`, `import()`, `export()`

所有方法都使用 `@Log` 装饰器进行日志记录，并支持可选的加载提示显示。

### <span id="api-模块">API 模块</span>

该库提供了多种 API 模块，每个模块对应不同的业务实体：

- **用户相关**
  - `userApi`: 用户管理
  - `userAuthenticateApi`: 用户认证
  - `userRoleApi`: 用户角色管理
  - `currentUserApi`: 当前用户操作

- **组织架构**
  - `organizationApi`: 组织管理
  - `departmentApi`: 部门管理
  - `employeeApi`: 员工管理
  - `roleApi`: 角色管理

- **地理位置**
  - `countryApi`: 国家
  - `provinceApi`: 省份
  - `cityApi`: 城市
  - `districtApi`: 区县
  - `streetApi`: 街道

- **字典与分类**
  - `dictApi`: 字典
  - `dictEntryApi`: 字典条目
  - `categoryApi`: 分类管理

- **文件与上传**
  - `fileApi`: 文件操作
  - `uploadApi`: 文件上传
  - `attachmentApi`: 附件管理

- **设备相关**
  - `deviceApi`: 设备管理
  - `deviceInitApi`: 设备初始化

- **其他功能**
  - `appApi`: 应用操作
  - `appAuthenticateApi`: 应用认证
  - `feedbackApi`: 反馈管理
  - `personApi`: 个人信息
  - `settingApi`: 系统设置
  - `systemApi`: 系统操作
  - `taskInfoApi`: 任务信息
  - `verifyCodeApi`: 验证码
  - `wechatApi`: 微信相关

### <span id="自定义-api-开发">自定义 API 开发</span>

该库最大的优势在于提供了一套完整的工具函数，让开发者可以快速构建自定义的 API 模块。通过使用这些工具函数，您可以：

- **快速开发**: 使用标准化的实现函数，减少重复代码
- **保持一致性**: 所有 API 遵循相同的模式和约定
- **自动化处理**: 内置错误处理、日志记录、加载状态管理
- **类型安全**: 内置参数验证和类型检查

详细的开发指南请参阅：[自定义 API 开发指南](./doc/custom-api-development.md)

### <span id="实现工具">实现工具</span>

库提供了一系列实现函数，用于构建通用的 API 操作：

- **查询操作**
  - `getImpl`, `getByKeyImpl`: 获取单个对象
  - `getInfoImpl`, `getInfoByKeyImpl`: 获取对象信息
  - `getPropertyImpl`, `getPropertyByKeyImpl`: 获取对象属性
  - `listImpl`, `listInfoImpl`: 列表查询

- **创建和更新**
  - `addImpl`: 添加对象
  - `updateImpl`, `updateByKeyImpl`: 更新对象
  - `updatePropertyImpl`, `updatePropertyByKeyImpl`: 更新对象属性

- **删除和恢复**
  - `deleteImpl`, `deleteByKeyImpl`, `deleteAllImpl`, `batchDeleteImpl`: 删除操作
  - `eraseImpl`, `eraseByKeyImpl`, `eraseAllImpl`, `batchEraseImpl`: 擦除操作
  - `purgeImpl`, `purgeByKeyImpl`, `purgeAllImpl`, `batchPurgeImpl`: 清除操作
  - `restoreImpl`, `restoreByKeyImpl`, `restoreAllImpl`, `batchRestoreImpl`: 恢复操作

- **其他操作**
  - `existsImpl`, `existsKeyImpl`: 检查对象是否存在
  - `importImpl`, `exportImpl`: 导入导出操作

### <span id="通用工具函数">通用工具函数</span>

此外，该库还提供了一些通用的工具函数：

- `checkObjectArgument`: 检查对象参数
- `checkIdArgumentType`: 检查 ID 参数类型
- `checkIdArrayArgumentType`: 检查 ID 数组参数类型
- `checkPageRequestArgument`: 检查分页请求参数
- `checkSortRequestArgument`: 检查排序请求参数
- `TaskFilter`: 任务过滤器类
- `assignOptions`, `toJsonOptions`: 选项处理工具

## <span id="贡献">贡献</span>

如果您发现任何问题或有改进建议，请随时在 [GitHub 仓库] 中提出问题或提交拉取请求。

## <span id="许可证">许可证</span>

[@qubit-ltd/common-api] 在 Apache 2.0 许可下分发。
有关更多详细信息，请参阅 [LICENSE](LICENSE) 文件。

[@qubit-ltd/common-api]: https://npmjs.com/package/@qubit-ltd/common-api
[GitHub 仓库]: https://github.com/Haixing-Hu/js-common-api