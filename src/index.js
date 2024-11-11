////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import appApi from './api/app';
import appAuthenticateApi from './api/app-authenticate';
import attachmentApi from './api/attachment';
import categoryApi from './api/category';
import cityApi from './api/city';
import countryApi from './api/country';
import currentUserApi from './api/current-user';
import departmentApi from './api/department';
import deviceApi from './api/device';
import deviceInitApi from './api/device-init';
import dictApi from './api/dict';
import dictEntryApi from './api/dict-entry';
import districtApi from './api/district';
import employeeApi from './api/employee';
import feedbackApi from './api/feedback';
import fileApi from './api/file';
import organizationApi from './api/organization';
import personApi from './api/person';
import provinceApi from './api/province';
import settingApi from './api/setting';
import socialNetworkAccountApi from './api/social-network-account';
import streetApi from './api/street';
import systemApi from './api/system';
import uploadApi from './api/upload';
import userAuthenticateApi from './api/user-authenticate';
import verifyCodeApi from './api/verify-code';
import wechatApi from './api/wechat';
import { assignOptions, toJsonOptions } from './api/impl/options';
import wechat from './utils/wechat';

export {
  appApi,
  appAuthenticateApi,
  attachmentApi,
  categoryApi,
  cityApi,
  countryApi,
  currentUserApi,
  departmentApi,
  deviceApi,
  deviceInitApi,
  dictApi,
  dictEntryApi,
  districtApi,
  employeeApi,
  feedbackApi,
  fileApi,
  organizationApi,
  personApi,
  provinceApi,
  settingApi,
  socialNetworkAccountApi,
  streetApi,
  systemApi,
  uploadApi,
  userAuthenticateApi,
  verifyCodeApi,
  wechatApi,
  assignOptions,
  toJsonOptions,
  wechat,
};
