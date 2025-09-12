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
import addImpl from '../../../src/api/impl/add-impl';

// mock http.post
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    post: jest.fn(),
  },
}));

// 定义一个测试类
class TestEntity {
  constructor(data) {
    Object.assign(this, data);
  }

  static create(obj) {
    return new TestEntity(obj);
  }
}

// 构造最简 mock api
const mockApi = {
  entityClass: TestEntity,
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
  },
};

describe('add-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    http.post.mockReset();
  });

  describe('addImpl', () => {
    it('应当正确调用 POST API 添加新对象并返回结果', async () => {
      // 模拟对象和返回数据
      const newObj = {
        code: 'test-code',
        name: '测试对象',
        description: '这是一个测试对象',
      };
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象',
        description: '这是一个测试对象',
        createTime: '2023-07-01T12:00:00Z',
      };
      http.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await addImpl(mockApi, 'test-api-url', newObj, false, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(http.post).toHaveBeenCalledWith('test-api-url', newObj, { params: { headers: { 'content-type': 'application/json' } } });
      expect(result).toEqual(mockResponse);
    });

    it('当对象为null时应当抛出错误', async () => {
      // 由于 API 实现会直接抛出错误，我们直接验证这个行为
      try {
        await addImpl(mockApi, 'test-api-url', null, false);
        // 如果没有抛出错误，测试应该失败
        fail('应当抛出TypeError');
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toContain("The value of the argument 'entity' cannot be null");
      }
    });

    it('当对象不是对象类型时应当抛出错误', async () => {
      // 由于 API 实现会直接抛出错误，我们直接验证这个行为
      try {
        await addImpl(mockApi, 'test-api-url', 'not-an-object', false);
        // 如果没有抛出错误，测试应该失败
        fail('应当抛出TypeError');
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toContain("The value of the argument 'entity' must be of one of the specified types");
      }
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟对象和错误
      const newObj = { code: 'test-code', name: '测试对象' };
      const mockError = new Error('服务器错误');
      http.post.mockRejectedValue(mockError);

      // 验证异常
      await expect(addImpl(mockApi, 'test-api-url', newObj, false)).rejects.toThrow('服务器错误');
    });

    it('应当正确处理带有选项的请求', async () => {
      // 模拟对象、选项和返回数据
      const newObj = { code: 'test-code', name: '测试对象' };
      const options = {
        headers: { 'Authorization': 'Bearer token123' },
        timeout: 5000,
      };
      const mockResponse = {
        id: '123',
        code: 'test-code',
        name: '测试对象',
      };
      http.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await addImpl(mockApi, 'test-api-url', newObj, false, options);

      // 验证
      expect(http.post).toHaveBeenCalledWith('test-api-url', newObj, { params: { headers: { 'authorization': 'Bearer token123' }, timeout: 5000 } });
      expect(result).toEqual(mockResponse);
    });
  });
});
