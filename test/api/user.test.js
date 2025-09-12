////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// import axios from 'axios'; // 暂时不需要
import { loading } from '@qubit-ltd/common-ui';
import { http } from '@qubit-ltd/common-app';
import { userApi } from '../../src';

// 模拟 http
jest.mock('@qubit-ltd/common-app', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// 模拟 loading
jest.mock('@qubit-ltd/common-ui', () => ({
  loading: {
    showGetting: jest.fn(),
    showAdding: jest.fn(),
    showUpdating: jest.fn(),
    showDeleting: jest.fn(),
    setImpl: jest.fn(),
  },
}));

describe('user.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    // 设置 loading 实现
    loading.setImpl({});

    http.get.mockReset();
    http.post.mockReset();
    http.put.mockReset();
    http.delete.mockReset();
  });

  describe('get', () => {
    it('应当正确获取用户信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        state: 'NORMAL',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.get('123');

      // 验证
      expect(http.get).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('getByUsername', () => {
    it('应当正确通过用户名获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        state: 'NORMAL',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByUsername('testuser');

      // 验证
      expect(http.get).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('getByEmail', () => {
    it('应当正确通过邮箱获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        state: 'NORMAL',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByEmail('test@example.com');

      // 验证
      expect(http.get).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('getByMobile', () => {
    it('应当正确通过手机号获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        state: 'NORMAL',
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByMobile('13800138000');

      // 验证
      expect(http.get).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('add', () => {
    it('应当正确添加新用户', async () => {
      // 模拟用户对象和返回数据
      const newUser = {
        username: 'newuser',
        password: 'password123',
        email: 'new@example.com',
        phone: '13900139000',
      };
      const mockResponse = {
        id: '456',
        username: 'newuser',
        email: 'new@example.com',
        phone: '13900139000',
        state: 'NORMAL',
        createTime: '2023-07-01T12:00:00Z',
      };
      http.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.add(newUser);

      // 验证
      expect(http.post).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 456,
        username: 'newuser',
        email: 'new@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('update', () => {
    it('应当正确更新用户信息', async () => {
      // 模拟用户对象和返回数据
      const updatedUser = {
        id: '123',
        email: 'updated@example.com',
        phone: '13911139000',
      };
      const mockResponse = {
        id: '123',
        username: 'testuser',
        email: 'updated@example.com',
        phone: '13911139000',
        state: 'NORMAL',
        modifyTime: '2023-07-02T12:00:00Z',
      };
      http.put.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.update(updatedUser);

      // 验证
      expect(http.put).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        username: 'testuser',
        email: 'updated@example.com',
      });
      expect(result.state.value).toBe('NORMAL');
    });
  });

  describe('list', () => {
    it('应当正确获取用户列表', async () => {
      // 模拟查询参数和返回数据
      const criteria = {
        state: 'NORMAL',
        pageIndex: 0,
        pageSize: 10,
      };
      const mockResponse = {
        total_count: 25,
        total_pages: 3,
        page_index: 0,
        page_size: 10,
        content: [
          { id: '1', username: 'user1', state: 'NORMAL' },
          { id: '2', username: 'user2', state: 'NORMAL' },
        ],
      };
      http.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.list(criteria);

      // 验证
      expect(http.get).toHaveBeenCalled();
      expect(result).toMatchObject({
        totalCount: 25,
        totalPages: 3,
        pageIndex: 0,
        pageSize: 10,
      });
      expect(result.content).toHaveLength(2);
      expect(result.content[0]).toMatchObject({
        id: 1,
        username: 'user1',
      });
      expect(result.content[0].state.value).toBe('NORMAL');
      expect(result.content[1]).toMatchObject({
        id: 2,
        username: 'user2',
      });
      expect(result.content[1].state.value).toBe('NORMAL');
    });
  });

  describe('delete', () => {
    it('应当正确删除用户', async () => {
      // 模拟返回数据
      const mockResponse = null; // delete 方法返回 undefined
      http.delete.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.delete('123');

      // 验证
      expect(http.delete).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('updatePassword', () => {
    it('应当正确修改用户密码', async () => {
      // 模拟参数和返回数据
      const mockResponse = {
        success: true,
      };
      http.put.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.updatePassword('123', 'newpassword');

      // 验证
      expect(http.put).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
