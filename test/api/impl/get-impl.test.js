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
import { getImpl, getByKeyImpl, getInfoImpl, getInfoByKeyImpl } from '../../../src/api/impl/get-impl';

// mock http.get
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    get: jest.fn(),
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
});
