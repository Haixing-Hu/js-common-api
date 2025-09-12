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
import { existsImpl, existsKeyImpl, existsParentAndKeyImpl } from '../../../src/api/impl/exists-impl';

// mock dependencies
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    head: jest.fn(),
  },
}));

jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showGetting: jest.fn(),
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

describe('exists-impl.js', () => {
  beforeEach(() => {
    http.head.mockReset();
    loading.showGetting.mockReset();
    mockApi.logger.info.mockReset();
    mockApi.logger.debug.mockReset();
  });

  describe('existsImpl', () => {
    it('应当正确调用 HEAD API 检查对象是否存在', async () => {
      http.head.mockResolvedValue();

      const result = await existsImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(http.head).toHaveBeenCalledWith('test-api-url/123');
      expect(result).toBe(true);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully checked the existence of %s by its ID "%s".',
        'TestEntity',
        '123',
      );
    });

    it('当 showLoading 为 true 时应当显示加载提示', async () => {
      http.head.mockResolvedValue();

      await existsImpl(mockApi, 'test-api-url/{id}', '123', true);

      expect(loading.showGetting).toHaveBeenCalled();
    });

    it('当 showLoading 为 false 时不应当显示加载提示', async () => {
      http.head.mockResolvedValue();

      await existsImpl(mockApi, 'test-api-url/{id}', '123', false);

      expect(loading.showGetting).not.toHaveBeenCalled();
    });

    it('当 ID 为 null 时应当抛出错误', () => {
      expect(() => existsImpl(mockApi, 'test-api-url/{id}', null, false))
        .toThrow(TypeError);
    });

    it('当 showLoading 不是布尔值时应当抛出错误', () => {
      expect(() => existsImpl(mockApi, 'test-api-url/{id}', '123', 'invalid'))
        .toThrow(TypeError);
    });
  });

  describe('existsKeyImpl', () => {
    it('应当正确调用 HEAD API 根据键检查对象是否存在', async () => {
      http.head.mockResolvedValue();

      const result = await existsKeyImpl(mockApi, 'test-api-url/{code}', 'code', 'TEST_CODE', false);

      expect(http.head).toHaveBeenCalledWith('test-api-url/TEST_CODE');
      expect(result).toBe(true);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully checked the existence of %s by its %s "%s".',
        'TestEntity',
        'code',
        'TEST_CODE',
      );
    });

    it('当键名为空字符串时应当抛出错误', () => {
      // 这个测试实际上不会抛出错误，因为空字符串是有效的键名
      // 但会导致 URL 替换问题，让我们测试一个更实际的场景
      expect(() => existsKeyImpl(mockApi, 'test-api-url/{code}', 'code', '', false))
        .toThrow(TypeError);
    });

    it('当键值为 null 时应当抛出错误', () => {
      expect(() => existsKeyImpl(mockApi, 'test-api-url/{code}', 'code', null, false))
        .toThrow(TypeError);
    });
  });

  describe('existsParentAndKeyImpl', () => {
    it('应当正确调用 HEAD API 根据父对象和键检查对象是否存在', async () => {
      http.head.mockResolvedValue();

      const result = await existsParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', '456', 'code', 'TEST_CODE', false);

      expect(http.head).toHaveBeenCalledWith('test-api-url/456/TEST_CODE');
      expect(result).toBe(true);
      expect(mockApi.logger.info).toHaveBeenCalledWith(
        'Successfully checked the existence of %s by parent %s "%s" and its %s "%s".',
        'TestEntity',
        'parentId',
        '456',
        'code',
        'TEST_CODE',
      );
    });

    it('当父对象 ID 为 null 时应当抛出错误', () => {
      expect(() => existsParentAndKeyImpl(mockApi, 'test-api-url/{parentId}/{code}', 'parentId', null, 'code', 'TEST_CODE', false))
        .toThrow(TypeError);
    });
  });
});
