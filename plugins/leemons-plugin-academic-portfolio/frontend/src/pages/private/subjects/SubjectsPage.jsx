import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Select,
  TotalLayoutContainer,
  TotalLayoutHeader,
  Stack,
  LoadingOverlay,
  TotalLayoutStepContainer,
  Box,
  ContextContainer,
  Button,
  ImageLoader,
} from '@bubbles-ui/components';
import { AddCircleIcon, RedirectIcon } from '@bubbles-ui/icons/solid';
import { unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { useUserCenters } from '@users/hooks';
import { cloneDeep, sortBy } from 'lodash';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { EmptyState } from '@academic-portfolio/components/EmptyState';
import SubjectSetupDrawer from '@academic-portfolio/components/SubjectSetupDrawer/SubjectSetupDrawer';
import SubjectsDetailTable from '@academic-portfolio/components/SubjectsDetailTable';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getProgramSubjectsKey } from '@academic-portfolio/hooks/keys/programSubjects';
import {
  useDeleteSubject,
  useDuplicateSubject,
} from '@academic-portfolio/hooks/mutations/useMutateSubject';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import useProgramSubjects from '@academic-portfolio/hooks/queries/useProgramSubjects';

const SubjectPage = () => {
  const [t, translations, , tLoading] = useTranslateLoader(prefixPN('newSubjectsPage'));
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [addDrawerIsOpen, setAddDrawerIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { openConfirmationModal } = useLayout();
  const history = useHistory();
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const { mutate: deleteSubject } = useDeleteSubject();
  const { mutate: duplicateSubject } = useDuplicateSubject();
  const queryClient = useQueryClient();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // SET UP ------------------------------------------------------------------------------------------------ ||
  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return res['academic-portfolio']?.newSubjectsPage;
    }

    return {};
  }, [translations]);

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
  );

  const { data: centerProgramsQuery, isLoading: areCenterProgramsLoading } = useProgramsByCenter({
    center: selectedCenter,
    filters: { onlyActive: true },
    options: {
      enabled: selectedCenter?.length > 0,
    },
  });

  const programSelectData = useMemo(() => {
    if (centerProgramsQuery?.length) {
      const sortedCenterProgramsQuery = sortBy(centerProgramsQuery, 'createdAt');
      return [
        ...sortedCenterProgramsQuery.map((program) => ({ value: program.id, label: program.name })),
      ];
    }
    return [];
  }, [centerProgramsQuery]);

  const noProgramsCreated = useMemo(() => !centerProgramsQuery?.length, [centerProgramsQuery]);

  const { data: subjectsQuery } = useProgramSubjects({
    program: selectedProgram,
    options: { enabled: selectedProgram?.length > 0 },
  });

  const subjectIds = useMemo(() => {
    if (subjectsQuery?.length) {
      return [...subjectsQuery.map((subject) => subject.id)];
    }
    return [];
  }, [subjectsQuery]);

  const isLoading = useMemo(
    () => areCentersLoading || areCenterProgramsLoading || tLoading,
    [areCentersLoading, areCenterProgramsLoading, tLoading]
  );

  // EFFECTS ------------------------------------------------------------------------------------------------ ||

  // Manage loading and emtpy state
  useEffect(() => {
    if (subjectsQuery?.length) {
      setShowEmptyState(false);
    } else if ((!subjectsQuery?.length || !centerProgramsQuery?.length) && dataFetched) {
      setShowEmptyState(true);
    }
  }, [centerProgramsQuery, programSelectData, subjectsQuery, dataFetched]);

  useEffect(() => {
    if (!isLoading && selectedProgram?.length > 0) {
      setDataFetched(true);
    }
  }, [isLoading, selectedProgram]);

  // **For the center Select to automatically pick a center when first loaded
  useEffect(() => {
    if (centersData?.length) {
      setSelectedCenter(centersData[0].value);
    }
  }, [centersData]);

  useEffect(() => {
    if (programSelectData?.length) {
      setSelectedProgram(programSelectData[0].value);
    }
  }, [programSelectData]);

  // HANDLERS ------------------------------------------------------------------------------------------------ ||

  const handleOnAdd = () => {
    setIsEditing(false);
    setAddDrawerIsOpen(true);
  };

  const handleOnEdit = (detailedSubject) => {
    setSelectedSubject(cloneDeep(detailedSubject));
    setAddDrawerIsOpen(true);
    setIsEditing(true);
  };

  const handleOnDelete = (subject) => {
    // HARD DELETE!
    const onConfirm = () =>
      deleteSubject(
        { id: subject.id, soft: false },
        {
          onSuccess: () => {
            const queryKey = getProgramSubjectsKey(subject.program);
            queryClient.invalidateQueries(queryKey);
            addSuccessAlert(t('alerts.success.delete'));
          },
          onError: (e) => {
            console.error(e);
            addErrorAlert(t('alerts.failure.delete'));
          },
        }
      );

    openConfirmationModal({
      title: t('deleteModal.title'),
      description: t('deleteModal.description', { subjectName: subject.name }),
      labels: {
        confirm: t('deleteModal.confirm'),
        cancel: localizations?.labels?.cancel,
      },
      onConfirm,
    })();
  };

  const handleDuplicate = (subject) => {
    const onConfirm = () =>
      duplicateSubject(subject.id, {
        onSuccess: () => {
          addSuccessAlert(t('alerts.success.duplicate'));
        },
        onError: (e) => {
          console.error(e);
          addErrorAlert(t('alerts.failure.duplicate'));
        },
      });

    openConfirmationModal({
      title: t('duplicateModal.title'),
      description: t('duplicateModal.description', { subjectName: subject.name }),
      labels: {
        confirm: t('duplicateModal.confirm'),
        cancel: localizations?.labels?.cancel,
      },
      onConfirm,
    })();
  };

  const emtpyStateToRender = useMemo(() => {
    if (noProgramsCreated) {
      return (
        <EmptyState
          onClick={() => history.push('/private/academic-portfolio/programs')}
          Icon={<RedirectIcon />}
          actionLabel={localizations?.emptyStates?.createProgram}
          description={localizations?.emptyStates?.noProgramsCreated}
        />
      );
    }

    return (
      <EmptyState
        onClick={handleOnAdd}
        Icon={<AddCircleIcon />}
        actionLabel={localizations?.labels?.addNewSubject}
        description={localizations?.emptyStates?.noSubjectsCreated}
      />
    );
  }, [selectedCenter, selectedProgram, noProgramsCreated, handleOnAdd, localizations]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('title')}
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
            <Stack spacing={4}>
              <Select
                data={centersData}
                onChange={(value) => {
                  setSelectedCenter(value);
                  setSelectedProgram(null);
                }}
                value={selectedCenter}
                sx={{ width: 230 }}
              />
              <Select
                data={programSelectData}
                onChange={(value) => {
                  setSelectedProgram(value);
                }}
                value={selectedProgram}
                sx={{ width: 180 }}
              />
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
            stepName={centerProgramsQuery?.find((item) => item.id === selectedProgram)?.name}
          >
            {!showEmptyState ? (
              <ContextContainer>
                <Box noFlex sx={{ justifySelf: 'start', width: 160, height: 40 }}>
                  <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
                    {t('labels.addNewSubject')}
                  </Button>
                </Box>
                {
                  <SubjectsDetailTable
                    subjectIds={subjectIds}
                    onEdit={handleOnEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleOnDelete}
                    labels={localizations?.labels}
                  />
                }
              </ContextContainer>
            ) : (
              emtpyStateToRender
            )}
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
      <SubjectSetupDrawer
        isOpen={addDrawerIsOpen}
        localizations={localizations}
        setIsOpen={setAddDrawerIsOpen}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        programId={selectedProgram}
        subject={selectedSubject}
        allSubjectIds={subjectIds} // temporary for us to be able to reset the query, todo: update hook
      />
    </>
  );
};

export default SubjectPage;
