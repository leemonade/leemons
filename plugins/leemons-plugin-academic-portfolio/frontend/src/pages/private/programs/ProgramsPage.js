import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { cloneDeep, get } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { useUserCenters } from '@users/hooks';
import {
  Select,
  TotalLayoutContainer,
  TotalLayoutHeader,
  Stack,
  LoadingOverlay,
  TotalLayoutStepContainer,
  Tabs,
  TabPanel,
  Box,
  ContextContainer,
  Button,
  ImageLoader,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import ProgramsDetailTable from '@academic-portfolio/components/ProgramsDetailTable';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import ProgramSetupDrawer from '@academic-portfolio/components/ProgramSetupDrawer/ProgramSetupDrawer';
import { useArchiveProgram } from '@academic-portfolio/hooks/mutations/useMutateProgram';
import { getCenterProgramsKey } from '@academic-portfolio/hooks/keys/centerPrograms';
import { EmptyState } from '@academic-portfolio/components/EmptyState';
import { unflatten } from '@common';

const ProgramsPage = () => {
  const [t, translations, , tLoading] = useTranslateLoader(prefixPN('programs_page'));
  const [selectedCenter, setSelectedCenter] = useState('');
  const [activeTab, setActiveTab] = useState('0');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [addDrawerIsOpen, setAddDrawerIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const history = useHistory();
  const { data: centersQuery, isLoading: areCentersLoading } = useUserCenters();
  const { mutate: archiveProgram, loading: isArchiveProgramLoading } = useArchiveProgram();
  const queryClient = useQueryClient();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // SET UP ------------------------------------------------------------------------------------------------ ||
  const centersData = useMemo(
    () => centersQuery?.map((center) => ({ value: center?.id, label: center?.name })),
    [centersQuery]
  );

  const queryFilters = useMemo(() => {
    if (activeTab === '1') {
      return { onlyArchived: true };
    }
    return {};
  }, [activeTab]);

  const { data: programsQuery, isLoading: areProgramsLoading } = useProgramsByCenter({
    center: selectedCenter,
    filters: queryFilters,
    options: {
      enabled: selectedCenter?.length > 0,
    },
  });

  const isLoading = useMemo(
    () => areCentersLoading || areProgramsLoading || tLoading,
    [areCentersLoading, areProgramsLoading, tLoading]
  );

  const programsIds = useMemo(() => {
    if (programsQuery?.length) {
      return [...programsQuery.map((program) => program.id)];
    }
    return [];
  }, [programsQuery]);

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return res['academic-portfolio']?.programs_page;
    }

    return {};
  }, [translations]);

  // EFFECTS ------------------------------------------------------------------------------------------------ ||

  // Manage loading and emtpy state when no ce
  useEffect(() => {
    if (programsQuery?.length) {
      setShowEmptyState(false);
    } else if (!programsQuery?.length && dataFetched) {
      setShowEmptyState(true);
    }
  }, [programsQuery, dataFetched]);

  useEffect(() => {
    if (!isLoading && selectedCenter?.length > 0) {
      setDataFetched(true);
    }
  }, [isLoading, selectedCenter]);

  // **For the center Select to automatically pick a center when first loaded
  useEffect(() => {
    if (centersData?.length) {
      setSelectedCenter(centersData[0].value);
    }
  }, [centersData]);

  // HANDLERS ------------------------------------------------------------------------------------------------ ||
  const handleOnAdd = () => {
    if (isEditing) setIsEditing(false);
    if (!addDrawerIsOpen) setAddDrawerIsOpen(true);
  };

  const handleOnEdit = (program) => {
    setSelectedProgram(cloneDeep(program));
    if (!addDrawerIsOpen) setAddDrawerIsOpen(true);
    if (!isEditing) setIsEditing(true);
  };

  const handleArchive = (program) => {
    archiveProgram(
      { id: program.id, soft: true },
      {
        onSuccess: () => {
          const queryKey = getCenterProgramsKey(selectedCenter);
          queryClient.invalidateQueries(queryKey);
          addSuccessAlert(t('alerts.success.add'));
        },
        onError: (e) => {
          const queryKey = getCenterProgramsKey(selectedCenter);
          queryClient.invalidateQueries(queryKey);
          addErrorAlert(e);
        },
      }
    );
  };

  const ProgramsDetailTableToRender = useMemo(() => {
    const key = activeTab === '0' ? 'active' : 'archived';
    return (
      <ProgramsDetailTable
        key={key}
        programsIds={programsIds}
        onEdit={handleOnEdit}
        onArchive={handleArchive}
        isShowingArchivedPrograms={activeTab === '1'}
        labels={localizations?.labels}
      />
    );
  }, [activeTab, programsIds, handleOnEdit, handleArchive, localizations]);

  if (!translations) return null;
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('page_title')}
            onCancel={() => history.goBack()}
            mainActionLabel={t('labels.cancel')}
            compact
            icon={
              <Stack justifyContent="center" alignItems="center">
                <ImageLoader
                  style={{ position: 'relative' }}
                  src="/public/academic-portfolio/menu-icon.svg"
                  width={18}
                  height={18}
                />
              </Stack>
            }
          >
            <Select
              data={centersData}
              placeholder={t('common.select_center')}
              onChange={(value) => {
                setSelectedCenter(value);
              }}
              value={selectedCenter}
              sx={{ width: 262 }}
            />
          </TotalLayoutHeader>
        }
      >
        <Stack
          ref={scrollRef}
          justifyContent="center"
          fullwidth
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb', paddingTop: 24 }}
        >
          <TotalLayoutStepContainer
            stepName={centersQuery?.find((item) => item.id === selectedCenter)?.name}
            clean
          >
            <Tabs
              tabPanelListStyle={{ backgroundColor: 'white' }}
              fullHeight
              onChange={(activeT) => setActiveTab(activeT)}
            >
              <TabPanel label={t('labels.publishedPrograms')}>
                {!showEmptyState ? (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <Box sx={{ justifySelf: 'start', width: 160, height: 40 }}>
                      <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
                        {t('labels.addNewProgram')}
                      </Button>
                    </Box>
                    {ProgramsDetailTableToRender}
                  </ContextContainer>
                ) : (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <EmptyState onClick={handleOnAdd} localizations={localizations} />
                  </ContextContainer>
                )}
              </TabPanel>
              <TabPanel label={t('labels.archivedPrograms')}>
                {!showEmptyState ? (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    {ProgramsDetailTableToRender}
                  </ContextContainer>
                ) : (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <EmptyState onClick={handleOnAdd} localizations={localizations} archivedView />
                  </ContextContainer>
                )}
              </TabPanel>
            </Tabs>
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
      <ProgramSetupDrawer
        isOpen={addDrawerIsOpen}
        setIsOpen={setAddDrawerIsOpen}
        centerId={selectedCenter}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        program={selectedProgram}
        localizations={localizations}
      />
    </>
  );
};

export default ProgramsPage;
