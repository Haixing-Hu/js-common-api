////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { State } from '@qubit-ltd/common-model';
import checkObjectArgument from '../../src/utils/check-object-argument';

// 为测试创建一个简单的类
class TestClass {
  id = null;
  code = '';
  name = '';
  state = State.NORMAL;
  category = null;
  description = '';
  createTime = '';
  modifyTime = '';
  deleteTime = '';
}

// 定义测试的查询条件字段
const TEST_CRITERIA_DEFINITIONS = [
  // 名称中应包含的字符串
  { name: 'name', type: String },
  // 所属类别的ID
  { name: 'categoryId', type: [String, Number, BigInt] },
  // 状态
  { name: 'state', type: [State, String] },
  // 创建时间范围的起始值
  { name: 'createTimeStart', type: String },
  // 是否已经被标记删除
  { name: 'deleted', type: Boolean },
  // 额外字段，用于特定测试
  { name: 'extraField', type: String },
];

describe('checkObjectArgument', () => {
  describe('基本参数检查', () => {
    it('应当接受空对象', () => {
      expect(() => checkObjectArgument('criteria', {})).not.toThrow();
    });

    it('应当接受null（当nullable=true）', () => {
      expect(() => checkObjectArgument('criteria', null, [], true)).not.toThrow();
    });

    it('应当拒绝null（当nullable=false）', () => {
      expect(() => checkObjectArgument('criteria', null)).toThrow(TypeError);
    });

    it('应当拒绝非对象参数', () => {
      expect(() => checkObjectArgument('criteria', 'string')).toThrow(TypeError);
      expect(() => checkObjectArgument('criteria', 123)).toThrow(TypeError);
      expect(() => checkObjectArgument('criteria', true)).toThrow(TypeError);
    });
  });

  describe('使用definition', () => {
    it('应当接受合法的查询条件', () => {
      const criteria = {
        name: 'test',
        categoryId: '123',
        state: State.NORMAL,
        createTimeStart: '2023-01-01T00:00:00Z',
        deleted: false,
      };
      expect(() => checkObjectArgument('criteria', criteria, TEST_CRITERIA_DEFINITIONS)).not.toThrow();
    });

    it('应当接受值为null或undefined的字段', () => {
      const criteria = {
        name: 'test',
        categoryId: null,
        state: undefined,
      };
      expect(() => checkObjectArgument('criteria', criteria, TEST_CRITERIA_DEFINITIONS)).not.toThrow();
    });

    it('应当拒绝类型不匹配的字段', () => {
      const criteria = {
        name: 123, // 应该是String
      };
      expect(() => checkObjectArgument('criteria', criteria, TEST_CRITERIA_DEFINITIONS)).toThrow(TypeError);
    });

    it('应当拒绝未定义的字段', () => {
      const criteria = {
        unknownField: 'value', // 未在定义中声明的字段
      };
      expect(() => checkObjectArgument('criteria', criteria, TEST_CRITERIA_DEFINITIONS)).toThrow(TypeError);
    });

    it('应当接受extraField字段', () => {
      const criteria = {
        extraField: 'value',
      };
      expect(() => checkObjectArgument('criteria', criteria, TEST_CRITERIA_DEFINITIONS)).not.toThrow();
    });
  });

  describe('不使用definition', () => {
    it('应当接受任何字段，因为没有验证规则', () => {
      const criteria = {
        anyField: 'any value',
        anotherField: 123,
      };
      expect(() => checkObjectArgument('criteria', criteria)).not.toThrow();
    });

    it('应当接受空的definition数组', () => {
      const criteria = {
        anyField: 'any value',
      };
      expect(() => checkObjectArgument('criteria', criteria, [])).not.toThrow();
    });
  });
});
