////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

import babelParser from '@babel/eslint-parser';
import qubitConfig from '@qubit-ltd/eslint-config';

export default [
  {
    ignores: ['dist/**', 'doc/**', 'coverage/**', 'node_modules/**'],
  },
  ...qubitConfig,
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
      globals: {
        BigInt: true,
        File: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        fail: 'readonly',
      },
    },
  },
];
