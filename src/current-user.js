////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { toJSON } from '@haixing_hu/common-decorator';
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
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
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
   * @return {Promise<User>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`User`对象，包含了当前登录
   *     用户的完整信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getUser() {
    loading.showGetting();
    return http.get('/me/user').then((data) => {
      const result = User.create(data, assignOptions);
      logger.info('Successfully get the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户对应的用户的基本信息。
   *
   * @return {Promise<UserInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`UserInfo`对象，包含了当前
   *     登录用户的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getUserInfo() {
    loading.showGetting();
    return http.get('/me/user/info').then((data) => {
      const result = UserInfo.create(data, assignOptions);
      logger.info('Successfully get the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户的信息。
   *
   * @param {User} user
   *     待更新的`User`对象。
   * @return {Promise<User>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`UserInfo`对象，包含了当前登录用户的信息；
   *     若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateUser(user) {
    checkArgumentType('user', user, User);
    const data = toJSON(user, toJsonOptions);
    loading.showUpdating();
    return http.put('/me/user', data).then((data) => {
      const result = User.create(data, assignOptions);
      logger.info('Successfully update the current login user to:', result);
      return result;
    });
  }

  /**
   * 检测当前登录用户是否拥有个人信息。
   *
   * @return {Promise<boolean>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`boolean`值，表示当前登录
   *     用户是否拥有个人信息，即是否对应到某个`Person`对象；若操作失败，解析失败并返回一个
   *     `ErrorInfo`对象。
   */
  @Log
  existPerson() {
    loading.showGetting();
    return http.head('/me/person');
  }

  /**
   * 获取当前登录用户的个人信息。
   *
   * @return {Promise<Person>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，表示当前登录
   *     用户的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPerson() {
    loading.showGetting();
    return http.get('/me/person').then((data) => {
      const result = Person.create(data, assignOptions);
      logger.info('Successfully get the profile of the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户的个人信息的基本信息。
   *
   * @return {Promise<PersonInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`PersonInfo`对象，表示当前登录
   *     用户的个人信息的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getPersonInfo() {
    loading.showGetting();
    return http.get('/me/person/info').then((data) => {
      const result = PersonInfo.create(data, assignOptions);
      logger.info('Successfully get the basic profile of the current user:', result);
      return result;
    });
  }

  /**
   * 为当前登录用户新增个人信息。
   *
   * @param {Person} person
   *     待新增的个人信息。
   * @return {Promise<Person>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，包含了为当前
   *     登录用户新增的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  addPerson(person) {
    checkArgumentType('person', person, Person);
    const data = toJSON(person, toJsonOptions);
    loading.showUpdating();
    return http.post('/me/person', data).then((data) => {
      const result = Person.create(data, assignOptions);
      logger.info('Successfully add the profile of the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户的个人信息。
   *
   * @param {Person} person
   *     待更新的个人信息。
   * @return {Promise<Person>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Person`对象，包含了更新后
   *     的当前登录用户的个人信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updatePerson(person) {
    checkArgumentType('person', person, Person);
    const data = toJSON(person, toJsonOptions);
    loading.showUpdating();
    return http.put('/me/person', data).then((data) => {
      const result = Person.create(data, assignOptions);
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
   * @return {Promise<PersonInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`PersonInfo`对象，包含了
   *     当前登录用户所绑定的个人的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  bindPerson(name, mobile, credential, verifyCode) {
    checkArgumentType('name', name, String);
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('credential', credential, [Credential, CredentialInfo, Object]);
    checkArgumentType('verifyCode', verifyCode, String);
    const data = toJSON({
      name,
      mobile,
      credential: {
        type: credential.type,
        number: credential.number,
      },
      verifyCode,
    }, toJsonOptions);
    loading.showUpdating();
    return http.post('/me/person/bind', data).then((data) => {
      const result = PersonInfo.create(data, assignOptions);
      logger.info('Successfully bind the Person to the current user:', result);
      return result;
    });
  }

  /**
   * 检测当前登录用户是否绑定了某个员工。
   *
   * @return {Promise<boolean>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`boolean`值，表示当前登录
   *     用户是否绑定了某个员工，即是否对应到某个`Employee`对象；若操作失败，解析失败并返回
   *     一个`ErrorInfo`对象。
   */
  @Log
  existEmployee() {
    loading.showGetting();
    return http.head('/me/employee');
  }

  /**
   * 获取当前登录用户所绑定的员工信息。
   *
   * @return {Promise<Employee>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，表示当前登录
   *     用户所绑定的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEmployee() {
    loading.showGetting();
    return http.get('/me/employee').then((data) => {
      const result = Employee.create(data, assignOptions);
      logger.info('Successfully get the Employee of the current user:', result);
      return result;
    });
  }

  /**
   * 获取当前登录用户所绑定的员工的基本信息。
   *
   * @return {Promise<EmployeeInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`EmployeeInfo`对象，表示
   *     当前登录用户所绑定的员工的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getEmployeeInfo() {
    loading.showGetting();
    return http.get('/me/employee/info').then((data) => {
      const result = EmployeeInfo.create(data, assignOptions);
      logger.info('Successfully get the EmployeeInfo of the current user:', result);
      return result;
    });
  }

  /**
   * 为当前登录用户新增员工信息。
   *
   * 此接口会创建一个新的`Employee`对象，并将其与当前登录用户绑定到该对象。
   *
   * @param {Employee} employee
   *     待新增的员工信息。
   * @return {Promise<Employee>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，包含了为当前
   *     登录用户新增的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  addEmployee(employee) {
    checkArgumentType('employee', employee, Employee);
    const data = toJSON(employee, toJsonOptions);
    loading.showUpdating();
    return http.post('/me/employee', data).then((data) => {
      const result = Employee.create(data, assignOptions);
      logger.info('Successfully add an Employee to the current user:', result);
      return result;
    });
  }

  /**
   * 更新当前登录用户所绑定的员工的信息。
   *
   * 若当前登录用户未绑定到任何员工，则此接口会返回一个错误。
   *
   * @param {Employee} employee
   *     待更新的员工信息。
   * @return {Promise<Employee>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`Employee`对象，包含了更新后
   *     的当前登录用户的员工信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  updateEmployee(employee) {
    checkArgumentType('employee', employee, Employee);
    const data = toJSON(employee, toJsonOptions);
    loading.showUpdating();
    return http.put('/me/employee', data).then((data) => {
      const result = Employee.create(data, assignOptions);
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
   * @return {Promise<EmployeeInfo>}
   *     此 HTTP 请求的 Promise。若操作成功，解析成功并返回一个`EmployeeInfo`对象，包含了
   *     当前登录用户所绑定的员工的基本信息；若操作失败，解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  bindEmployee(name, mobile, organization, verifyCode) {
    checkArgumentType('name', name, String);
    checkArgumentType('mobile', mobile, String);
    checkArgumentType('organization', organization, [StatefulInfo, Info, Object]);
    checkArgumentType('verifyCode', verifyCode, String);
    const data = toJSON({
      name,
      mobile,
      organization,
      verifyCode,
    }, toJsonOptions);
    loading.showUpdating();
    return http.post('/me/employee/bind', data).then((data) => {
      const result = EmployeeInfo.create(data, assignOptions);
      logger.info('Successfully bind the Employee to the current user:', result);
      return result;
    });
  }
}

const currentUserApi = new CurrentUserApi();

export default currentUserApi;
