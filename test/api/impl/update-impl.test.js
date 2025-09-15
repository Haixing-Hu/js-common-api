////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { loading } from '@qubit-ltd/common-ui';
import {
  updateImpl,
  updateByKeyImpl,
  updatePropertyImpl,
  updatePropertyByKeyImpl,
  updateByParentAndKeyImpl,
} from '../../../src/api/impl/update-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    put: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showUpdating: jest.fn(),
  },
}));

// 定义测试实体类
class TestEntity {
  constructor(data) {
    Object.assign(this, data);
  }

  static create(obj) {
    return new TestEntity(obj);
  }
}

// 定义测试用的 API 对象
const mockApi = {
  entityClass: TestEntity,
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

describe('update-impl.js', () => {
  beforeEach(() => {
    http.put.mockReset();
    loading.showUpdating.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('updateImpl', () => {
    it('应当正确调用 PUT API 更新对象', async () => {
      const entity = { id: '123', name: '测试对象', description: '更新测试' };
      const mockResponse = { id: '123', name: '测试对象', description: '更新测试', modifyTime: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);

      const result = await updateImpl(mockApi, 'test-api-url/{id}', entity, false);

      expect(http.put).toHaveBeenCalledWith('test-api-url/123', entity, { params: {} });
      expect(result).toBeInstanceOf(TestEntity);
      expect(result.id).toBe('123');
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully update the %s by its ID:',
        'TestEntity',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const entity = { id: '123', name: '测试对象' };
      const mockResponse = { id: '123', name: '测试对象' };
      http.put.mockResolvedValue(mockResponse);

      await updateImpl(mockApi, 'test-api-url/{id}', entity, true);

      expect(loading.showUpdating).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      const entity = { id: '123', name: '测试对象' };
      const mockResponse = { id: '123', name: '测试对象' };
      http.put.mockResolvedValue(mockResponse);

      await updateImpl(mockApi, 'test-api-url/{id}', entity, false);

      expect(loading.showUpdating).not.toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      const entity = { id: '123', name: '测试对象' };
      const mockResponse = { id: '123', name: '测试对象' };
      const options = { validate: true };
      http.put.mockResolvedValue(mockResponse);

      await updateImpl(mockApi, 'test-api-url/{id}', entity, false, options);

      expect(http.put).toHaveBeenCalledWith('test-api-url/123', entity, { params: { validate: true } });
    });

    it('当实体对象为 null 时应当抛出错误', () => {
      expect(() => updateImpl(mockApi, 'test-api-url/{id}', null, false))
        .toThrow(TypeError);
    });

    it('当实体对象没有 ID 时应当抛出错误', () => {
      const entity = { name: '测试对象' };
      expect(() => updateImpl(mockApi, 'test-api-url/{id}', entity, false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      const entity = { id: '123', name: '测试对象' };
      expect(() => updateImpl(mockApi, 'test-api-url/{id}', entity, 'invalid'))
        .toThrow(TypeError);
    });
  });

  describe('updateByKeyImpl', () => {
    it('应当正确调用 PUT API 根据键更新对象', async () => {
      const entity = { code: 'TEST_CODE', name: '测试对象' };
      const mockResponse = { code: 'TEST_CODE', name: '测试对象' };
      http.put.mockResolvedValue(mockResponse);

      const result = await updateByKeyImpl(mockApi, 'test-api-url/{code}', 'code', entity, false);

      expect(http.put).toHaveBeenCalledWith('test-api-url/TEST_CODE', entity, { params: {} });
      expect(result).toBeInstanceOf(TestEntity);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully update the %s by its %s:',
        'TestEntity',
        'code',
        'TEST_CODE',
      );
    });

    it('当实体对象没有指定键时应当抛出错误', () => {
      const entity = { name: '测试对象' };
      expect(() => updateByKeyImpl(mockApi, 'test-api-url/{code}', 'code', entity, false))
        .toThrow(TypeError);
    });
  });

  describe('updatePropertyImpl', () => {
    it('应当正确调用 PUT API 更新对象属性', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);

      const result = await updatePropertyImpl(mockApi, 'test-api-url/{id}/property', '123', 'name', String, '新名称', false);

      expect(http.put).toHaveBeenCalledWith('test-api-url/123/property', '新名称', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully update the %s of a %s by its ID "%s" at:',
        'name',
        'TestEntity',
        '123',
        mockResponse,
      );
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      expect(() => updatePropertyImpl(mockApi, 'test-api-url/{id}/property', null, 'name', String, '新名称', false))
        .toThrow(TypeError);
    });

    it('当属性值类型不匹配时应当抛出错误', () => {
      expect(() => updatePropertyImpl(mockApi, 'test-api-url/{id}/property', '123', 'name', Number, '新名称', false))
        .toThrow(TypeError);
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);

      await updatePropertyImpl(mockApi, 'test-api-url/{id}/property', '123', 'name', String, '新名称', true);

      expect(loading.showUpdating).toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);
      const options = { force: true };

      await updatePropertyImpl(mockApi, 'test-api-url/{id}/property', '123', 'name', String, '新名称', false, options);

      expect(http.put).toHaveBeenCalledWith('test-api-url/123/property', '新名称', { params: { force: true } });
    });
  });

  describe('updatePropertyByKeyImpl', () => {
    it('应当正确调用 PUT API 根据键更新对象属性', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);

      const result = await updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        'TEST_CODE',
        'name',
        String,
        '新名称',
        false,
      );

      expect(http.put).toHaveBeenCalledWith('test-api-url/TEST_CODE/property', '新名称', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully update the %s of a %s by its %s "%s" at:',
        'name',
        'TestEntity',
        'code',
        'TEST_CODE',
        mockResponse,
      );
    });

    it('当键值不是字符串时应当抛出错误', () => {
      expect(() => updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        123,
        'name',
        String,
        '新名称',
        false,
      )).toThrow(TypeError);
    });

    it('当属性值类型不匹配时应当抛出错误', () => {
      expect(() => updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        'TEST_CODE',
        'name',
        Number,
        '新名称',
        false,
      )).toThrow(TypeError);
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);

      await updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        'TEST_CODE',
        'name',
        String,
        '新名称',
        true,
      );

      expect(loading.showUpdating).toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      const mockResponse = { timestamp: '2023-07-01T12:00:00Z' };
      http.put.mockResolvedValue(mockResponse);
      const options = { force: true };

      await updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        'TEST_CODE',
        'name',
        String,
        '新名称',
        false,
        options,
      );

      expect(http.put).toHaveBeenCalledWith('test-api-url/TEST_CODE/property', '新名称', { params: { force: true } });
    });
  });

  describe('updateByParentAndKeyImpl', () => {
    it('应当正确调用 PUT API 根据父键和子键更新对象', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = { parentId: '456', code: 'TEST_CODE', name: '测试对象' };

      const result = await updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        entity,
        false,
      );

      expect(http.put).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE', { parent_id: '456', code: 'TEST_CODE', name: '测试对象' }, { params: {} });
      expect(result).toEqual(new TestEntity(mockResponse));
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully update the %s by parent %s "%s" and its %s "%s"',
        'TestEntity',
        'parentId',
        '456',
        'code',
        'TEST_CODE',
      );
    });

    it('应当正确处理数字类型的父键值', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = { parentId: 456, code: 'TEST_CODE', name: '测试对象' };

      await updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        456,
        'code',
        entity,
        false,
      );

      expect(http.put).toHaveBeenCalledWith('test-api-url/456/TEST_CODE', { parent_id: 456, code: 'TEST_CODE', name: '测试对象' }, { params: {} });
    });

    it('当父键值类型不正确时应当抛出错误', () => {
      const entity = { parentId: {}, code: 'TEST_CODE', name: '测试对象' };
      expect(() => updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        {},
        'code',
        entity,
        false,
      )).toThrow(TypeError);
    });

    it('当子键值不是字符串时应当抛出错误', () => {
      const entity = { parentId: '456', code: 123, name: '测试对象' };
      expect(() => updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        entity,
        false,
      )).toThrow(TypeError);
    });

    it('当实体对象不是正确类型时应当抛出错误', () => {
      expect(() => updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        'invalid',
        false,
      )).toThrow(TypeError);
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = { parentId: '456', code: 'TEST_CODE', name: '测试对象' };

      await updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        entity,
        true,
      );

      expect(loading.showUpdating).toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = { parentId: '456', code: 'TEST_CODE', name: '测试对象' };
      const options = { force: true };

      await updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        entity,
        false,
        options,
      );

      expect(http.put).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE', { parent_id: '456', code: 'TEST_CODE', name: '测试对象' }, { params: { force: true } });
    });
  });

  // 添加更多边界情况测试
  describe('边界情况测试', () => {
    it('updateImpl 应当正确处理实体类实例', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = new TestEntity({ id: '123', name: '测试对象' });

      await updateImpl(mockApi, 'test-api-url/{id}', entity, false);

      expect(http.put).toHaveBeenCalledWith('test-api-url/123', entity, { params: {} });
    });

    it('updateByKeyImpl 应当正确处理实体类实例', async () => {
      const mockResponse = { id: '123', name: '更新后的对象' };
      http.put.mockResolvedValue(mockResponse);
      const entity = new TestEntity({ code: 'TEST_CODE', name: '测试对象' });

      await updateByKeyImpl(mockApi, 'test-api-url/{code}', 'code', entity, false);

      expect(http.put).toHaveBeenCalledWith('test-api-url/TEST_CODE', entity, { params: {} });
    });

    it('updatePropertyImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => updatePropertyImpl(mockApi, 'test-api-url/{id}/property', '123', 'name', String, '新名称', 'invalid'))
        .toThrow(TypeError);
    });

    it('updatePropertyByKeyImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => updatePropertyByKeyImpl(
        mockApi,
        'test-api-url/{code}/property',
        'code',
        'TEST_CODE',
        'name',
        String,
        '新名称',
        'invalid',
      )).toThrow(TypeError);
    });

    it('updateByParentAndKeyImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      const entity = { parentId: '456', code: 'TEST_CODE', name: '测试对象' };
      expect(() => updateByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}',
        'parentId',
        '456',
        'code',
        entity,
        'invalid',
      )).toThrow(TypeError);
    });
  });
});
