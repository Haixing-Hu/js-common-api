////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import { getImpl, getByKeyImpl, getInfoImpl, getInfoByKeyImpl } from '../../../src/api/impl/get-impl';

// 模拟 axios
jest.mock('axios');

describe('get-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    axios.get.mockReset();
  });

  describe('getImpl', () => {
    it('应当正确调用 API 并返回获取的对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getImpl('test-api-url', '123', { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(axios.get).toHaveBeenCalledWith('test-api-url/123', { headers: { 'Content-Type': 'application/json' } });
      expect(result).toEqual(mockResponse.data);
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟错误
      const mockError = new Error('API 错误');
      axios.get.mockRejectedValue(mockError);

      // 验证异常
      await expect(getImpl('test-api-url', '123')).rejects.toThrow('API 错误');
    });
  });

  describe('getByKeyImpl', () => {
    it('应当正确调用带 key 的 API 并返回获取的对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getByKeyImpl('test-api-url', 'test-code', { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(axios.get).toHaveBeenCalledWith('test-api-url/key/test-code', { headers: { 'Content-Type': 'application/json' } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getInfoImpl', () => {
    it('应当正确调用 info API 并返回获取的对象信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象信息',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getInfoImpl('test-api-url', '123');

      // 验证
      expect(axios.get).toHaveBeenCalledWith('test-api-url/123/info', {});
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getInfoByKeyImpl', () => {
    it('应当正确调用带 key 的 info API 并返回获取的对象信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          code: 'test-code',
          name: '测试对象信息',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await getInfoByKeyImpl('test-api-url', 'test-code');

      // 验证
      expect(axios.get).toHaveBeenCalledWith('test-api-url/key/test-code/info', {});
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 