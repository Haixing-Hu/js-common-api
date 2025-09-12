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
import { eraseImpl, eraseByKeyImpl, eraseAllImpl, batchEraseImpl } from '../../../src/api/impl/erase-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    delete: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showErasing: jest.fn(),
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

describe('erase-impl.js', () => {
  beforeEach(() => {
    http.delete.mockReset();
    loading.showErasing.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('eraseImpl', () => {
    it('应当正确调用 DELETE API 彻底清除对象', async () => {
      http.delete.mockResolvedValue();

      await eraseImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/123', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully erase the %s by its ID "%s".',
        'TestEntity',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      http.delete.mockResolvedValue();

      await eraseImpl(mockApi, 'test-api-url/{id}', '123', true);

      expect(loading.showErasing).toHaveBeenCalled();
      expect(http.delete).toHaveBeenCalledWith('test-api-url/123', { params: {} });
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      http.delete.mockResolvedValue();

      await eraseImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(loading.showErasing).not.toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      http.delete.mockResolvedValue();
      const options = { force: true };

      await eraseImpl(mockApi, 'test-api-url/{id}', '123', false, options);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/123', { params: { force: true } });
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      expect(() => eraseImpl(mockApi, 'test-api-url/{id}', null, false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => eraseImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });
  });

  describe('eraseByKeyImpl', () => {
    it('应当正确调用 DELETE API 根据键彻底清除对象', async () => {
      http.delete.mockResolvedValue();

      await eraseByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/TEST_CODE', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully erased the %s by its %s "%s".',
        'TestEntity',
        'code',
        'TEST_CODE',
      );
    });

    it('当键值为 null 时应当抛出错误', () => {
      expect(() => eraseByKeyImpl(mockApi, 'test-api-url/{code}', 'code', null, false))
        .toThrow(TypeError);
    });
  });

  describe('eraseAllImpl', () => {
    it('应当正确调用 DELETE API 彻底清除所有对象', async () => {
      const count = 10;
      http.delete.mockResolvedValue(count);

      const result = await eraseAllImpl(mockApi, 'test-api-url/all', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/all', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully erase %d deleted %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });
  });

  describe('batchEraseImpl', () => {
    it('应当正确调用 DELETE API 批量彻底清除对象', async () => {
      const count = 3;
      http.delete.mockResolvedValue(count);
      const ids = ['123', '456', '789'];

      const result = await batchEraseImpl(mockApi, 'test-api-url/batch', ids, false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/batch', {
        data: ['123', '456', '789'],
        params: {},
      });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully batch erased %d %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });

    it('当 IDs 数组为空时应当抛出错误', () => {
      expect(() => batchEraseImpl(mockApi, 'test-api-url/batch', [], false))
        .toThrow(TypeError);
    });

    it('当 IDs 不是数组时应当抛出错误', () => {
      expect(() => batchEraseImpl(mockApi, 'test-api-url/batch', 'invalid', false))
        .toThrow(TypeError);
    });
  });
});
