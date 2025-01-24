////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { stringifyId, toJSON } from '@qubit-ltd/common-decorator';
import { http } from '@qubit-ltd/common-app';
import { PageRequest, TaskInfo, TaskStatus } from '@qubit-ltd/common-model';
import { loading } from '@qubit-ltd/common-ui';
import { checkArgumentType } from '@qubit-ltd/common-util';
import { Log, Logger } from '@qubit-ltd/logging';
import { assignOptions, toJsonOptions } from './impl/options';

const logger = Logger.getLogger('TaskApi');

/**
 * 提供管理`TaskInfo`对象的API。
 *
 * @author 胡海星
 */
class TaskApi {
  /**
   * 列出符合条件的`TaskInfo`对象。
   *
   * @param {PageRequest} pageRequest
   *     分页请求。
   * @param {object} criteria
   *     查询条件参数，所有条件之间用`AND`连接。允许的条件包括：
   *  - `categoryId: string|number|bigint` 所属类别的ID；
   *  - `categoryCode: string` 所属类别的编码；
   *  - `categoryName: string` 所属类别的名称包含的字符串；
   *  - `targetEntity: string` 任务目标对象实体名称；若不提供，则忽略此条件；
   *  - `targetId: string|number|bigint` 任务目标对象ID；若不提供，则忽略此条件；
   *  - `resultEntity: string` 任务结果对象实体名称；若不提供，则忽略此条件；
   *  - `resultId: string|number|bigint` 任务结果对象ID；若不提供，则忽略此条件；
   *  - `status: TaskStatus|string` 任务状态；若不提供，则忽略此条件；
   *  - `submitTimeStart: string` 提交时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `submitTimeEnd: string` 提交时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   *  - `startTimeStart: string` 开始时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `startTimeEnd: string` 开始时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   *  - `cancelTimeStart: string` 取消时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `cancelTimeEnd: string` 取消时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   *  - `finishTimeStart: string` 完成时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `finishTimeEnd: string` 完成时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   *  - `createTimeStart: string` 创建时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `createTimeEnd: string` 创建时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   *  - `modifyTimeStart: string` 修改时间范围的（闭区间）起始值；若不提供，则忽略此条件；
   *  - `modifyTimeEnd: string` 修改时间范围的（闭区间）结束值；若不提供，则忽略此条件；
   * @param {object} sort
   *     排序参数，指定按照哪个属性排序；若不提供，则忽略此参数。允许的条件包括：
   *  - `sortField: string` 用于排序的属性名称（CamelCase形式）；
   *  - `sortOrder: SortOrder` 指定是正序还是倒序。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<Page<TaskInfo>|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回一个`Page`对象，包含符合条
   *     件的`TaskInfo`对象的分页数据；若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  list(pageRequest, criteria = {}, sort = {}, showLoading = true) {
    checkArgumentType('pageRequest', pageRequest, [PageRequest, Object]);
    checkArgumentType('criteria', criteria, Object);
    checkArgumentType('sort', sort, Object);
    checkArgumentType('showLoading', showLoading, Boolean);
    const params = toJSON({
      ...pageRequest,
      ...criteria,
      ...sort,
    }, toJsonOptions);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get('/task', {
      params,
    }).then((obj) => {
      const page = TaskInfo.createPage(obj, assignOptions);
      logger.info('Successfully list the TaskInfo.');
      logger.debug('The page of TaskInfo is:', page);
      return page;
    });
  }

  /**
   * 获取指定的`TaskInfo`对象。
   *
   * @param {string|number|bigint} id
   *     `TaskInfo`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<TaskInfo|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`TaskInfo`对象；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  get(id, showLoading = true) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/task/${stringifyId(id)}`).then((obj) => {
      const result = TaskInfo.create(obj, assignOptions);
      logger.info('Successfully get the TaskInfo by ID:', id);
      logger.debug('The TaskInfo is:', result);
      return result;
    });
  }

  /**
   * 获取指定的`TaskInfo`的状态。
   *
   * @param {string|number|bigint} id
   *     `TaskInfo`对象的ID。
   * @param {boolean} showLoading
   *     是否显示加载提示。
   * @return {Promise<TaskStatus|ErrorInfo>}
   *     此HTTP请求的`Promise`对象。若操作成功，则解析成功并返回指定的`TaskInfo`对象的状态；
   *     若操作失败，则解析失败并返回一个`ErrorInfo`对象。
   */
  @Log
  getStatus(id, showLoading = true) {
    checkArgumentType('id', id, [String, Number, BigInt]);
    checkArgumentType('showLoading', showLoading, Boolean);
    if (showLoading) {
      loading.showGetting();
    }
    return http.get(`/task/${stringifyId(id)}/status`).then((obj) => {
      const result = TaskStatus.of(obj);
      logger.info('Successfully get the status of the TaskInfo:', id);
      logger.debug('The status of the TaskInfo is:', result);
      return result;
    });
  }
}

const taskApi = new TaskApi();

export default taskApi;
