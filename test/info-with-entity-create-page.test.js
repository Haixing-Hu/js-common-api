////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '@qubit-ltd/json';
import { InfoWithEntity } from '@qubit-ltd/common-model';
import { assignOptions } from '../src';

describe('info-with-entity-create-page.js', () => {
  it('createPage() should work', () => {
    const json = '{"total_count":30,"total_pages":1,"page_index":0,"page_size":100,"content":[{"id":830615658940071946,"code":"research-plan-authenticity-study-rws","name":"真实性研究 RWS","entity":"RESEARCH_PLAN"},{"id":830615658940071969,"code":"research-plan-high-risk-study","name":"高风险研究","entity":"RESEARCH_PLAN"},{"id":830615658940071954,"code":"research-plan-randomized-controlled-trial","name":"随机对照试验","entity":"RESEARCH_PLAN"},{"id":830615658940071951,"code":"research-plan-blocked-study","name":"阻断试验","entity":"RESEARCH_PLAN"},{"id":830615658940071959,"code":"research-plan-phase-i-study","name":"阶段I试验","entity":"RESEARCH_PLAN"},{"id":830615658940071960,"code":"research-plan-phase-ii-study","name":"阶段II试验","entity":"RESEARCH_PLAN"},{"id":830615658940071961,"code":"research-plan-phase-iii-study","name":"阶段III试验","entity":"RESEARCH_PLAN"},{"id":830615658940071955,"code":"research-plan-paired-study","name":"配对试验","entity":"RESEARCH_PLAN"},{"id":830615658940071950,"code":"research-plan-adaptive-design-study","name":"适应性设计试验","entity":"RESEARCH_PLAN"},{"id":830615658940071963,"code":"research-plan-diagnostic-study","name":"诊断性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071976,"code":"research-plan-evaluative-study","name":"评估研究","entity":"RESEARCH_PLAN"},{"id":830615658940071975,"code":"research-plan-explanatory-study","name":"解释性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071964,"code":"research-plan-observational-study","name":"观察性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071958,"code":"research-plan-drug-registration-clinical-trial-ind","name":"药物注册临床试验 IND","entity":"RESEARCH_PLAN"},{"id":830615658940071972,"code":"research-plan-social-science-study","name":"社会科学研究","entity":"RESEARCH_PLAN"},{"id":830615658940071943,"code":"research-plan-iit-study","name":"IIT研究","entity":"RESEARCH_PLAN"},{"id":830615658940071968,"code":"research-plan-special-high-risk-study","name":"特殊高风险研究","entity":"RESEARCH_PLAN"},{"id":830615658940071971,"code":"research-plan-epidemiological-study","name":"流行病学研究","entity":"RESEARCH_PLAN"},{"id":830615658940071965,"code":"research-plan-cross-sectional-study","name":"横断面研究","entity":"RESEARCH_PLAN"},{"id":830615658940071952,"code":"research-plan-unordered-study","name":"无序试验","entity":"RESEARCH_PLAN"},{"id":830615658940071956,"code":"research-plan-no-control-group-study","name":"无对照组试验","entity":"RESEARCH_PLAN"},{"id":830615658940071974,"code":"research-plan-descriptive-study","name":"描述性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071973,"code":"research-plan-exploratory-study","name":"探索性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071962,"code":"research-plan-intervention-study-is","name":"干预性研究 IS","entity":"RESEARCH_PLAN"},{"id":830615658940071953,"code":"research-plan-large-cohort-study","name":"大规模队列研究","entity":"RESEARCH_PLAN"},{"id":830615658940071948,"code":"research-plan-multicenter-study","name":"多中心试验","entity":"RESEARCH_PLAN"},{"id":830615658940071967,"code":"research-plan-retrospective-study","name":"回顾性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071966,"code":"research-plan-prospective-study","name":"前瞻性研究","entity":"RESEARCH_PLAN"},{"id":830615658940071970,"code":"research-plan-low-risk-study","name":"低风险研究","entity":"RESEARCH_PLAN"},{"id":830615658940071957,"code":"research-plan-crossover-study","name":"交叉试验","entity":"RESEARCH_PLAN"}]}';
    const obj = Json.parse(json);
    const page = InfoWithEntity.createPage(obj, assignOptions);
    expect(page.totalCount).toBe(30);
    expect(page.totalPages).toBe(1);
    expect(page.pageIndex).toBe(0);
    expect(page.pageSize).toBe(100);
    expect(page.content).toHaveLength(30);
    for (const item of page.content) {
      expect(item).toBeInstanceOf(InfoWithEntity);
    }
  });
});
