////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import { userApi } from '../../src';

// 模拟 axios
jest.mock('axios');

describe('user.js', () => {
  // 在每次测试前重置 mock
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();
  });

  describe('get', () => {
    it('应当正确获取用户信息', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800138000',
          state: 'NORMAL',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.get('123');

      // 验证
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users/123'), expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getByUsername', () => {
    it('应当正确通过用户名获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800138000',
          state: 'NORMAL',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByUsername('testuser');

      // 验证
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users/username/testuser'), expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getByEmail', () => {
    it('应当正确通过邮箱获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800138000',
          state: 'NORMAL',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByEmail('test@example.com');

      // 验证
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users/email/test@example.com'), expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getByPhone', () => {
    it('应当正确通过手机号获取用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800138000',
          state: 'NORMAL',
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.getByPhone('13800138000');

      // 验证
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users/phone/13800138000'), expect.any(Object));
      expect(result).toEqual(mockResponse.data);
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
        data: {
          id: '456',
          username: 'newuser',
          email: 'new@example.com',
          phone: '13900139000',
          state: 'NORMAL',
          createTime: '2023-07-01T12:00:00Z',
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.add(newUser);

      // 验证
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/users'), newUser, expect.any(Object));
      expect(result).toEqual(mockResponse.data);
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
        data: {
          id: '123',
          username: 'testuser',
          email: 'updated@example.com',
          phone: '13911139000',
          state: 'NORMAL',
          modifyTime: '2023-07-02T12:00:00Z',
        },
      };
      axios.put.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.update(updatedUser);

      // 验证
      expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/users/123'), updatedUser, expect.any(Object));
      expect(result).toEqual(mockResponse.data);
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
        data: {
          total_count: 25,
          total_pages: 3,
          page_index: 0,
          page_size: 10,
          content: [
            { id: '1', username: 'user1', state: 'NORMAL' },
            { id: '2', username: 'user2', state: 'NORMAL' },
          ],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.list(criteria);

      // 验证
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/users/list'), criteria, expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('应当正确删除用户', async () => {
      // 模拟返回数据
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          state: 'DELETED',
          deleteTime: '2023-07-03T12:00:00Z',
        },
      };
      axios.delete.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.delete('123');

      // 验证
      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/123'), expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('changePassword', () => {
    it('应当正确修改用户密码', async () => {
      // 模拟参数和返回数据
      const mockResponse = {
        data: {
          success: true,
        },
      };
      axios.put.mockResolvedValue(mockResponse);

      // 调用函数
      const result = await userApi.changePassword('123', 'oldpassword', 'newpassword');

      // 验证
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/users/123/password'),
        {
          oldPassword: 'oldpassword',
          newPassword: 'newpassword',
        },
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 