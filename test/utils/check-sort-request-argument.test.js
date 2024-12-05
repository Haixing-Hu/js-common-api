////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { SortRequest, SortOrder } from '@haixing_hu/common-model';
import { checkSortRequestArgument } from '../../src';

describe('checkArgumentSortRequest', () => {
  it('throws TypeError when sortRequest is null', () => {
    expect(() => checkSortRequestArgument(null)).toThrow(TypeError);
  });

  it('throws TypeError when sortRequest is undefined', () => {
    expect(() => checkSortRequestArgument(undefined)).toThrow(TypeError);
  });

  it('throws TypeError when sortRequest is not an object', () => {
    expect(() => checkSortRequestArgument(123)).toThrow(TypeError);
  });

  it('throws TypeError when sortRequest.sortField is not a string', () => {
    const sortRequest = { sortField: 123, sortOrder: SortOrder.ASCENDING };
    expect(() => checkSortRequestArgument(sortRequest)).toThrow(TypeError);
  });

  it(
    'throws TypeError when sortRequest.sortOrder is not a valid SortOrder or string',
    () => {
      const sortRequest = { sortField: 'name', sortOrder: 123 };
      expect(() => checkSortRequestArgument(sortRequest)).toThrow(TypeError);
    });

  it('does not throw when sortRequest is a valid SortRequest object', () => {
    const sortRequest = new SortRequest('name', SortOrder.ASC);
    expect(() => checkSortRequestArgument(sortRequest)).not.toThrow();
  });

  it('does not throw when sortRequest is a valid plain object', () => {
    const sortRequest = { sortField: 'name', sortOrder: SortOrder.DESC };
    expect(() => checkSortRequestArgument(sortRequest)).not.toThrow();
  });

  it('throws TypeError when sortField is not a field of the entity class',
    () => {
      class Entity {
        constructor() {
          this.id = 1;
          this.name = 'entity';
        }
      }

      const sortRequest = {
        sortField: 'invalidField',
        sortOrder: SortOrder.ASC,
      };
      expect(() => checkSortRequestArgument(sortRequest, Entity)).toThrow(TypeError);
    });

  it('does not throw when sortField is a field of the entity class', () => {
    class Entity {
      id = 1;

      name = 'entity';
    }

    const sortRequest = { sortField: 'name', sortOrder: SortOrder.DESC };
    expect(() => checkSortRequestArgument(sortRequest, Entity)).not.toThrow();
  });

  it('does not throws when sortField is not provided', () => {
    const sortRequest = { sortOrder: SortOrder.DESC };
    expect(() => checkSortRequestArgument(sortRequest)).not.toThrow();
  });

  it('does not throws when sortOrder is not provided', () => {
    const sortRequest = { sortField: 'name' };
    expect(() => checkSortRequestArgument(sortRequest)).not.toThrow();
  });

  it('does not throws for an empty object', () => {
    const sortRequest = { };
    expect(() => checkSortRequestArgument(sortRequest)).not.toThrow();
  });

  it('does not throw when sortField is not provided', () => {
    class Entity {
      id = 1;

      name = 'entity';
    }

    const sortRequest = { sortOrder: SortOrder.DESC };
    expect(() => checkSortRequestArgument(sortRequest, Entity)).not.toThrow();
  });
});
