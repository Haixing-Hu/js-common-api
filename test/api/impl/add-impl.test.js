////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import addImpl from '../../../src/api/impl/add-impl';

// 模拟 axios
jest.mock('axios');

describe('add-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    axios.post.mockReset();
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
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象',
          description: '这是一个测试对象',
          createTime: '2023-07-01T12:00:00Z',
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await addImpl('test-api-url', newObj, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url', newObj, { headers: { 'Content-Type': 'application/json' } });
      expect(result).toEqual(mockResponse.data);
    });

    it('当对象为空时应当抛出错误', async () => {
      await expect(addImpl('test-api-url', null)).rejects.toThrow(TypeError);
      await expect(addImpl('test-api-url', undefined)).rejects.toThrow(TypeError);
    });

    it('当对象不是对象类型时应当抛出错误', async () => {
      await expect(addImpl('test-api-url', 'not-an-object')).rejects.toThrow(TypeError);
      await expect(addImpl('test-api-url', 123)).rejects.toThrow(TypeError);
      await expect(addImpl('test-api-url', true)).rejects.toThrow(TypeError);
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟对象和错误
      const newObj = { code: 'test-code', name: '测试对象' };
      const mockError = new Error('服务器错误');
      axios.post.mockRejectedValue(mockError);

      // 验证异常
      await expect(addImpl('test-api-url', newObj)).rejects.toThrow('服务器错误');
    });

    it('应当正确处理带有选项的请求', async () => {
      // 模拟对象、选项和返回数据
      const newObj = { code: 'test-code', name: '测试对象' };
      const options = { 
        headers: { 'Authorization': 'Bearer token123' },
        timeout: 5000
      };
      const mockResponse = {
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象',
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await addImpl('test-api-url', newObj, options);

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url', newObj, options);
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 