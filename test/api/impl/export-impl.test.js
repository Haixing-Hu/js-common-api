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
import { CommonMimeType } from '@qubit-ltd/common-model';
import exportImpl from '../../../src/api/impl/export-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    download: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showExporting: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-model', () => ({
  CommonMimeType: {
    CSV: 'text/csv',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  SortRequest: class SortRequest {
    constructor(sortField, sortOrder) {
      this.sortField = sortField;
      this.sortOrder = sortOrder;
    }
  },
  SortOrder: {
    ASC: 'ASC',
    DESC: 'DESC',
  },
}));

// 定义测试用的 API 对象
const mockApi = {
  entityClass: {
    name: 'TestEntity',
  },
  CRITERIA_DEFINITIONS: [
    { name: 'name', type: String },
    { name: 'status', type: String },
  ],
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

describe('export-impl.js', () => {
  beforeEach(() => {
    http.download.mockReset();
    loading.showExporting.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('exportImpl', () => {
    it('应当正确调用下载 API 导出 CSV 文件', async () => {
      const mockResult = { filename: 'test.csv', url: 'blob:test-url' };
      http.download.mockResolvedValue(mockResult);

      const criteria = { name: 'test' };
      const sortRequest = { sortField: 'name', sortOrder: 'ASC' };
      const result = await exportImpl(mockApi, 'test-api-url/export', 'csv', criteria, sortRequest, false, false);

      expect(http.download).toHaveBeenCalledWith(
        'test-api-url/export',
        { name: 'test', sort_field: 'name', sort_order: 'ASC' },
        'text/csv',
        false,
      );
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully export Apps to a CSV file:',
        'test.csv',
      );
      expect(result).toEqual(mockResult);
    });

    it('应当正确调用下载 API 导出 XLSX 文件', async () => {
      const mockResult = { filename: 'test.xlsx', url: 'blob:test-url' };
      http.download.mockResolvedValue(mockResult);

      const criteria = { status: 'active' };
      const sortRequest = {};
      const result = await exportImpl(mockApi, 'test-api-url/export', 'xlsx', criteria, sortRequest, true, false);

      expect(http.download).toHaveBeenCalledWith(
        'test-api-url/export',
        { status: 'active' },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        true,
      );
      expect(result).toEqual(mockResult);
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      const mockResult = { filename: 'test.csv' };
      http.download.mockResolvedValue(mockResult);

      await exportImpl(mockApi, 'test-api-url/export', 'csv', {}, {}, false, true);

      expect(loading.showExporting).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      const mockResult = { filename: 'test.csv' };
      http.download.mockResolvedValue(mockResult);

      await exportImpl(mockApi, 'test-api-url/export', 'csv', {}, {}, false, false);

      expect(loading.showExporting).not.toHaveBeenCalled();
    });

    it('当 criteria 为空对象时应当正常工作', async () => {
      const mockResult = { filename: 'test.csv' };
      http.download.mockResolvedValue(mockResult);

      await exportImpl(mockApi, 'test-api-url/export', 'csv', {}, {}, false, false);

      expect(http.download).toHaveBeenCalledWith(
        'test-api-url/export',
        {},
        'text/csv',
        false,
      );
    });

    it('当 autoDownload 不是布尔值时应当抛出错误', () => {
      expect(() => exportImpl(mockApi, 'test-api-url/export', 'csv', {}, {}, 'invalid', false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => exportImpl(mockApi, 'test-api-url/export', 'csv', {}, {}, false, 'invalid'))
        .toThrow(TypeError);
    });

    it('应当正确处理包含未定义字段的 criteria', () => {
      const invalidCriteria = { name: 'test', invalidField: 'value' };
      expect(() => exportImpl(mockApi, 'test-api-url/export', 'csv', invalidCriteria, {}, false, false))
        .toThrow(TypeError);
    });
  });
});
