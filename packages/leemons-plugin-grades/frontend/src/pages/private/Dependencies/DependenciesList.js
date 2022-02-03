/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import { clone, cloneDeep, find, forIn, isNil, isString, map } from 'lodash';
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
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { SelectCenter } from '@users/components/SelectCenter';
import { useStore } from '@common/useStore';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { detailProgramRequest, listProgramsRequest } from '@academic-portfolio/request';
import {
  addDependencyRequest,
  deleteDependencyRequest,
  listDependenciesRequest,
  listGradesRequest,
  updateDependencyRequest,
} from '../../../request';
import { TreeItem } from '../../../components/TreeItem/TreeItem';
import {
  PROMOTION_DETAIL_FORM_ERROR_MESSAGES,
  PromotionDetail,
} from '../../../components/PromotionDetail';
import { getOperators } from '../../../helpers/getOperators';
import { getDataTypes } from '../../../helpers/getDataTypes';
import { getSources } from '../../../helpers/getSources';
import { getPromotionDetailMessages } from '../../../helpers/getPromotionDetailMessages';

export default function DependenciesList() {
  const [t] = useTranslateLoader(prefixPN('dependenciesPage'));
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

  async function getDependencies() {
    const {
      data: { items },
    } = await listDependenciesRequest({ page: 0, size: 9999, center: store.center });
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
    const data = map(store.dependencies, (grade) => ({
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
    const [dependencies, programs, grades] = await Promise.all([
      getDependencies(),
      getPrograms(),
      getGrades(),
    ]);
    store.dependencies = dependencies;
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

  async function onChange({ program: programId, grade: gradeId }, { name }, useRender = true) {
    if (name === 'grade') {
      store.selectData.gradeScales = map(find(store.grades, { id: gradeId }).scales, (scale) => ({
        label: `${scale.letter ? `${scale.letter} (` : ''} ${scale.number}${
          scale.letter ? `)` : ''
        }`,
        value: scale.id,
      }));
    }
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
    }
    if (useRender) render();
  }

  function onAdd() {
    store.selectedDependency = {
      name: null,
      program: null,
      grade: null,
      subject: null,
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

    store.selectedDependency = cloneDeep(find(store.dependencies, { id: e.id }));
    store.selectedDependency.group = processGroup(store.selectedDependency.group);

    await Promise.all([
      onChange(store.selectedDependency, { name: 'program' }, false),
      onChange(store.selectedDependency, { name: 'grade' }, false),
    ]);

    render();
  }

  async function onDelete(e) {
    try {
      await deleteDependencyRequest(e.id);
      if (store.selectedDependency && store.selectedDependency.id === e.id) {
        store.selectedDependency = null;
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
      return condition;
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
          const { created_at, deleted, deleted_at, updated_at, ...data } = e;
          await updateDependencyRequest({
            ...data,
            group: parseConditions(e.group),
          });
        } else {
          await addDependencyRequest({
            ...e,
            center: store.center,
            group: parseConditions(e.group),
          });
        }

        store.selectedDependency = null;
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
    const m = getPromotionDetailMessages(tP);
    m.nameLabel = t('nameLabel');
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
              <Col span={4}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Box>
                      <SelectCenter label={t('selectCenter')} onChange={onSelectCenter} />
                    </Box>
                    {store.center && (
                      <Box>
                        <Tree
                          treeData={store.treeData}
                          selectedNode={store.selectedDependency?.id}
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
                {store.selectedDependency && (
                  <Paper fullWidth padding={5}>
                    <PromotionDetail
                      defaultValues={store.selectedDependency}
                      selectData={store.selectData}
                      onChange={onChange}
                      messages={messages}
                      errorMessages={errorMessages}
                      onSubmit={onSubmit}
                      isSaving={store.saving}
                      isDependency={true}
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
