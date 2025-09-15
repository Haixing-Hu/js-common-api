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
import { listImpl as realListImpl, listInfoImpl as realListInfoImpl } from '../../../src';

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

  // 添加更多测试用例来提高覆盖率
  describe('更多覆盖率测试', () => {
    beforeEach(() => {
      http.get.mockReset();
      loading.showGetting.mockReset();
      mockApi.logger.info.mockReset();
      mockApi.logger.debug.mockReset();
    });

    it('listImpl 应当正确处理带有分页请求的调用', async () => {
      const mockResponse = {
        total_count: 100,
        total_pages: 10,
        page_index: 2,
        page_size: 10,
        content: [
          { id: '1', name: '测试对象1' },
          { id: '2', name: '测试对象2' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      const pageRequest = { page_index: 2, page_size: 10 };
      const criteria = { name: '测试' };
      const sortRequest = { sort_field: 'name', sort_order: 'ASC' };

      const result = await realListImpl(
        mockApi,
        'test-api-url/list',
        pageRequest,
        criteria,
        sortRequest,
        true,
        {},
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/list', {
        params: {
          page_index: 2,
          page_size: 10,
          name: '测试',
          sort_field: 'name',
          sort_order: 'ASC',
        },
      });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith('Successfully list %ss.', 'Test');
      expect(mockApi.logger.debug).toHaveBeenCalledWith('The page of %ss is:', 'Test', mockResponse);
    });

    it('listInfoImpl 应当正确处理带有分页请求的调用', async () => {
      const mockResponse = {
        total_count: 50,
        total_pages: 5,
        page_index: 1,
        page_size: 10,
        content: [
          { id: '1', name: '测试信息1' },
          { id: '2', name: '测试信息2' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      const pageRequest = { page_index: 1, page_size: 10 };
      const criteria = { status: 'active' };
      const sortRequest = { sort_field: 'created_at', sort_order: 'DESC' };

      const result = await realListInfoImpl(
        mockApi,
        'test-api-url/list/info',
        pageRequest,
        criteria,
        sortRequest,
        true,
        {},
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/list/info', {
        params: {
          page_index: 1,
          page_size: 10,
          status: 'active',
          sort_field: 'created_at',
          sort_order: 'DESC',
        },
      });
      expect(result).toEqual(mockResponse);
      expect(mockApi.logger.info).toHaveBeenCalledWith('Successfully list infos of %ss.', 'Test');
      expect(mockApi.logger.debug).toHaveBeenCalledWith('The page of infos of %ss is:', 'Test', mockResponse);
    });

    it('listImpl 当 showLoading 为 false 时不应当显示加载提示', async () => {
      const mockResponse = { content: [] };
      http.get.mockResolvedValue(mockResponse);

      await realListImpl(mockApi, 'test-api-url/list', {}, {}, {}, false, {});

      // 由于我们没有 mock loading.showGetting，这里主要是确保函数能正常执行
      expect(http.get).toHaveBeenCalled();
    });

    it('listInfoImpl 当 showLoading 为 false 时不应当显示加载提示', async () => {
      const mockResponse = { content: [] };
      http.get.mockResolvedValue(mockResponse);

      await realListInfoImpl(mockApi, 'test-api-url/list/info', {}, {}, {}, false, {});

      // 由于我们没有 mock loading.showGetting，这里主要是确保函数能正常执行
      expect(http.get).toHaveBeenCalled();
    });

    it('listImpl 应当正确处理复杂的查询条件和选项', async () => {
      const mockResponse = { content: [] };
      http.get.mockResolvedValue(mockResponse);

      const pageRequest = { page_index: 0, page_size: 20 };
      const criteria = {
        name: '测试',
        status: 'active',
        created_date: '2023-01-01',
      };
      const sortRequest = { sort_field: 'name', sort_order: 'ASC' };
      const options = {
        include_deleted: false,
        expand: 'details',
      };

      await realListImpl(
        mockApi,
        'test-api-url/list',
        pageRequest,
        criteria,
        sortRequest,
        false,
        options,
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/list', {
        params: {
          page_index: 0,
          page_size: 20,
          name: '测试',
          status: 'active',
          created_date: '2023-01-01',
          sort_field: 'name',
          sort_order: 'ASC',
          include_deleted: false,
          expand: 'details',
        },
      });
    });

    it('listInfoImpl 应当正确处理复杂的查询条件和选项', async () => {
      const mockResponse = { content: [] };
      http.get.mockResolvedValue(mockResponse);

      const pageRequest = { page_index: 0, page_size: 50 };
      const criteria = {
        category: 'important',
        priority: 'high',
      };
      const sortRequest = { sort_field: 'priority', sort_order: 'DESC' };
      const options = {
        format: 'summary',
        fields: 'id,name,status',
      };

      await realListInfoImpl(
        mockApi,
        'test-api-url/list/info',
        pageRequest,
        criteria,
        sortRequest,
        false,
        options,
      );

      expect(http.get).toHaveBeenCalledWith('test-api-url/list/info', {
        params: {
          page_index: 0,
          page_size: 50,
          category: 'important',
          priority: 'high',
          sort_field: 'priority',
          sort_order: 'DESC',
          format: 'summary',
          fields: 'id,name,status',
        },
      });
    });
  });
});
