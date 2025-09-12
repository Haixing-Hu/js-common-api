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
import { listImpl as realListImpl, listInfoImpl as realListInfoImpl } from '../../../src';

// mock http.get
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    get: jest.fn(),
  },
}));

// 构造最简 mock api
const mockApi = {
  CRITERIA_DEFINITIONS: [],
  entityClass: {
    name: 'Test',
    createPage: (obj) => obj,
  },
  entityInfoClass: {
    name: 'TestInfo',
    createPage: (obj) => obj,
  },
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

// 适配器，兼容原测试用例参数
function listImpl(url, criteria, options) {
  return realListImpl(
    mockApi,
    `${url}/list`,
    {},
    criteria ?? {},
    {},
    false,
    options ?? {},
  );
}
function listInfoImpl(url, criteria, options) {
  return realListInfoImpl(
    mockApi,
    `${url}/list/info`,
    {},
    criteria ?? {},
    {},
    false,
    options ?? {},
  );
}

describe('list-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    http.get.mockReset();
  });

  describe('listImpl', () => {
    it('应当正确调用 POST API 获取对象列表并返回结果', async () => {
      // 模拟查询参数和返回数据
      const criteria = {
        name: '测试',
        state: 'NORMAL',
        pageIndex: 0,
        pageSize: 10,
      };
      const mockResponse = {
        total_count: 25,
        total_pages: 3,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', name: '测试1', state: 'NORMAL' },
          { id: '2', name: '测试2', state: 'NORMAL' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listImpl('test-api-url', criteria, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/list', {
        params: {
          name: '测试',
          state: 'NORMAL',
          page_index: 0,
          page_size: 10,
          headers: {
            'content-type': 'application/json',
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('当查询条件为 null 时应当使用空对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        total_count: 25,
        total_pages: 3,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', name: '测试1', state: 'NORMAL' },
          { id: '2', name: '测试2', state: 'NORMAL' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listImpl('test-api-url', null);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/list', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟查询参数和错误
      const criteria = { name: '测试' };
      const mockError = new Error('服务器错误');
      http.get.mockRejectedValue(mockError);

      // 验证异常
      await expect(listImpl('test-api-url', criteria)).rejects.toThrow('服务器错误');
    });
  });

  describe('listInfoImpl', () => {
    it('应当正确调用 POST API 获取对象信息列表并返回结果', async () => {
      // 模拟查询参数和返回数据
      const criteria = {
        name: '测试',
        state: 'NORMAL',
        pageIndex: 0,
        pageSize: 10,
      };
      const mockResponse = {
        total_count: 25,
        total_pages: 3,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', name: '测试1', state: 'NORMAL' },
          { id: '2', name: '测试2', state: 'NORMAL' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', criteria);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/list/info', {
        params: {
          name: '测试',
          state: 'NORMAL',
          page_index: 0,
          page_size: 10,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('当查询条件为 null 时应当使用空对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        total_count: 25,
        total_pages: 3,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', name: '测试1', state: 'NORMAL' },
          { id: '2', name: '测试2', state: 'NORMAL' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', null);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/list/info', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('应当正确处理带有选项的请求', async () => {
      // 模拟查询参数、选项和返回数据
      const criteria = { name: '测试' };
      const options = {
        headers: { 'Authorization': 'Bearer token123' },
        timeout: 5000,
      };
      const mockResponse = {
        total_count: 2,
        total_pages: 1,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', name: '测试信息1' },
          { id: '2', name: '测试信息2' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', criteria, options);

      // 验证
      expect(http.get).toHaveBeenCalledWith('test-api-url/list/info', {
        params: {
          name: '测试',
          headers: {
            'authorization': 'Bearer token123',
          },
          timeout: 5000,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
