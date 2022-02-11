import React, { useEffect, useMemo } from 'react';
import { Box, Col, ContextContainer, Grid, PageContainer, Paper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectCenter } from '@users/components/SelectCenter';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useQuery, useStore } from '@common';
import SelectProgram from '../../components/Selectors/SelectProgram';
import { getProgramTreeRequest } from '../../request';

export default function TreePage() {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [store, render] = useStore();

  const params = useQuery();

  async function getProgramTree() {
    const tree = await getProgramTreeRequest(store.programId);
    console.log(tree);
  }

  async function init() {
    store.centerId = params.center;
    store.programId = params.program;
    if (store.centerId && store.programId) {
      store.tree = await getProgramTree();
    }
    render();
  }

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
    }),
    [t]
  );

  function onSelectCenter(centerId) {
    store.centerId = centerId;
    render();
  }

  async function onSelectProgram(programId) {
    store.programId = programId;
    store.tree = await getProgramTree();
    render();
  }

  useEffect(() => {
    init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Grid grow>
                      <Col span={6}>
                        <SelectCenter
                          label={t('centerLabel')}
                          onChange={onSelectCenter}
                          value={store.centerId}
                        />
                      </Col>
                      <Col span={6}>
                        <SelectProgram
                          label={t('programLabel')}
                          onChange={onSelectProgram}
                          center={store.centerId}
                          value={store.programId}
                        />
                      </Col>
                    </Grid>
                    {store.program ? (
                      <Box>
                        {/* <Tree
                          {...treeProps}
                          allowDragParents={false}
                          onSelect={handleOnEditProgram}
                          onAdd={handleOnAddProgram}
                        /> */}
                      </Box>
                    ) : null}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {store.program ? (
                  <Paper fullWidth padding={5}>
                    Gatitos
                  </Paper>
                ) : null}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
