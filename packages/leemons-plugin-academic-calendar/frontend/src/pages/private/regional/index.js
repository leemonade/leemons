import React, { useContext, useEffect, useMemo, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
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
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@academic-calendar/helpers/prefixPN';
import {
  createProgramRequest,
  listProgramsRequest,
  updateProgramRequest,
} from '@academic-portfolio/request';
import { ProgramItem } from '@academic-portfolio/components';
import { useStore } from '@common';
import AcademicCalendarDetail from '@academic-calendar/components/AcademicCalendarDetail';

export default function RegionalCalendars() {
  const [t, , , loading] = useTranslateLoader(prefixPN('regionalList'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [showDetail, setShowDetail] = useState(false);
  const { setLoading, scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
    showDetail: false,
    centerId: null,
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
      treeProps.setTreeData(
        data.map((item) => ({
          id: item.id,
          parent: 0,
          draggable: false,
          program: item,
          render: ProgramItem,
        }))
      );

      if (!isEmpty(store.currentProgram)) {
        scrollTo({ top: 0 });
        // eslint-disable-next-line no-use-before-define
        handleShowDetail(() => {
          treeProps.setSelectedNode(store.currentProgram.id);
        });
      }

      render();
    }
  };

  const loadPrograms = async (center) => {
    try {
      const response = await listProgramsRequest({ page: 0, size: 9999, center });
      const data = response.data?.items || [];
      store.programs = data;
      loadTree(data);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const saveProgram = async (values) => {
    try {
      setLoading(true);
      let body = { ...values, centers: [store.centerId] };
      let apiCall = createProgramRequest;
      let messageKey = 'common.create_done';

      if (!isEmpty(store.currentProgram)) {
        const { name, abbreviation, credits, image } = values;
        body = {
          id: store.currentProgram.id,
          name,
          abbreviation,
          credits,
          image,
        };
        apiCall = updateProgramRequest;
        messageKey = 'common.update_done';
      }

      const response = await apiCall(body);
      store.currentProgram = response.program;

      setLoading(false);
      addSuccessAlert(t(messageKey));
    } catch (e) {
      setLoading(false);
      addErrorAlert(getErrorMessage(e));
    }
  };

  // ····················································································
  // HANDLERS

  const handleShowDetail = (callback) => {
    if (store.showDetail) {
      setTimeout(
        () => {
          store.showDetail = false;
          callback();

          setTimeout(() => (store.showDetail = true), 500);
        },
        store.showDetail ? 500 : 0
      );
    } else {
      store.showDetail = true;
      callback();
    }
  };

  React.useEffect(() => {
    if (store.centerId && !loading) {
      loadPrograms(store.centerId);
    }
  }, [loading, store.centerId]);

  const handleOnSelectCenter = async (center) => {
    store.centerId = center;
    scrollTo({ top: 0 });
    treeProps.setSelectedNode(null);
    setTimeout(() => {
      store.currentProgram = null;
      store.showDetail = false;
      // loadPrograms(center);
    }, 300);
  };

  const handleOnEditProgram = (e) => {
    scrollTo({ top: 0 });
    handleShowDetail(async () => {
      store.selectedProgram = e.program;
      treeProps.setSelectedNode(e.id);
    });
  };

  // ····················································································
  // STATIC VALUES

  const headerValues = useMemo(
    () => ({
      title: t('title'),
      description: t('description'),
    }),
    [t]
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
                {store.selectedProgram ? (
                  <Paper fullWidth padding={5}>
                    <AcademicCalendarDetail program={store.selectedProgram} />
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
