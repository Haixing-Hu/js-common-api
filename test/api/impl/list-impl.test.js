////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import { listImpl, listInfoImpl } from '../../../src/api/impl/list-impl';

// 模拟 axios
jest.mock('axios');

describe('list-impl.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    axios.post.mockReset();
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
        data: {
          total_count: 25,
          total_pages: 3,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', name: '测试1', state: 'NORMAL' },
            { id: '2', name: '测试2', state: 'NORMAL' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listImpl('test-api-url', criteria, { headers: { 'Content-Type': 'application/json' } });

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url/list', criteria, { headers: { 'Content-Type': 'application/json' } });
      expect(result).toEqual(mockResponse.data);
    });

    it('当查询条件为 null 时应当使用空对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          total_count: 25,
          total_pages: 3,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', name: '测试1', state: 'NORMAL' },
            { id: '2', name: '测试2', state: 'NORMAL' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listImpl('test-api-url', null);

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url/list', {}, {});
      expect(result).toEqual(mockResponse.data);
    });

    it('当服务器返回错误时应抛出异常', async () => {
      // 模拟查询参数和错误
      const criteria = { name: '测试' };
      const mockError = new Error('服务器错误');
      axios.post.mockRejectedValue(mockError);

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
        data: {
          total_count: 25,
          total_pages: 3,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', name: '测试1', state: 'NORMAL' },
            { id: '2', name: '测试2', state: 'NORMAL' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', criteria);

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url/list/info', criteria, {});
      expect(result).toEqual(mockResponse.data);
    });

    it('当查询条件为 null 时应当使用空对象', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          total_count: 25,
          total_pages: 3,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', name: '测试信息1' },
            { id: '2', name: '测试信息2' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', null);

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url/list/info', {}, {});
      expect(result).toEqual(mockResponse.data);
    });

    it('应当正确处理带有选项的请求', async () => {
      // 模拟查询参数、选项和返回数据
      const criteria = { name: '测试' };
      const options = {
        headers: { 'Authorization': 'Bearer token123' },
        timeout: 5000,
      };
      const mockResponse = {
        data: {
          total_count: 2,
          total_pages: 1,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', name: '测试信息1' },
            { id: '2', name: '测试信息2' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await listInfoImpl('test-api-url', criteria, options);

      // 验证
      expect(axios.post).toHaveBeenCalledWith('test-api-url/list/info', criteria, options);
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 