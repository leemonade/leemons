import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { AddCircleIcon, RedirectIcon, ReportPageIcon } from '@bubbles-ui/icons/solid';
import { unflatten } from '@common';
import useCenterEvaluationSystems from '@grades/hooks/queries/useCenterEvaluationSystems';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { useUserCenters } from '@users/hooks';
import { cloneDeep } from 'lodash';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { EmptyState } from '@academic-portfolio/components/EmptyState';
import ProgramSetupDrawer from '@academic-portfolio/components/ProgramSetupDrawer/ProgramSetupDrawer';
import ProgramsDetailTable from '@academic-portfolio/components/ProgramsDetailTable';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getCenterProgramsKey } from '@academic-portfolio/hooks/keys/centerPrograms';
import {
  useArchiveProgram,
  useDuplicateProgram,
} from '@academic-portfolio/hooks/mutations/useMutateProgram';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';

const ProgramsPage = () => {
  const [t, translations, , tLoading] = useTranslateLoader(prefixPN('programs_page'));
  const [selectedCenter, setSelectedCenter] = useState('');
  const [activeTab, setActiveTab] = useState('0');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [addDrawerIsOpen, setAddDrawerIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const { openConfirmationModal } = useLayout();
  const history = useHistory();
  const { data: centersQuery, isLoading: areCentersLoading } = useUserCenters({
    refetchOnWindowFocus: false,
  });
  const { mutate: archiveProgram, isLoading: archiveProgramLoading } = useArchiveProgram();
  const { mutate: duplicateProgram, isLoading: duplicateProgramLoading } = useDuplicateProgram();
  const queryClient = useQueryClient();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // SET UP ------------------------------------------------------------------------------------------------ ||
  const { data: evaluationSystemsQuery } = useCenterEvaluationSystems({
    center: selectedCenter,
    options: { enabled: selectedCenter?.length > 0 },
  });

  const noEvaluationSystems = useMemo(
    () => !evaluationSystemsQuery?.length,
    [evaluationSystemsQuery]
  );

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
      refetchOnWindowFocus: false,
    },
  });

  const isLoading = useMemo(
    () =>
      areCentersLoading ||
      areProgramsLoading ||
      tLoading ||
      archiveProgramLoading ||
      duplicateProgramLoading,
    [
      areCentersLoading,
      areProgramsLoading,
      tLoading,
      archiveProgramLoading,
      duplicateProgramLoading,
    ]
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
  const handleOnAdd = useCallback(() => {
    setSelectedProgram(null);
    if (isEditing) setIsEditing(false);
    setAddDrawerIsOpen(true);
  }, [isEditing]);

  const handleOnEdit = useCallback(
    (program) => {
      setSelectedProgram(cloneDeep(program));
      if (!addDrawerIsOpen) setAddDrawerIsOpen(true);
      if (!isEditing) setIsEditing(true);
    },
    [addDrawerIsOpen, isEditing, setSelectedProgram]
  );

  const handleArchive = useCallback(
    (program) => {
      const onConfirm = () =>
        archiveProgram(
          { id: program.id, soft: true },
          {
            onSuccess: () => {
              const queryKey = getCenterProgramsKey(selectedCenter);
              queryClient.invalidateQueries(queryKey);
              addSuccessAlert(t('alerts.success.delete'));
              setActiveTab('1');
            },
            onError: (e) => {
              console.error(e);
              addErrorAlert(t('alerts.failure.delete'));
            },
          }
        );

      openConfirmationModal({
        title: t('archiveModal.title'),
        description: t('archiveModal.description', { programName: program.name }),
        labels: {
          confirm: t('archiveModal.confirm'),
          cancel: localizations?.labels?.cancel,
        },
        onConfirm,
      })();
    },
    [archiveProgram, t, selectedCenter, queryClient, openConfirmationModal, localizations]
  );

  const handleDuplicate = useCallback(
    (program) => {
      const onConfirm = () =>
        duplicateProgram(
          { programId: program.id },
          {
            onSuccess: () => {
              addSuccessAlert(t('alerts.success.duplicate'));
            },
            onError: (e) => {
              console.error(e);
              addErrorAlert(t('alerts.failure.duplicate'));
            },
          }
        );

      openConfirmationModal({
        title: t('duplicateModal.title'),
        description: t('duplicateModal.description', { programName: program.name }),
        labels: {
          confirm: t('duplicateModal.confirm'),
          cancel: localizations?.labels?.cancel,
        },
        onConfirm,
      })();
    },
    [duplicateProgram, t, openConfirmationModal, localizations]
  );

  function handleOnReports() {
    history.push(`/private/academic-portfolio/reports`);
  }

  const ProgramsDetailTableToRender = useMemo(() => {
    const key = activeTab === '0' ? 'active' : 'archived';
    return (
      <ProgramsDetailTable
        key={key}
        programsIds={programsIds}
        onEdit={handleOnEdit}
        onArchive={handleArchive}
        onDuplicate={handleDuplicate}
        isShowingArchivedPrograms={activeTab === '1'}
        labels={localizations?.labels}
      />
    );
  }, [activeTab, programsIds, handleOnEdit, handleArchive, handleDuplicate, localizations]);

  const emtpyStateToRender = useMemo(() => {
    if (activeTab === '0') {
      if (noEvaluationSystems) {
        return (
          <EmptyState
            onClick={() => history.push('/private/grades/evaluations')}
            Icon={<RedirectIcon />}
            actionLabel={localizations?.emptyStates?.createAcademicRules}
            description={localizations?.emptyStates?.noAcademicRules}
          />
        );
      }

      return (
        <EmptyState
          onClick={handleOnAdd}
          Icon={<AddCircleIcon />}
          actionLabel={localizations?.labels?.addNewProgram}
          description={localizations?.emptyStates?.noProgramsCreated}
        />
      );
    }
    return <EmptyState description={localizations?.emptyStates?.noProgramsArchived} noAction />;
  }, [noEvaluationSystems, activeTab, handleOnAdd, localizations, history]);

  if (!translations) return null;
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('page_title')}
            cancelable={false}
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
            <Stack fullWidth justifyContent="space-between">
            <Select
              data={centersData}
              placeholder={t('common.select_center')}
              onChange={(value) => {
                setSelectedCenter(value);
              }}
              value={selectedCenter}
              sx={{ width: 262 }}
            />
            <Button
            variant="link"
            leftIcon={<ReportPageIcon />}
            onClick={handleOnReports}
          >
            {t('reports')}
          </Button>
            </Stack>
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
              activeKey={activeTab}
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
                    {emtpyStateToRender}
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
                    {emtpyStateToRender}
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
