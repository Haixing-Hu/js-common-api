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
import { restoreImpl, restoreByKeyImpl, restoreAllImpl, batchRestoreImpl } from '../../../src/api/impl/restore-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    patch: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showRestoring: jest.fn(),
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

describe('restore-impl.js', () => {
  beforeEach(() => {
    http.patch.mockReset();
    loading.showRestoring.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('restoreImpl', () => {
    it('应当正确调用 PATCH API 恢复被删除的对象', async () => {
      http.patch.mockResolvedValue();

      await restoreImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(http.patch).toHaveBeenCalledWith('test-api-url/123', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully restore the deleted %s by its ID "%s".',
        'TestEntity',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      http.patch.mockResolvedValue();

      await restoreImpl(mockApi, 'test-api-url/{id}', '123', true);

      expect(loading.showRestoring).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      http.patch.mockResolvedValue();

      await restoreImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(loading.showRestoring).not.toHaveBeenCalled();
    });

    it('应当正确处理带有选项的请求', async () => {
      http.patch.mockResolvedValue();
      const options = { force: true };

      await restoreImpl(mockApi, 'test-api-url/{id}', '123', false, options);

      expect(http.patch).toHaveBeenCalledWith('test-api-url/123', { params: { force: true } });
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      expect(() => restoreImpl(mockApi, 'test-api-url/{id}', null, false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => restoreImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });
  });

  describe('restoreByKeyImpl', () => {
    it('应当正确调用 PATCH API 根据键恢复被删除的对象', async () => {
      http.patch.mockResolvedValue();

      await restoreByKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', false);

      expect(http.patch).toHaveBeenCalledWith('test-api-url/TEST_CODE', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully restored the deleted %s by its %s "%s".',
        'TestEntity',
        'code',
        'TEST_CODE',
      );
    });

    it('当键值为 null 时应当抛出错误', () => {
      expect(() => restoreByKeyImpl(mockApi, 'test-api-url/{code}', 'code', null, false))
        .toThrow(TypeError);
    });
  });

  describe('restoreAllImpl', () => {
    it('应当正确调用 PATCH API 恢复所有被删除的对象', async () => {
      const count = 8;
      http.patch.mockResolvedValue(count);

      const result = await restoreAllImpl(mockApi, 'test-api-url/all', false);

      expect(http.patch).toHaveBeenCalledWith('test-api-url/all', { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully restore %d deleted %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });
  });

  describe('batchRestoreImpl', () => {
    it('应当正确调用 PATCH API 批量恢复被删除的对象', async () => {
      const count = 4;
      http.patch.mockResolvedValue(count);
      const ids = ['123', '456', '789'];

      const result = await batchRestoreImpl(mockApi, 'test-api-url/batch', ids, false);

      expect(http.patch).toHaveBeenCalledWith('test-api-url/batch', ['123', '456', '789'], { params: {} });
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully batch restored %d deleted %ss.',
        count,
        'TestEntity',
      );
      expect(result).toBe(count);
    });

    it('当 IDs 数组为空时应当抛出错误', () => {
      expect(() => batchRestoreImpl(mockApi, 'test-api-url/batch', [], false))
        .toThrow(TypeError);
    });

    it('当 IDs 不是数组时应当抛出错误', () => {
      expect(() => batchRestoreImpl(mockApi, 'test-api-url/batch', 'invalid', false))
        .toThrow(TypeError);
    });
  });
});
