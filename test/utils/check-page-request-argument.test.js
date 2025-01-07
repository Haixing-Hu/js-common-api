////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { PageRequest } from '@qubit-ltd/common-model';
import { checkPageRequestArgument } from '../../src';

describe('checkArgumentPageRequest', () => {
  it('throws TypeError when pageRequest is null', () => {
    expect(() => checkPageRequestArgument(null)).toThrow(TypeError);
  });

  it('throws TypeError when pageRequest is undefined', () => {
    expect(() => checkPageRequestArgument(undefined)).toThrow(TypeError);
  });

  it('throws TypeError when pageRequest is not an object', () => {
    expect(() => checkPageRequestArgument(123)).toThrow(TypeError);
  });

  it('throws TypeError when pageRequest.pageIndex is not a number', () => {
    const pageRequest = { pageIndex: 'one', pageSize: 10 };
    expect(() => checkPageRequestArgument(pageRequest)).toThrow(TypeError);
  });

  it('throws TypeError when pageRequest.pageSize is not a number', () => {
    const pageRequest = { pageIndex: 1, pageSize: 'ten' };
    expect(() => checkPageRequestArgument(pageRequest)).toThrow(TypeError);
  });

  it('does not throw when pageRequest is a valid PageRequest object', () => {
    const pageRequest = new PageRequest(1, 10);
    expect(() => checkPageRequestArgument(pageRequest)).not.toThrow();
  });

  it('does not throw when pageRequest is a valid plain object', () => {
    const pageRequest = { pageIndex: 1, pageSize: 10 };
    expect(() => checkPageRequestArgument(pageRequest)).not.toThrow();
  });

  it('does not throw when pageRequest is an empty plain object', () => {
    const pageRequest = {};
    expect(() => checkPageRequestArgument(pageRequest)).not.toThrow();
  });

  it('does not throw when pageRequest has only pageSize', () => {
    const pageRequest = { pageSize: 10 };
    expect(() => checkPageRequestArgument(pageRequest)).not.toThrow();
  });

  it('does not throw when pageRequest has only pageIndex', () => {
    const pageRequest = { pageIndex: 0 };
    expect(() => checkPageRequestArgument(pageRequest)).not.toThrow();
  });
});
