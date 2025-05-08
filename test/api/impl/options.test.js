////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { assignOptions, toJsonOptions } from '../../../src/api/impl/options';

describe('options.js', () => {
  describe('assignOptions', () => {
    it('应当返回默认选项当参数为null或undefined时', () => {
      expect(assignOptions(null)).toEqual({});
      expect(assignOptions(undefined)).toEqual({});
    });

    it('应当返回原始选项对象当它不为null或undefined时', () => {
      const options = { headers: { 'Content-Type': 'application/json' } };
      expect(assignOptions(options)).toBe(options);
    });
  });

  describe('toJsonOptions', () => {
    it('应当返回默认JSON选项当参数为null或undefined时', () => {
      const defaultJsonOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      expect(toJsonOptions(null)).toEqual(defaultJsonOptions);
      expect(toJsonOptions(undefined)).toEqual(defaultJsonOptions);
    });

    it('应当合并提供的选项和默认JSON选项', () => {
      const options = {
        headers: {
          'Authorization': 'Bearer token123',
        },
        timeout: 5000,
      };
      const expected = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
        timeout: 5000,
      };
      expect(toJsonOptions(options)).toEqual(expected);
    });

    it('应当允许覆盖默认的Content-Type', () => {
      const options = {
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': 'Bearer token123',
        },
      };
      expect(toJsonOptions(options)).toEqual(options);
    });

    it('应当正确处理不含headers的选项', () => {
      const options = {
        timeout: 5000,
      };
      const expected = {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      };
      expect(toJsonOptions(options)).toEqual(expected);
    });

    it('应当处理空对象', () => {
      const expected = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      expect(toJsonOptions({})).toEqual(expected);
    });
  });
}); 