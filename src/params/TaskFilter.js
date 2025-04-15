////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Label,
  Model,
  Normalizable,
  Nullable,
  Type,
  Validatable,
} from '@qubit-ltd/common-decorator';
import {
  dateToEndTimestamp,
  dateToStartTimestamp,
} from '@qubit-ltd/common-filter';
import { InfoWithEntity, TaskStatus } from '@qubit-ltd/common-model';
import Normalizer from '@qubit-ltd/common-normalizer';
import Validator from '@qubit-ltd/common-validator';

/**
 * 此模型表示任务过滤器。
 *
 * @author 胡海星
 */
@Model
class TaskFilter {
  /**
   * 任务类别基本信息。
   *
   * @type {InfoWithEntity|null}
   */
  @Validatable
  @Normalizable
  @Type(InfoWithEntity)
  @Label('类别')
  category = null;

  /**
   * 任务的目标对象的实体类型。
   *
   * @type {string|null}
   */
  @Normalizable
  @Label('目标实体')
  targetEntity = '';

  /**
   * 任务的目标对象的唯一标识符。
   *
   * @type {string|number|bigint|null}
   */
  @Validatable(Validator.id)
  @Normalizable(Normalizer.id)
  @Label('目标ID')
  targetId = null;

  /**
   * 任务的结果对象的实体类型。
   *
   * @type {string}
   */
  @Validatable
  @Normalizable
  @Label('结果实体')
  @Nullable
  resultEntity = '';

  /**
   * 任务的结果对象的唯一标识符。
   *
   * @type {string|number|bigint|null}
   */
  @Validatable(Validator.id)
  @Normalizable(Normalizer.id)
  @Label('结果ID')
  @Nullable
  resultId = null;

  /**
   * 任务状态。
   *
   * @type {TaskStatus}
   */
  @Normalizable
  @Type(TaskStatus)
  @Label('状态')
  status = null;

  /**
   * 开始日期起始值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('开始日期起始值')
  @Nullable
  startDateStart = '';

  /**
   * 开始日期结束值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('开始日期结束值')
  @Nullable
  startDateEnd = '';

  /**
   * 取消日期起始值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('取消日期起始值')
  @Nullable
  cancelDateStart = '';

  /**
   * 取消日期结束值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('取消日期结束值')
  @Nullable
  cancelDateEnd = '';

  /**
   * 完成日期起始值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('完成日期起始值')
  @Nullable
  finishDateStart = '';

  /**
   * 完成日期结束值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('完成日期结束值')
  @Nullable
  finishDateEnd = '';

  /**
   * 创建日期起始值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('创建日期起始值')
  createDateStart = '';

  /**
   * 创建日期结束值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('创建日期结束值')
  createDateEnd = '';

  /**
   * 修改日期起始值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('修改日期起始值')
  @Nullable
  modifyDateStart = '';

  /**
   * 修改日期结束值，以 ISO-8601 格式表示。
   *
   * @type {string}
   */
  @Validatable(Validator.timestamp)
  @Normalizable(Normalizer.timestamp)
  @Label('修改日期结束值')
  @Nullable
  modifyDateEnd = '';

  /**
   * 将此模型转换为查询条件。
   *
   * @return {object}
   */
  toCriteria() {
    return {
      categoryId: this.category?.id,
      categoryCode: this.category?.code,
      categoryName: this.category?.name,
      targetEntity: this.targetEntity,
      targetId: this.targetId,
      status: this.status,
      cancelTimeStart: dateToStartTimestamp(this.cancelDateStart),
      cancelTimeEnd: dateToEndTimestamp(this.cancelDateEnd),
      startTimeStart: dateToStartTimestamp(this.startDateStart),
      startTimeEnd: dateToEndTimestamp(this.startDateEnd),
      finishTimeStart: dateToStartTimestamp(this.finishDateStart),
      finishTimeEnd: dateToEndTimestamp(this.finishDateEnd),
      createTimeStart: dateToStartTimestamp(this.createDateStart),
      createTimeEnd: dateToEndTimestamp(this.createDateEnd),
      modifyTimeStart: dateToStartTimestamp(this.modifyDateStart),
      modifyTimeEnd: dateToEndTimestamp(this.modifyDateEnd),
    };
  }
}

export default TaskFilter;
