////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkIdArrayArgumentType } from '../../src';

describe('checkIdArrayArgumentType', () => {
  it('throws TypeError when value is null', () => {
    expect(() => checkIdArrayArgumentType(null)).toThrow(TypeError);
  });

  it('throws TypeError when value is undefined', () => {
    expect(() => checkIdArrayArgumentType(undefined)).toThrow(TypeError);
  });

  it('throws TypeError when value is not an array', () => {
    expect(() => checkIdArrayArgumentType({})).toThrow(TypeError);
    expect(() => checkIdArrayArgumentType('not-an-array')).toThrow(TypeError);
    expect(() => checkIdArrayArgumentType(123)).toThrow(TypeError);
  });

  it('does not throw when value is an empty array', () => {
    expect(() => checkIdArrayArgumentType([])).not.toThrow();
  });

  it('does not throw when value is an array of valid IDs', () => {
    expect(() => checkIdArrayArgumentType(['123', 456, BigInt(789)])).not.toThrow();
  });

  it('throws TypeError when array contains invalid ID', () => {
    expect(() => checkIdArrayArgumentType(['123', {}, 789])).toThrow(TypeError);
    expect(() => checkIdArrayArgumentType([null, '456'])).toThrow(TypeError);
    expect(() => checkIdArrayArgumentType([undefined, 123])).toThrow(TypeError);
  });

  it('throws TypeError when name is not a string', () => {
    expect(() => checkIdArrayArgumentType([], 123)).toThrow(TypeError);
  });

  it('uses default name when name is not provided', () => {
    expect(() => checkIdArrayArgumentType([])).not.toThrow();
  });

  it('generates correct parameter names for array elements in error messages', () => {
    try {
      checkIdArrayArgumentType(['123', null, 456], 'testIds');
      // 如果执行到这里，说明没有抛出异常，测试失败
      expect(true).toBe(false); // 强制测试失败
    } catch (e) {
      expect(e.message).toContain('testIds[1]');
    }
  });
});
