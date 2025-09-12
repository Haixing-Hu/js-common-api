////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// import axios from 'axios'; // 暂时不需要
import { http } from '@qubit-ltd/common-app';
import { loading } from '@qubit-ltd/common-ui';
import {
  getImpl,
  getByKeyImpl,
  getInfoImpl,
  getInfoByKeyImpl,
  getPropertyImpl,
  getPropertyByKeyImpl,
  getByParentAndKeyImpl,
  getInfoByParentAndKeyImpl,
  getPropertyByParentAndKeyImpl
} from '../../../src/api/impl/get-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    get: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showGetting: jest.fn(),
  },
}));

// 构造最简 mock api
const mockApi = {
  entityClass: {
    name: 'Test',
    create: (obj) => obj,
  },
  entityInfoClass: {
    name: 'TestInfo',
    create: (obj) => obj,
  },
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

describe('get-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    http.get.mockReset();
    loading.showGetting.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('getImpl', () => {
    it('应当正确调用 API 并返回获取的对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getImpl(mockApi, 'test-api-url/{id}', '123', false, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/123', { params: { headers: { 'content-type': 'application/json' } } });
      expect(result).toEqual(mockResponse);
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟错误
      const mockError = new Error('API 错误');
      http.get.mockRejectedValue(mockError);

      // 验证异常
      await expect(getImpl(mockApi, 'test-api-url/{id}', '123', false)).rejects.toThrow('API 错误');
    });
  });

  describe('getByKeyImpl', () => {
    it('应当正确调用带 key 的 API 并返回获取的对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'test-code', false, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/test-code', { params: { headers: { 'content-type': 'application/json' } } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getInfoImpl', () => {
    it('应当正确调用 info API 并返回获取的对象信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象信息',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getInfoImpl(mockApi, 'test-api-url/{id}', '123', false);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getInfoByKeyImpl', () => {
    it('应当正确调用带 key 的 info API 并返回获取的对象信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象信息',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getInfoByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'test-code', false);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/test-code');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPropertyImpl', () => {
    it('应当正确调用 API 并返回对象属性', async () => {
      const mockResponse = { name: '测试属性' };
      http.get.mockResolvedValue(mockResponse);

      const PropertyClass = { create: (obj) => obj };
      const result = await getPropertyImpl(mockApi, 'test-api-url/{id}/property', 'name', PropertyClass, '123', false);

      expect(http.get).toHaveBeenCalledWith('test-api-url/123/property', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully get the %s of the %s by its ID "%s".',
        'name',
        'Test',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const mockResponse = { name: '测试属性' };
      http.get.mockResolvedValue(mockResponse);

      const PropertyClass = { create: (obj) => obj };
      await getPropertyImpl(mockApi, 'test-api-url/{id}/property', 'name', PropertyClass, '123', true);

      expect(loading.showGetting).toHaveBeenCalled();
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      const PropertyClass = { create: (obj) => obj };
      expect(() => getPropertyImpl(mockApi, 'test-api-url/{id}/property', 'name', PropertyClass, null, false))
        .toThrow(TypeError);
    });
  });

  describe('getPropertyByKeyImpl', () => {
    it('应当正确调用 API 并根据键返回对象属性', async () => {
      const mockResponse = { name: '测试属性' };
      http.get.mockResolvedValue(mockResponse);

      const PropertyClass = { create: (obj) => obj };
      const result = await getPropertyByKeyImpl(mockApi, 'test-api-url/{code}/property', 'name', PropertyClass, 'code', 'TEST_CODE', false);

      expect(http.get).toHaveBeenCalledWith('test-api-url/TEST_CODE/property', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully get the %s of the %s by its %s "%s".',
        'name',
        'Test',
        'code',
        'TEST_CODE',
      );
    });

    it('当键值不是字符串时应当抛出错误', () => {
      const PropertyClass = { create: (obj) => obj };
      expect(() => getPropertyByKeyImpl(mockApi, 'test-api-url/{code}/property', 'name', PropertyClass, 'code', 123, false))
        .toThrow(TypeError);
    });
  });

  describe('getByParentAndKeyImpl', () => {
    it('应当正确调用 API 并根据父键和子键返回对象', async () => {
      const mockResponse = { id: '123', name: '测试对象' };
      http.get.mockResolvedValue(mockResponse);

      const result = await getByParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', '456', 'code', 'TEST_CODE', false);

      expect(http.get).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully get the %s by parent %s "%s" and its %s "%s".',
        'Test',
        'parentId',
        '456',
        'code',
        'TEST_CODE',
      );
    });

    it('应当正确处理数字类型的父键值', async () => {
      const mockResponse = { id: '123', name: '测试对象' };
      http.get.mockResolvedValue(mockResponse);

      await getByParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', 456, 'code', 'TEST_CODE', false);

      expect(http.get).toHaveBeenCalledWith('test-api-url/456/TEST_CODE', { params: {} });
    });

    it('当父键值类型不正确时应当抛出错误', () => {
      expect(() => getByParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', {}, 'code', 'TEST_CODE', false))
        .toThrow(TypeError);
    });

    it('当子键值不是字符串时应当抛出错误', () => {
      expect(() => getByParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', '456', 'code', 123, false))
        .toThrow(TypeError);
    });
  });

  describe('getInfoByParentAndKeyImpl', () => {
    it('应当正确调用 API 并根据父键和子键返回对象信息', async () => {
      const mockResponse = { id: '123', name: '测试对象信息' };
      http.get.mockResolvedValue(mockResponse);

      const result = await getInfoByParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', '456', 'code', 'TEST_CODE', false);

      expect(http.get).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE');
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully get the info of the %s by parent %s "%s" and its %s "%s".',
        'Test',
        'parentId',
        '456',
        'code',
        'TEST_CODE',
      );
    });
  });

  describe('getPropertyByParentAndKeyImpl', () => {
    it('应当正确调用 API 并根据父键和子键返回对象属性', async () => {
      const mockResponse = { name: '测试属性' };
      http.get.mockResolvedValue(mockResponse);

      const PropertyClass = { create: (obj) => obj };
      const result = await getPropertyByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}/property',
        'name',
        PropertyClass,
        'parentId',
        '456',
        'code',
        'TEST_CODE',
        false
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE/property', { params: {} });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully get the %s of the %s by parent %s "%s" and its %s "%s".',
        'name',
        'Test',
        'parentId',
        '456',
        'code',
        'TEST_CODE',
      );
    });

    it('应当正确处理带选项的请求', async () => {
      const mockResponse = { name: '测试属性' };
      http.get.mockResolvedValue(mockResponse);

      const PropertyClass = { create: (obj) => obj };
      const options = { includeDetails: true };

      await getPropertyByParentAndKeyImpl(
        mockApi,
        'test-api-url/{parentId}/{code}/property',
        'name',
        PropertyClass,
        'parentId',
        '456',
        'code',
        'TEST_CODE',
        false,
        options
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/"456"/TEST_CODE/property', { params: { include_details: true } });
    });
  });

  // 添加更多边界情况测试
  describe('边界情况测试', () => {
    it('getImpl 应当正确处理带选项的请求', async () => {
      const mockResponse = { id: '123', name: '测试对象' };
      http.get.mockResolvedValue(mockResponse);
      const options = { includeDetails: true };

      await getImpl(mockApi, 'test-api-url/{id}', '123', false, options);

      expect(http.get).toHaveBeenCalledWith('test-api-url/123', { params: { include_details: true } });
    });

    it('getByKeyImpl 应当正确处理带选项的请求', async () => {
      const mockResponse = { id: '123', name: '测试对象' };
      http.get.mockResolvedValue(mockResponse);
      const options = { includeDetails: true };

      await getByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', false, options);

      expect(http.get).toHaveBeenCalledWith('test-api-url/TEST_CODE', { params: { include_details: true } });
    });

    it('getImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => getImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });

    it('getByKeyImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => getByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', 'invalid'))
        .toThrow(TypeError);
    });

    it('getInfoImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => getInfoImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });

    it('getInfoByKeyImpl 当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => getInfoByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', 'invalid'))
        .toThrow(TypeError);
    });
  });
});
