import React, { useContext, useEffect, useMemo, useState } from 'react';
import { isArray, isEmpty, isNil } from 'lodash';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { LayoutContext } from '@layout/context/layout';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@scores/helpers/prefixPN';
import { detailProgramRequest, listProgramsRequest } from '@academic-portfolio/request';
import unflatten from '@academic-portfolio/helpers/unflatten';
import { ProgramItem } from '@academic-portfolio/components';
import { useStore } from '@common/useStore';
import { useFrequencyTranslator } from '@academic-portfolio/helpers/useFrequencyTranslator';
import ProgramSetup from '../../../components/ProgramSetup';
import ProgramSetupPeriods from '../../../components/ProgramSetupPeriods';

export default function Setup() {
  const [, fqtTranslations] = useFrequencyTranslator();
  const [t, translations] = useTranslateLoader(prefixPN('setup_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [setupLabels, setSetupLabels] = useState(null);
  const { scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  const treeProps = useTree();

  // ····················································································
  // PROCESS DATA

  useEffect(
    () => () => {
      store.mounted = false;
    },
    []
  );

  const loadTree = (data) => {
    if (isArray(data) && t) {
      const programs = data.map((item) => ({
        id: item.id,
        parent: 0,
        draggable: false,
        program: item,
        render: ProgramItem,
      }));
      const treeData = [...programs];
      treeProps.setTreeData(treeData);

      if (!isEmpty(store.currentProgram)) {
        scrollTo({ top: 0 });
        treeProps.setSelectedNode(store.currentProgram.id);
      }

      render();
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await listProgramsRequest({ page: 0, size: 9999, center: store.centerId });
      const data = response.data?.items || [];
      store.programs = data;
      loadTree(data);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.scores.setup_page.setup;
      setSetupLabels(data);
    }
  }, [translations]);

  // ····················································································
  // HANDLERS

  React.useEffect(() => {
    if (store.centerId) {
      loadPrograms(store.centerId);
    }
  }, [translations]);

  const handleOnSelectCenter = async (center) => {
    store.centerId = center;
    scrollTo({ top: 0 });
    treeProps.setSelectedNode(null);
    store.currentProgram = null;
    await loadPrograms(center);
  };

  async function handleOnEditProgram(e) {
    scrollTo({ top: 0 });
    const { program } = await detailProgramRequest(e.program.id);
    store.currentProgram = program;
    treeProps.setSelectedNode(e.id);
  }

  const handleOnNext = () => {
    scrollTo({ top: 110 });
  };

  const handleOnPrev = () => {
    scrollTo({ top: 110 });
  };

  // ····················································································
  // STATIC VALUES

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  const setupProps = useMemo(() => {
    if (!isNil(setupLabels) && store.currentProgram) {
      const { periods } = setupLabels;

      return {
        labels: { title: store.currentProgram.name },
        data: [
          {
            label: periods.step_label,
            content: (
              <ProgramSetupPeriods
                program={store.currentProgram}
                frequencyLabels={fqtTranslations}
                {...periods}
              />
            ),
          },
        ],
      };
    }
    return null;
  }, [setupLabels, store.currentProgram]);

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
                      <SelectCenter
                        label={t('select_center')}
                        onChange={handleOnSelectCenter}
                        firstSelected
                      />
                    </Box>
                    {store.centerId && (
                      <Box>
                        <Tree
                          {...treeProps}
                          allowDragParents={false}
                          onSelect={handleOnEditProgram}
                        />
                      </Box>
                    )}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {!isNil(setupProps) && (
                  <Paper fullWidth padding={5}>
                    <ProgramSetup {...setupProps} />
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
