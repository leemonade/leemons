import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { cloneDeep } from 'lodash';
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
  ActionButton,
  ContextContainer,
  Button,
  ImageLoader,
} from '@bubbles-ui/components';
import { AddCircleIcon, RestoreIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import ProgramsDetailTable from '@academic-portfolio/components/ProgramsDetailTable';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import ProgramSetupDrawer from '@academic-portfolio/components/ProgramSetupDrawer/ProgramSetupDrawer';
import { useArchiveProgram } from '@academic-portfolio/hooks/mutations/useMutateProgram';
import { getCenterProgramsKey } from '@academic-portfolio/hooks/keys/centerPrograms';
import { EmptyState } from '@academic-portfolio/components/EmptyState';

const ProgramsPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('knowledgeAreas_page'));
  const [selectedCenter, setSelectedCenter] = useState('');
  const [activeTab, setActiveTab] = useState('0');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [addDrawerIsOpen, setAddDrawerIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const history = useHistory();
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const { mutate: archiveProgram, loading: isArchiveProgramLoading } = useArchiveProgram();
  const queryClient = useQueryClient();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // SET UP ------------------------------------------------------------------------------------------------ ||

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
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
    () => areCentersLoading || areProgramsLoading,
    [areCentersLoading, areProgramsLoading]
  );

  const programsIds = useMemo(() => {
    if (programsQuery?.length) {
      return [...programsQuery.map((program) => program.id)];
    }
    return [];
  }, [programsQuery]);

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
          addSuccessAlert('Programa borrado con éxito 🌎');
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
      />
    );
  }, [activeTab, programsIds, handleOnEdit, handleArchive]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={'Programs Educativos 🌎' || t('header.title')}
            onCancel={() => history.goBack()}
            mainActionLabel={'Cancelar 🌎' || t('header.cancel')}
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
              placeholder={'Select a center 🌎' || t('header.centerSelectPlaceholder')}
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
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb' }}
        >
          <TotalLayoutStepContainer stepName="Program name here 🌎" clean>
            <Tabs
              tabPanelListStyle={{ backgroundColor: 'white' }}
              fullHeight
              onChange={(activeT) => setActiveTab(activeT)}
            >
              <TabPanel label="Publicados 🌎">
                {!showEmptyState ? (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <Box sx={{ justifySelf: 'start', width: 160, height: 40 }}>
                      <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
                        {t('labels.add')}
                      </Button>
                    </Box>
                    {ProgramsDetailTableToRender}
                  </ContextContainer>
                ) : (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <EmptyState onClick={handleOnAdd} />
                  </ContextContainer>
                )}
              </TabPanel>
              <TabPanel label="Archivados 🌎">
                {!showEmptyState ? (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    {ProgramsDetailTableToRender}
                  </ContextContainer>
                ) : (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <EmptyState onClick={handleOnAdd} />
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
      />
    </>
  );
};

export default ProgramsPage;
