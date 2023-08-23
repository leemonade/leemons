/* eslint-disable no-param-reassign */
import { detailProgramRequest, listProgramsRequest } from '@academic-portfolio/request';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
} from '@bubbles-ui/components';
import { AdminPageHeader, uuidv4 } from '@bubbles-ui/leemons';
import { useStore } from '@common/useStore';
import prefixPN from '@grades/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { clone, cloneDeep, find, forIn, identity, isNil, isString, map, pickBy } from 'lodash';
import React, { useMemo } from 'react';
import {
  PROMOTION_DETAIL_FORM_ERROR_MESSAGES,
  PromotionDetail,
} from '../../../components/PromotionDetail';
import { TreeItem } from '../../../components/TreeItem/TreeItem';
import { activeMenuItemDependencies } from '../../../helpers/activeMenuItemDependencies';
import { getDataTypes } from '../../../helpers/getDataTypes';
import { getOperators } from '../../../helpers/getOperators';
import { getPromotionDetailMessages } from '../../../helpers/getPromotionDetailMessages';
import { getScaleLabel } from '../../../helpers/getScaleLabel';
import { getSources } from '../../../helpers/getSources';
import {
  addPromotionRequest,
  deletePromotionRequest,
  listGradesRequest,
  listPromotionsRequest,
  updatePromotionRequest,
} from '../../../request';

export default function PromotionsList() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('promotionsPage'));
  const [tC] = useTranslateLoader(prefixPN('conditionOptions'));
  const [tP] = useTranslateLoader(prefixPN('promotionDetail'));

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
      sources: getSources(tC),
      dataTypes: getDataTypes(tC),
      operators: getOperators(tC),
    };
    store.treeData = getTreeData();
    store.loading = false;

    render();
  }

  async function onChange({ program: programId }, { name }, useRender = true) {
    if (name === 'program') {
      const program = await getProgramDetail(programId);
      store.selectData.gradeScales = map(
        find(store.grades, { id: program.evaluationSystem }).scales,
        (scale) => ({
          label: getScaleLabel(scale),
          value: scale.id,
        })
      );

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
    }
    if (useRender) render();
  }

  function onAdd() {
    store.selectedPromotion = {
      name: null,
      program: null,
      grade: null,
      group: {
        operator: 'and',
        conditions: [{ id: '1', source: '', sourceIds: [], data: '', operator: '', target: 0 }],
      },
    };
    render();
  }

  async function onSelect(e) {
    function processGroup(group) {
      return {
        ...group,
        // eslint-disable-next-line no-use-before-define
        conditions: map(group.conditions, processCondition),
      };
    }

    function processCondition(condition) {
      if (condition.group) {
        condition.group = processGroup(condition.group);
      }
      if (condition.targetGradeScale) {
        condition.target = condition.targetGradeScale;
        delete condition.targetGradeScale;
      }
      return {
        id: uuidv4(),
        ...condition,
      };
    }

    store.selectedPromotion = cloneDeep(find(store.promotions, { id: e.id }));
    store.selectedPromotion.group = processGroup(store.selectedPromotion.group);

    await Promise.all([
      onChange(store.selectedPromotion, { name: 'program' }, false),
      onChange(store.selectedPromotion, { name: 'grade' }, false),
    ]);

    render();
  }

  async function onDelete(e) {
    try {
      await deletePromotionRequest(e.id);
      if (store.selectedPromotion && store.selectedPromotion.id === e.id) {
        store.selectedPromotion = null;
      }
      await onSelectCenter(store.center);
      await addSuccessAlert(t('successDelete'));
    } catch (err) {
      await addErrorAlert(err.message);
    }
  }

  function parseConditions(_group) {
    function parseCondition({ id, ...condition }) {
      if (isString(condition.target)) {
        condition.targetGradeScale = condition.target;
        delete condition.target;
      }
      if (isNil(condition.dataTargets)) {
        delete condition.dataTargets;
      }
      if (condition.group) {
        return {
          ...condition,
          // eslint-disable-next-line no-use-before-define
          group: parseConditionGroup(condition.group),
        };
      }
      return pickBy(condition, identity);
    }

    function parseConditionGroup(group) {
      return {
        ...group,
        conditions: map(group.conditions, parseCondition),
      };
    }

    return parseConditionGroup(_group);
  }

  async function onSubmit(e) {
    try {
      if (!store.saving) {
        store.saving = true;
        render();

        if (e.id) {
          const { created_at, deleted, deleted_at, updated_at, subject, isDependency, ...data } = e;
          await updatePromotionRequest({
            ...data,
            group: parseConditions(e.group),
          });
        } else {
          await addPromotionRequest({
            ...e,
            center: store.center,
            group: parseConditions(e.group),
          });
        }

        store.selectedPromotion = null;
        store.saving = false;
        await Promise.all([onSelectCenter(store.center), activeMenuItemDependencies()]);
        await addSuccessAlert(t('successSave'));
      }
    } catch (error) {
      store.saving = false;
      render();
      await addErrorAlert(error.message);
    }
  }

  const messages = useMemo(() => getPromotionDetailMessages(tP), [t]);

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
              <Col span={4}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    {!tLoading && (
                      <Box>
                        <SelectCenter label={t('selectCenter')} onChange={onSelectCenter} />
                      </Box>
                    )}
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
              <Col span={8}>
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
