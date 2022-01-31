import React, { useMemo } from 'react';
import { clone, cloneDeep, find, forIn, groupBy, map } from 'lodash';
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
import { addErrorAlert } from '@layout/alert';
import {
  addGradeRequest,
  addGradeTagRequest,
  canDeleteGradeScaleRequest,
  deleteGradeTagRequest,
  listGradesRequest,
  updateGradeRequest,
  updateGradeTagRequest,
} from '../../../request';
import {
  EVALUATION_DETAIL_FORM_MESSAGES,
  EvaluationDetail,
} from '../../../components/EvaluationDetail';

export default function EvaluationList() {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));

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

  async function onSubmit(e) {
    try {
      let grade = e;
      if (!e.id) {
        // Add
        const add = { name: e.name, type: e.type, scales: e.scales };
        if (e.type === 'numeric') add.isPercentage = !!e.isPercentage;
        const { grade: addGrade } = await addGradeRequest({ ...add, center: store.center });
        grade = addGrade;
      }
      // Update
      const update = {
        id: grade.id,
        name: grade.name,
        minScaleToPromote: find(grade.scales, { number: e.minScaleToPromote }).id,
      };
      const { grade: updatedGrade } = await updateGradeRequest({ ...update });

      // TODO Eliminar primero los tags, luego los scales, luego creamos/ actualizamos los scales y luego creamos / actualizamos los tags

      if (e.tags) {
        e.tags = map(e.tags, (tag) => ({
          ...tag,
          scale: find(grade.scales, { number: e.minScaleToPromote }).id,
        }));
        const currentTagIds = map(updatedGrade.tags, 'id');
        const newTagIds = map(e.tags, 'id');
        // ES: Cogemos las ids actuales que no existan dentro de las nuevas para borrarlas
        const toDelete = currentTagIds.filter((id) => !newTagIds.includes(id));
        // ES: Cogemos los tags nuevos que no tengan id para crearlos
        const toCreate = e.tags.filter((tag) => !tag.id);
        // ES: Cogemos los tags nuevos que tengan id para actualizarlos
        const toUpdate = e.tags.filter((tag) => tag.id);
        // ES: Borramos / Actualizamos / Creamos los tags
        await Promise.all([
          Promise.all(toDelete.map((id) => deleteGradeTagRequest(id))),
          Promise.all(
            toCreate.map((tag) => addGradeTagRequest({ ...tag, grade: updatedGrade.id }))
          ),
          Promise.all(toUpdate.map((tag) => updateGradeTagRequest({ ...tag }))),
        ]);
      }

      await onSelectCenter(store.center);
    } catch (error) {
      console.log(error);
    }
  }

  async function onBeforeRemoveScale(e, { tags }) {
    if (e.id) {
      try {
        const tagsByScale = groupBy(tags, 'scale');

        if (tagsByScale[e.number]) {
          await addErrorAlert(t(`errorCode6003`));
          return false;
        }
        await canDeleteGradeScaleRequest(e.id);
      } catch (err) {
        if (err.code !== 6003) {
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
    const m = clone(EVALUATION_DETAIL_FORM_MESSAGES);
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
                        <Tree treeData={store.treeData} onAdd={onAdd} onSelect={onSelect} />
                      </Box>
                    )}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {store.selectedGrade && (
                  <Paper fullWidth padding={5}>
                    <EvaluationDetail
                      messages={messages}
                      errorMessages={errorMessages}
                      defaultValues={store.selectedGrade}
                      onBeforeRemoveScale={onBeforeRemoveScale}
                      onSubmit={onSubmit}
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
