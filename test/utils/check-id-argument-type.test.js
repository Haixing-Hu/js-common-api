////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { checkIdArgumentType } from '../../src';

describe('checkArgumentId', () => {
  it('throws TypeError when value is null', () => {
    expect(() => checkIdArgumentType(null)).toThrow(TypeError);
  });

  it('throws TypeError when value is undefined', () => {
    expect(() => checkIdArgumentType(undefined)).toThrow(TypeError);
  });

  it('throws TypeError when value is not a string, number, or bigint', () => {
    expect(() => checkIdArgumentType({})).toThrow(TypeError);
  });

  it('does not throw when value is a string', () => {
    expect(() => checkIdArgumentType('123')).not.toThrow();
  });

  it('does not throw when value is a number', () => {
    expect(() => checkIdArgumentType(123)).not.toThrow();
  });

  it('does not throw when value is a bigint', () => {
    expect(() => checkIdArgumentType(BigInt(123))).not.toThrow();
  });

  it('throws TypeError when name is not a string', () => {
    expect(() => checkIdArgumentType(123, 456)).toThrow(TypeError);
  });

  it('uses default name when name is not provided', () => {
    expect(() => checkIdArgumentType(123)).not.toThrow();
  });
});
