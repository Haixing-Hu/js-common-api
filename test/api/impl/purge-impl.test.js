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
import { purgeImpl, purgeByKeyImpl, purgeAllImpl, batchPurgeImpl } from '../../../src/api/impl/purge-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    delete: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showPurging: jest.fn(),
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

describe('purge-impl.js', () => {
  beforeEach(() => {
    http.delete.mockReset();
    loading.showPurging.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('purgeImpl', () => {
    it('应当正确调用 DELETE API 彻底清除被删除的对象', async () => {
      http.delete.mockResolvedValue();

      await purgeImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/123', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully purge the deleted %s by its ID "%s".',
        'TestEntity',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      http.delete.mockResolvedValue();

      await purgeImpl(mockApi, 'test-api-url/{id}', '123', true);

      expect(loading.showPurging).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      http.delete.mockResolvedValue();

      await purgeImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(loading.showPurging).not.toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      http.delete.mockResolvedValue();
      const options = { force: true };

      await purgeImpl(mockApi, 'test-api-url/{id}', '123', false, options);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/123', { params: { force: true } });
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      expect(() => purgeImpl(mockApi, 'test-api-url/{id}', null, false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => purgeImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });
  });

  describe('purgeByKeyImpl', () => {
    it('应当正确调用 DELETE API 根据键彻底清除被删除的对象', async () => {
      http.delete.mockResolvedValue();

      await purgeByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/TEST_CODE', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully purged the deleted %s by its %s "%s".',
        'TestEntity',
        'code',
        'TEST_CODE',
      );
    });

    it('当键值为 null 时应当抛出错误', () => {
      expect(() => purgeByKeyImpl(mockApi, 'test-api-url/{code}', 'code', null, false))
        .toThrow(TypeError);
    });
  });

  describe('purgeAllImpl', () => {
    it('应当正确调用 DELETE API 彻底清除所有被删除的对象', async () => {
      const count = 15;
      http.delete.mockResolvedValue(count);

      const result = await purgeAllImpl(mockApi, 'test-api-url/all', false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/all', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully purge %d deleted %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });
  });

  describe('batchPurgeImpl', () => {
    it('应当正确调用 DELETE API 批量彻底清除被删除的对象', async () => {
      const count = 5;
      http.delete.mockResolvedValue(count);
      const ids = ['123', '456', '789'];

      const result = await batchPurgeImpl(mockApi, 'test-api-url/batch', ids, false);

      expect(http.delete).toHaveBeenCalledWith('test-api-url/batch', {
        data: ['123', '456', '789'],
        params: {},
      });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully batch purged %d deleted %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });

    it('当 IDs 数组为空时应当抛出错误', () => {
      expect(() => batchPurgeImpl(mockApi, 'test-api-url/batch', [], false))
        .toThrow(TypeError);
    });

    it('当 IDs 不是数组时应当抛出错误', () => {
      expect(() => batchPurgeImpl(mockApi, 'test-api-url/batch', 'invalid', false))
        .toThrow(TypeError);
    });
  });
});
