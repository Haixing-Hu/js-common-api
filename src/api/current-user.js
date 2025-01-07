////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@qubit-ltd/common-app';
import { toJSON } from '@qubit-ltd/common-decorator';
import {
  Credential,
  CredentialInfo,
  Employee,
  EmployeeInfo,
  Info,
  Person,
  PersonInfo,
  StatefulInfo,
  User,
  UserInfo,
} from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('CurrentUserApi');

/**
 * 提供对当前登录用户的操作的API。
 *
 * @author 胡海星
 */
class CurrentUserApi {
  /**
   * 获取当前登录用户对应的用户的信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`User`对象，包含了当前登录
   *     用户的完整信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getUser(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/user').then((obj) => {
      const result = User.create(obj, assignOptions);
      logger.info('Successfully get the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户对应的用户的基本信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<UserInfo|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`UserInfo`对象，包含了当前
   *     登录用户的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getUserInfo(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/user/info').then((obj) => {
      const result = UserInfo.create(obj, assignOptions);
      logger.info('Successfully get the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户的信息。
   *
   * @param {User|object} user
   *     待更新的`User`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<User|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`UserInfo`对象，包含了当前登录用户的信息；
   *     若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateUser(user, showLoading = true) {
    checkArgumentType('user', user, [User, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(user, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put('/me/user', data).then((obj) => {
      const result = User.create(obj, assignOptions);
      logger.info('Successfully update the current login user to:', result);
      return result;
    });
  }

  /**
   * 检测当前登录用户是否拥有个人信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<boolean|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`boolean`值，表示当前登录
   *     用户是否拥有个人信息，即是否对应到某个`Person`对象；若操作失败，解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  existPerson(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.head('/me/person');
  }

  /**
   * 获取当前登录用户的个人信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，表示当前登录
   *     用户的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPerson(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/person').then((obj) => {
      const result = Person.create(obj, assignOptions);
      logger.info('Successfully get the profile of the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户的个人信息的基本信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`PersonInfo`对象，表示当前登录
   *     用户的个人信息的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPersonInfo(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/person/info').then((obj) => {
      const result = PersonInfo.create(obj, assignOptions);
      logger.info('Successfully get the basic profile of the current user:', result);
      return result;
    });
  }

  /**
   * 为当前登录用户新增个人信息。
   *
   * @param {Person|object} person
   *     待新增的个人信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，包含了为当前
   *     登录用户新增的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  addPerson(person, showLoading = true) {
    checkArgumentType('person', person, [Person, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(person, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.post('/me/person', data).then((obj) => {
      const result = Person.create(obj, assignOptions);
      logger.info('Successfully add the profile of the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户的个人信息。
   *
   * @param {Person|object} person
   *     待更新的个人信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Person|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，包含了更新后
   *     的当前登录用户的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updatePerson(person, showLoading = true) {
    checkArgumentType('person', person, [Person, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(person, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put('/me/person', data).then((obj) => {
      const result = Person.create(obj, assignOptions);
      logger.info('Successfully update the profile of the current user to:', result);
      return result;
    });
  }

  /**
   * 将当前登录用户绑定到指定的个人。
   *
   * @param {string} name
   *     待绑定的个人的姓名。
   * @param {string} mobile
   *     待绑定的个人的手机号码。
   * @param {Credential|CredentialInfo|object} credential
   *     待绑定的个人的证件。
   * @param {string} verifyCode
   *     待绑定的个人收到的验证码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<PersonInfo|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`PersonInfo`对象，包含了
   *     当前登录用户所绑定的个人的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  bindPerson(name, mobile, credential, verifyCode, showLoading = true) {
    checkArgumentType('name', name, String);
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('credential', credential, [Credential, CredentialInfo, Object]);
    checkArgumentType('verifyCode', verifyCode, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON({
      name,
      mobile,
      credential: {
        type: credential.type,
        number: credential.number,
      },
      verifyCode,
    }, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.post('/me/person/bind', data).then((obj) => {
      const result = PersonInfo.create(obj, assignOptions);
      logger.info('Successfully bind the Person to the current user:', result);
      return result;
    });
  }

  /**
   * 检测当前登录用户是否绑定了某个员工。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<boolean|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`boolean`值，表示当前登录
   *     用户是否绑定了某个员工，即是否对应到某个`Employee`对象；若操作失败，解析失败并返回
   *     一个`ErrorInfo`对象。
   */
  @Log
  existEmployee(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.head('/me/employee');
  }

  /**
   * 获取当前登录用户所绑定的员工信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，表示当前登录
   *     用户所绑定的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEmployee(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/employee').then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully get the Employee of the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户所绑定的员工的基本信息。
   *
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`EmployeeInfo`对象，表示
   *     当前登录用户所绑定的员工的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEmployeeInfo(showLoading = true) {
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/me/employee/info').then((obj) => {
      const result = EmployeeInfo.create(obj, assignOptions);
      logger.info('Successfully get the EmployeeInfo of the current user:', result);
      return result;
    });
  }

  /**
   * 为当前登录用户新增员工信息。
   *
   * 此接口会创建一个新的`Employee`对象，并将其与当前登录用户绑定到该对象。
   *
   * @param {Employee|object} employee
   *     待新增的员工信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，包含了为当前
   *     登录用户新增的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  addEmployee(employee, showLoading = true) {
    checkArgumentType('employee', employee, [Employee, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(employee, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.post('/me/employee', data).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully add an Employee to the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户所绑定的员工的信息。
   *
   * 若当前登录用户未绑定到任何员工，则此接口会返回一个错误。
   *
   * @param {Employee|object} employee
   *     待更新的员工信息。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Employee|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，包含了更新后
   *     的当前登录用户的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateEmployee(employee, showLoading = true) {
    checkArgumentType('employee', employee, [Employee, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(employee, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put('/me/employee', data).then((obj) => {
      const result = Employee.create(obj, assignOptions);
      logger.info('Successfully update the Employee of the current user to:', result);
      return result;
    });
  }

  /**
   * 将当前登录用户绑定到指定的员工。
   *
   * @param {string} name
   *     待绑定的员工的姓名。
   * @param {string} mobile
   *     待绑定的员工的手机号码。
   * @param {StatefulInfo|Info|object} organization
   *     待绑定的员工所属机构的信息。
   * @param {string} verifyCode
   *     待绑定的员工收到的验证码。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<EmployeeInfo|ErrorInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`EmployeeInfo`对象，包含了
   *     当前登录用户所绑定的员工的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  bindEmployee(name, mobile, organization, verifyCode, showLoading = true) {
    checkArgumentType('name', name, String);
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('organization', organization, [StatefulInfo, Info, Object]);
    checkArgumentType('verifyCode', verifyCode, String);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON({
      name,
      mobile,
      organization,
      verifyCode,
    }, toJsonOptions);
    if (showLoading) {
      loading.showUpdating();
    }
    return http.post('/me/employee/bind', data).then((obj) => {
      const result = EmployeeInfo.create(obj, assignOptions);
      logger.info('Successfully bind the Employee to the current user:', result);
      return result;
    });
  }
}

const currentUserApi = new CurrentUserApi();

export default currentUserApi;
