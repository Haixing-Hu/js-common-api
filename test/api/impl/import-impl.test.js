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
import importImpl from '../../../src/api/impl/import-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    post: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showImporting: jest.fn(),
  },
}));

// 定义测试用的 API 对象
const mockApi = {
  entityClass: {
    name: 'TestEntity',
  },
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

// 创建模拟的 File 对象
const createMockFile = (name, content = 'test content') => {
  const blob = new Blob([content], { type: 'text/csv' });
  const file = new File([blob], name, { type: 'text/csv' });
  return file;
};

describe('import-impl.js', () => {
  beforeEach(() => {
    http.post.mockReset();
    loading.showImporting.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('importImpl', () => {
    it('应当正确调用 POST API 导入文件', async () => {
      const count = 10;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.csv');

      const result = await importImpl(mockApi, 'test-api-url/import', 'csv', file, false, 4, false);

      expect(http.post).toHaveBeenCalledWith(
        'test-api-url/import',
        expect.any(FormData),
        {
          params: { parallel: false, threads: 4 },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully import %d %ss from a %s file: %s',
        count,
        'TestEntity',
        'csv',
        'test.csv',
      );
      expect(result).toBe(count);
    });

    it('应当正确处理并行导入', async () => {
      const count = 20;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.xlsx');

      const result = await importImpl(mockApi, 'test-api-url/import', 'xlsx', file, true, 8, false);

      expect(http.post).toHaveBeenCalledWith(
        'test-api-url/import',
        expect.any(FormData),
        {
          params: { parallel: true, threads: 8 },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      expect(result).toBe(count);
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const count = 5;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.csv');

      await importImpl(mockApi, 'test-api-url/import', 'csv', file, false, null, true);

      expect(loading.showImporting).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      const count = 5;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.csv');

      await importImpl(mockApi, 'test-api-url/import', 'csv', file, false, null, false);

      expect(loading.showImporting).not.toHaveBeenCalled();
    });

    it('应当正确处理 parallel 为 null 的情况', async () => {
      const count = 15;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.csv');

      await importImpl(mockApi, 'test-api-url/import', 'csv', file, null, null, false);

      expect(http.post).toHaveBeenCalledWith(
        'test-api-url/import',
        expect.any(FormData),
        {
          params: {},
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
    });

    it('应当正确处理 threads 为 null 的情况', async () => {
      const count = 12;
      http.post.mockResolvedValue(count);
      const file = createMockFile('test.csv');

      await importImpl(mockApi, 'test-api-url/import', 'csv', file, true, null, false);

      expect(http.post).toHaveBeenCalledWith(
        'test-api-url/import',
        expect.any(FormData),
        {
          params: { parallel: true },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
    });

    it('当 file 不是 File 对象时应当抛出错误', () => {
      expect(() => importImpl(mockApi, 'test-api-url/import', 'csv', 'invalid', false, 4, false))
        .toThrow(TypeError);
    });

    it('当 parallel 不是布尔值且不为 null 时应当抛出错误', () => {
      const file = createMockFile('test.csv');
      expect(() => importImpl(mockApi, 'test-api-url/import', 'csv', file, 'invalid', 4, false))
        .toThrow(TypeError);
    });

    it('当 threads 不是数字且不为 null 时应当抛出错误', () => {
      const file = createMockFile('test.csv');
      expect(() => importImpl(mockApi, 'test-api-url/import', 'csv', file, false, 'invalid', false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      const file = createMockFile('test.csv');
      expect(() => importImpl(mockApi, 'test-api-url/import', 'csv', file, false, 4, 'invalid'))
        .toThrow(TypeError);
    });
  });
});
