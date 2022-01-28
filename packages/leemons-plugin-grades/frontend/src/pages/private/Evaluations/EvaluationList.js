import React, { useMemo } from 'react';
import { isNil } from 'lodash';
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

const ACTIONS = {
  NEW: 'new',
  EDIT: 'edit',
};

export default function EvaluationList() {
  const [t] = useTranslateLoader(prefixPN('evaluations_page'));

  const [store, render] = useStore();

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  function onSelectCenter(center) {
    store.centerId = center;
    render();
  }

  return (
    <div>
      <SelectCenter label={t('common.select_center')} onChange={onSelectCenter} />
      {store.centerId}
    </div>
  );

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
                      <SelectCenter label={t('common.select_center')} onChange={onSelectCenter} />
                    </Box>
                    {centerId && (
                      <Box>
                        <Tree {...treeProps} onAdd={handleOnAddProgram} />
                      </Box>
                    )}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {!isNil(setupProps) && showDetail && (
                  <Paper fullWidth padding={5}>
                    Hola
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
