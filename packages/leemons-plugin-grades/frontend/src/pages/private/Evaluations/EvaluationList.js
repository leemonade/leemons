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
import { useStore } from '@common/useStore';
import prefixPN from '@grades/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { clone, cloneDeep, find, forIn, groupBy, map } from 'lodash';
import React, { useMemo } from 'react';
import {
  EVALUATION_DETAIL_FORM_ERROR_MESSAGES,
  EVALUATION_DETAIL_FORM_MESSAGES,
  EvaluationDetail,
} from '../../../components/EvaluationDetail';
import { TreeItem } from '../../../components/TreeItem/TreeItem';
import { activeMenuItemPromotions } from '../../../helpers/activeMenuItemPromotions';
import {
  addGradeRequest,
  addGradeScaleRequest,
  addGradeTagRequest,
  canDeleteGradeScaleRequest,
  deleteGradeRequest,
  deleteGradeScaleRequest,
  deleteGradeTagRequest,
  listGradesRequest,
  updateGradeRequest,
  updateGradeScaleRequest,
  updateGradeTagRequest,
} from '../../../request';

export default function EvaluationList() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('evaluationsPage'));

  const [store, render] = useStore();

  const headerValues = useMemo(
    () => ({
      title: t('pageTitle'),
      description: t('pageDescription'),
    }),
    [t]
  );

  async function getGrades() {
    const {
      data: { items },
    } = await listGradesRequest({ page: 0, size: 9999, center: store.center });
    return items;
  }

  function getTreeData() {
    const data = map(store.grades, (grade) => ({
      id: grade.id,
      parent: 0,
      text: grade.name,
      draggable: false,
      render: TreeItem,
    }));
    data.push({
      id: 'add',
      parent: 0,
      text: t('addGrade'),
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
    store.grades = await getGrades();
    store.treeData = getTreeData();
    store.loading = false;
    render();
  }

  function onAdd() {
    store.selectedGrade = {
      name: null,
      type: null,
      scales: [],
      tags: [],
      minScaleToPromote: null,
      isPercentage: null,
    };
    render();
  }

  function onSelect(e) {
    store.selectedGrade = cloneDeep(find(store.grades, { id: e.id }));
    store.selectedGrade.minScaleToPromote = find(store.selectedGrade.scales, {
      id: store.selectedGrade.minScaleToPromote,
    }).number;
    store.selectedGrade.tags = map(store.selectedGrade.tags, (tag) => ({
      ...tag,
      scale: tag.scale.number,
    }));
    render();
  }

  async function onDelete(e) {
    try {
      await deleteGradeRequest(e.id);
      await onSelectCenter(store.center);
      await addSuccessAlert(t('successDelete'));
    } catch (err) {
      await addErrorAlert(err.message);
    }
  }

  async function onSubmit(e) {
    try {
      if (!store.saving) {
        store.saving = true;
        render();
        let grade = e;
        if (!e.id) {
          // Add
          const add = { name: e.name, type: e.type, scales: [] };
          if (e.type === 'numeric') add.isPercentage = !!e.isPercentage;
          const { grade: addGrade } = await addGradeRequest({ ...add, center: store.center });
          grade = addGrade;
        }

        let tagsToDelete = [];
        let tagsToUpdate = [];
        let tagsToAdd = [];
        let scalesToDelete = [];
        let scalesToUpdate = [];
        let scalesToAdd = [];

        if (!e.tags) e.tags = [];
        if (!e.scales) e.scales = [];

        const currentTagIds = map(store.selectedGrade.tags, 'id');
        const currentScaleIds = map(store.selectedGrade.scales, 'id');
        const newTagIds = map(e.tags, 'id');
        const newScaleIds = map(e.scales, 'id');

        e.scales = map(e.scales, (scale, index) => {
          const item = {
            description: scale.description,
            number: scale.number,
            order: index,
          };
          if (scale.id) item.id = scale.id;
          if (scale.letter) item.letter = scale.letter;
          return item;
        });

        // ES: Cogemos las ids actuales que no existan dentro de las nuevas para borrarlas
        tagsToDelete = currentTagIds.filter((id) => !newTagIds.includes(id));
        scalesToDelete = currentScaleIds.filter((id) => !newScaleIds.includes(id));
        scalesToAdd = e.scales.filter((scale) => !scale.id);
        scalesToUpdate = e.scales.filter((scale) => scale.id);

        const [newScales, updatedScales] = await Promise.all([
          Promise.all(
            scalesToAdd.map((scale) => addGradeScaleRequest({ ...scale, grade: grade.id }))
          ),
          Promise.all(scalesToUpdate.map((scale) => updateGradeScaleRequest(scale))),
          Promise.all(tagsToDelete.map((id) => deleteGradeTagRequest(id))),
        ]);

        const scales = map(newScales, 'gradeScale').concat(map(updatedScales, 'gradeScale'));

        // Update
        const update = {
          id: grade.id,
          name: grade.name,
          minScaleToPromote: find(
            map(scales, (s) => ({ ...s, number: s.number.toString() })),
            { number: e.minScaleToPromote.toString() }
          ).id,
        };
        const { grade: updatedGrade } = await updateGradeRequest({ ...update });

        e.tags = map(e.tags, (tag) => {
          const item = {
            letter: tag.letter,
            description: tag.description,
            scale: find(
              map(updatedGrade.scales, (s) => ({ ...s, number: s.number.toString() })),
              { number: tag.scale.toString() }
            ).id,
          };
          if (tag.id) item.id = tag.id;
          return item;
        });

        // ES: Cogemos los tags nuevos que no tengan id para crearlos
        tagsToAdd = e.tags.filter((tag) => !tag.id);

        // ES: Cogemos los tags nuevos que tengan id para actualizarlos
        tagsToUpdate = e.tags.filter((tag) => tag.id);

        await Promise.all([
          Promise.all(scalesToDelete.map((id) => deleteGradeScaleRequest(id))),
          Promise.all(
            tagsToAdd.map((tag) => addGradeTagRequest({ ...tag, grade: updatedGrade.id }))
          ),
          Promise.all(tagsToUpdate.map((tag) => updateGradeTagRequest({ ...tag }))),
        ]);

        store.selectedGrade = null;
        store.saving = false;
        await Promise.all([onSelectCenter(store.center), activeMenuItemPromotions()]);
        await addSuccessAlert(t('successSave'));
      }
    } catch (error) {
      store.saving = false;
      render();
      await addErrorAlert(error.message);
    }
  }

  async function onBeforeRemoveScale(e, { tags, minScaleToPromote }) {
    const tagsByScale = groupBy(tags, 'scale');

    if (tagsByScale[e.number]) {
      await addErrorAlert(t(`errorCode6003`));
      return false;
    }

    if (minScaleToPromote.toString() === e.number.toString()) {
      await addErrorAlert(t(`errorCode6004`));
      return false;
    }

    if (e.id) {
      try {
        await canDeleteGradeScaleRequest(e.id);
      } catch (err) {
        if (err.code !== 6003 && err.code !== 6004) {
          await addErrorAlert(err.code ? t(`errorCode${err.code}`) : err.message);
          return false;
        }
      }
    }
    return true;
  }

  const messages = useMemo(() => {
    const m = clone(EVALUATION_DETAIL_FORM_MESSAGES);
    forIn(m, (value, key) => {
      m[key] = t(`detail.${key}`);
    });
    return m;
  }, [t]);

  const errorMessages = useMemo(() => {
    const m = clone(EVALUATION_DETAIL_FORM_ERROR_MESSAGES);
    forIn(m, (value, key) => {
      m[key] = t(`detail.${key}`);
    });
    return m;
  }, [t]);

  function getCenter() {
    const query = new URLSearchParams(window.location.search);
    return query.get('center');
  }

  React.useEffect(() => {
    const center = getCenter();
    if (center) onSelectCenter(center);
  }, []);

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
                        <SelectCenter
                          firstSelected
                          value={store.center}
                          label={t('selectCenter')}
                          onChange={onSelectCenter}
                        />
                      </Box>
                    )}
                    {store.center && (
                      <Box>
                        <Tree
                          treeData={store.treeData}
                          selectedNode={store.selectedGrade?.id}
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
                {store.selectedGrade && (
                  <Paper fullWidth padding={5}>
                    <EvaluationDetail
                      selectData={{
                        type: [
                          { label: t('detail.numeric'), value: 'numeric' },
                          { label: t('detail.letter'), value: 'letter' },
                        ],
                      }}
                      messages={messages}
                      errorMessages={errorMessages}
                      defaultValues={store.selectedGrade}
                      onBeforeRemoveScale={onBeforeRemoveScale}
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
