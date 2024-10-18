////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The options for the `assign()`, `create()`, and `createArray()` methods
 * of the class decorated by `@Model`.
 *
 * @type {object}
 */
const assignOptions = {
  normalize: true,
  convertNaming: true,
  sourceNamingStyle: 'LOWER_UNDERSCORE',
  targetNamingStyle: 'LOWER_CAMEL',
};

/**
 * The options for the `toJSON()` and `toJsonString()` methods of the
 * class decorated by `@Model`.
 *
 * @type {object}
 */
const toJsonOptions = {
  normalize: true,
  removeEmptyFields: true,
  convertNaming: true,
  sourceNamingStyle: 'LOWER_CAMEL',
  targetNamingStyle: 'LOWER_UNDERSCORE',
  space: undefined,
};

export {
  assignOptions,
  toJsonOptions,
};
