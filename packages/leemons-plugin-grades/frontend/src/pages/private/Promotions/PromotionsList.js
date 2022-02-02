import React, { useMemo } from 'react';
import { clone, cloneDeep, find, forIn, map } from 'lodash';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { SelectCenter } from '@users/components/SelectCenter';
import { useStore } from '@common/useStore';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { detailProgramRequest, listProgramsRequest } from '@academic-portfolio/request';
import {
  addPromotionRequest,
  deletePromotionRequest,
  listGradesRequest,
  listPromotionsRequest,
} from '../../../request';
import { TreeItem } from '../../../components/TreeItem/TreeItem';
import {
  PROMOTION_DETAIL_FORM_ERROR_MESSAGES,
  PROMOTION_DETAIL_FORM_MESSAGES,
  PromotionDetail,
} from '../../../components/PromotionDetail';
import { addPromotion } from '../../../request/promotions';

export default function PromotionsList() {
  const [t] = useTranslateLoader(prefixPN('promotionsPage'));

  const [store, render] = useStore();

  const headerValues = useMemo(
    () => ({
      title: t('pageTitle'),
      description: t('pageDescription'),
    }),
    [t]
  );

  async function getPromotions() {
    const {
      data: { items },
    } = await listPromotionsRequest({ page: 0, size: 9999, center: store.center });
    return items;
  }

  async function getPrograms() {
    const {
      data: { items },
    } = await listProgramsRequest({ page: 0, size: 9999, center: store.center });
    return items;
  }

  async function getProgramDetail(programId) {
    const { program } = await detailProgramRequest(programId);
    return program;
  }

  async function getGrades() {
    const {
      data: { items },
    } = await listGradesRequest({ page: 0, size: 9999, center: store.center });
    return items;
  }

  function getTreeData() {
    const data = map(store.promotions, (grade) => ({
      id: grade.id,
      parent: 0,
      text: grade.name,
      draggable: false,
      render: TreeItem,
    }));
    data.push({
      id: 'add',
      parent: 0,
      text: t('addPromotion'),
      type: 'button',
      draggable: false,
      data: {
        action: 'add',
      },
    });
    return data;
  }

  function getSources() {
    return [
      {
        label: t('sourceProgram'),
        value: 'program',
      },
      {
        label: t('sourceCourse'),
        value: 'course',
      },
      {
        label: t('sourceKnowledge'),
        value: 'knowledge',
      },
      {
        label: t('sourceSubject'),
        value: 'subject',
      },
      {
        label: t('sourceSubjectType'),
        value: 'subject-type',
      },
      {
        label: t('sourceSubjectGroup'),
        value: 'subject-group',
      },
    ];
  }

  function getDataTypes() {
    return [
      {
        label: t('dataTypeGPA'),
        value: 'gpa',
      },
      {
        label: t('dataTypeCPP'),
        value: 'cpp',
      },
      {
        label: t('dataTypeCPC'),
        value: 'cpc',
      },
      {
        label: t('dataTypeCPCG'),
        value: 'cpcg',
      },
      {
        label: t('dataTypeGrade'),
        value: 'grade',
      },
      {
        label: t('dataTypeEnrolled'),
        value: 'enrolled',
      },
      {
        label: t('dataTypeCredits'),
        value: 'credits',
      },
    ];
  }

  function getOperators() {
    return [
      {
        label: t('operatorGT'),
        value: 'gt',
      },
      {
        label: t('operatorGTE'),
        value: 'gte',
      },
      {
        label: t('operatorEQ'),
        value: 'eq',
      },
      {
        label: t('operatorLTE'),
        value: 'lte',
      },
      {
        label: t('operatorLT'),
        value: 'lt',
      },
      {
        label: t('operatorNEQ'),
        value: 'neq',
      },
      {
        label: t('operatorContains'),
        value: 'contains',
      },
    ];
  }

  async function onSelectCenter(center) {
    store.loading = true;
    render();

    store.center = center;
    const [promotions, programs, grades] = await Promise.all([
      getPromotions(),
      getPrograms(),
      getGrades(),
    ]);
    store.promotions = promotions;
    store.programs = programs;
    store.grades = grades;
    store.selectData = {
      programs: map(programs, (program) => ({ label: program.name, value: program.id })),
      grades: map(grades, (grade) => ({ label: grade.name, value: grade.id })),
      sources: getSources(),
      dataTypes: getDataTypes(),
      operators: getOperators(),
    };
    store.treeData = getTreeData();
    store.loading = false;

    render();
  }

  async function onChange({ program: programId }, { name }) {
    if (name === 'program') {
      const program = await getProgramDetail(programId);
      store.selectData.courses = map(program.courses, (course) => ({
        label: course.name || t('courseName', { index: course.index }),
        value: course.id,
      }));
      store.selectData.knowledges = map(program.knowledges, (knowledge) => ({
        label: knowledge.name,
        value: knowledge.id,
      }));
      store.selectData.subjects = map(program.subjects, (subject) => ({
        label: subject.name,
        value: subject.id,
      }));
      store.selectData.subjectTypes = map(program.subjectType, (subjectType) => ({
        label: subjectType.name,
        value: subjectType.id,
      }));
      store.selectData.groups = map(program.groups, (group) => ({
        label: group.name,
        value: group.id,
      }));
      render();
    }
  }

  function onAdd() {
    store.selectedPromotion = {
      group: {
        operator: 'and',
        conditions: [{ id: '1', source: '', sourceIds: [], data: '', operator: '', target: 0 }],
      },
    };
    render();
  }

  function onSelect(e) {
    store.selectedPromotion = cloneDeep(find(store.promotions, { id: e.id }));
    render();
  }

  async function onDelete(e) {
    try {
      await deletePromotionRequest(e.id);
      await onSelectCenter(store.center);
      await addSuccessAlert(t('successDelete'));
    } catch (err) {
      await addErrorAlert(err.message);
    }
  }

  function removeConditionIds(_group) {
    function removeConditionId({ id, ...condition }) {
      if (condition.group) {
        return {
          ...condition,
          // eslint-disable-next-line no-use-before-define
          group: removeGroupConditionIds(condition.group),
        };
      }
      return condition;
    }

    function removeGroupConditionIds(group) {
      return {
        ...group,
        conditions: map(group.conditions, removeConditionId),
      };
    }

    return removeGroupConditionIds(_group);
  }

  async function onSubmit(e) {
    try {
      if (!store.saving) {
        store.saving = true;
        render();

        const promotion = await addPromotionRequest({
          ...e,
          center: store.center,
          group: removeConditionIds(e.group),
        });
        console.log(promotion);

        store.selectedPromotion = null;
        store.saving = false;
        await onSelectCenter(store.center);
        await addSuccessAlert(t('successSave'));
      }
    } catch (error) {
      store.saving = false;
      render();
      await addErrorAlert(error.message);
    }
  }

  const messages = useMemo(() => {
    const m = clone(PROMOTION_DETAIL_FORM_MESSAGES);
    forIn(m, (value, key) => {
      m[key] = t(`detail.${key}`);
    });
    return m;
  }, [t]);

  const errorMessages = useMemo(() => {
    const m = clone(PROMOTION_DETAIL_FORM_ERROR_MESSAGES);
    forIn(m, (value, key) => {
      m[key] = t(`detail.${key}`);
    });
    return m;
  }, [t]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerValues} />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Box>
                      <SelectCenter label={t('selectCenter')} onChange={onSelectCenter} />
                    </Box>
                    {store.center && (
                      <Box>
                        <Tree
                          treeData={store.treeData}
                          selectedNode={store.selectedPromotion?.id}
                          onAdd={onAdd}
                          onDelete={onDelete}
                          onSelect={onSelect}
                        />
                      </Box>
                    )}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {store.selectedPromotion && (
                  <Paper fullWidth padding={5}>
                    <PromotionDetail
                      defaultValues={store.selectedPromotion}
                      selectData={store.selectData}
                      onChange={onChange}
                      messages={messages}
                      errorMessages={errorMessages}
                      onSubmit={onSubmit}
                      isSaving={store.saving}
                    />
                  </Paper>
                )}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
