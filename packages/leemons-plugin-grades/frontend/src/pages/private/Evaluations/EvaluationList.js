import React, { useMemo } from 'react';
import { map } from 'lodash';
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
import { listGradesRequest } from '../../../request';
import { EvaluationDetail } from '../../../components/EvaluationDetail';

const ACTIONS = {
  NEW: 'new',
  EDIT: 'edit',
};

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
    const { items } = await listGradesRequest({ page: 0, size: 9999, center: store.center });
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
    store.selectedGrade = {};
    render();
  }

  function onSelect(e) {
    console.log(e);
  }

  if (!store.selectedGrade) onAdd();

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
                    <EvaluationDetail defaultValues={store.selectedGrade} />
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
