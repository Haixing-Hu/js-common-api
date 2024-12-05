////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { http } from '@haixing_hu/common-app';
import { stringifyId, toJSON } from '@haixing_hu/common-decorator';
import {
  Feedback,
  FeedbackAction,
  FeedbackTrack,
  PageRequest,
} from '@haixing_hu/common-model';
import { loading } from '@haixing_hu/common-ui';
import { checkArgumentType } from '@haixing_hu/common-util';
import { Log, Logger } from '@haixing_hu/logging';
import checkCriteriaArgument from '../utils/check-criteria-argument';
import checkIdArgumentType from '../utils/check-id-argument-type';
import checkPageRequestArgument from '../utils/check-page-request-argument';
import checkSortRequestArgument from '../utils/check-sort-request-argument';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('FeedbackApi');

/**
 * 提供管理`Feedback`对象的API。
 *
 * @author 胡海星
 */
class FeedbackApi {
  /**
   * 列出符合条件的`Feedback`对象。
   *
   * @param {PageRequest|object} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `appId: string|number|bigint` 所属应用的ID；
   *  - `appCode: string` 所属应用的编码；
   *  - `appName: string` 所属应用的名称中应包含的字符串；
   *  - `type: FeedbackType|string` 类型；
   *  - `category: string` 具体类别；
   *  - `submitterId: string|number|bigint` 提交用户的ID；
   *  - `submitterUsername: string` 提交用户的用户名；
   *  - `status: FeedbackStatus|string` 状态；
   *  - `deleted: boolean` 是否已经被标记删除；
   *  - `createTimeStart: string`创建时间范围的（闭区间）起始值；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；
   *  - `deleteTimeStart: string` 标记删除时间范围的（闭区间）起始值；
   *  - `deleteTimeEnd: string` 标记删除时间范围的（闭区间）结束值；
   * @param {object} sortRequest
   *     排序参数。允许的参数包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<Feedback>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`Feedback`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest = {}, criteria = {}, sortRequest = {}, transformUrls = true, showLoading = true) {
    checkPageRequestArgument(pageRequest);
    checkCriteriaArgument(criteria, Feedback);
    checkSortRequestArgument(sortRequest, Feedback);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sortRequest,
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/feedback', {
      params,
    }).then((obj) => {
      const page = Feedback.createPage(obj, assignOptions);
      logger.info('Successfully list the Feedback.');
      logger.debug('The page of Feedback is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Feedback|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Feedback`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, transformUrls = true, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/feedback/${stringifyId(id)}`, { params }).then((obj) => {
      const result = Feedback.create(obj, assignOptions);
      logger.info('Successfully get the Feedback by ID:', id);
      logger.debug('The Feedback is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`Feedback`的所有跟踪记录列表。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {boolean} transformUrls
   *     是否转换附件中的URL为完整URL。默认值为`true`。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Array<FeedbackTrack>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`Feedback`
   *     的所有`FeedbackTrack`对象列表；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getTracks(id, transformUrls = true, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('transformUrls', transformUrls, Boolean);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      transformUrls,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/feedback/${stringifyId(id)}/track`, { params }).then((obj) => {
      const result = FeedbackTrack.createArray(obj, assignOptions);
      logger.info('Successfully get all tracks of Feedback by ID:', id);
      logger.debug('The FeedbackTrack is:', result);
      return result;
    });
  }

  /**
   * 添加一个`Feedback`对象。
   *
   * @param {Feedback|object} feedback
   *     要添加的`Feedback`对象。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Feedback|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`Feedback`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  add(feedback, showLoading = true) {
    checkArgumentType('feedback', feedback, [Feedback, Object]);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(feedback, toJsonOptions);
    if (showLoading) {
      loading.showAdding();
    }
    return http.post('/feedback', data).then((obj) => {
      const result = Feedback.create(obj, assignOptions);
      logger.info('Successfully add the Feedback:', result.id);
      logger.debug('The added Feedback is:', result);
      return result;
    });
  }

  /**
   * 根据ID，更新一个`Feedback`对象。
   *
   * @param {string|number|bigint} id
   *     指定的`Feedback`对象的ID。
   * @param {FeedbackAction|string} action
   *     待执行的操作。
   * @param {FeedbackTrack} track
   *     操作的跟踪记录。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<FeedbackTrack|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回新增的`FeedbackTrack`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  performAction(id, action, track, showLoading = true) {
    checkIdArgumentType(id);
    checkArgumentType('action', action, [FeedbackAction, String]);
    checkArgumentType('track', track, FeedbackTrack);
    checkArgumentType('showLoading', showLoading, Boolean);
    const data = toJSON(track, toJsonOptions);
    const url = `/feedback/${stringifyId(id)}/action/${action}`;
    if (showLoading) {
      loading.showUpdating();
    }
    return http.put(url, data).then((obj) => {
      const result = FeedbackTrack.create(obj, assignOptions);
      logger.info('Successfully perform the action %s to the Feedback:', action, id);
      logger.debug('The added FeedbackTrack is:', result);
      return result;
    });
  }
}

const feedbackApi = new FeedbackApi();

export default feedbackApi;
