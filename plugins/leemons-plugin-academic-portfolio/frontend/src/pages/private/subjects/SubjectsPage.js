import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { cloneDeep, find } from 'lodash';
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
import { AddCircleIcon } from '@bubbles-ui/icons/solid';

import { useUserCenters } from '@users/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import SubjectSetupDrawer from '@academic-portfolio/components/SubjectSetupDrawer/SubjectSetupDrawer';
import SubjectsDetailTable from '@academic-portfolio/components/SubjectsDetailTable';
import useProgramSubjects from '@academic-portfolio/hooks/queries/useProgramSubjects';
import { EmptyState } from '@academic-portfolio/components/EmptyState';

const SubjectPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('knowledgeAreas_page'));
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [activeTab, setActiveTab] = useState('0');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [addDrawerIsOpen, setAddDrawerIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const history = useHistory();
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // SET UP ------------------------------------------------------------------------------------------------ ||
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
      return [
        ...centerProgramsQuery.map((program) => ({ value: program.id, label: program.name })),
      ];
    }
    return [];
  }, [centerProgramsQuery]);

  const queryFilters = useMemo(() => {
    if (activeTab === '1') {
      return { onlyArchived: true };
    }
    return {};
  }, [activeTab]);

  const { data: subjectsQuery } = useProgramSubjects({
    program: selectedProgram,
    queryFilters,
    options: { enabled: selectedProgram?.length > 0 },
  });

  const subjectIds = useMemo(() => {
    if (subjectsQuery?.length) {
      return [...subjectsQuery.map((subject) => subject.id)];
    }
    return [];
  }, [subjectsQuery]);

  const isLoading = useMemo(
    () => areCentersLoading || areCenterProgramsLoading,
    [areCentersLoading, areCenterProgramsLoading]
  );

  // EFFECTS ------------------------------------------------------------------------------------------------ ||

  // Manage loading and emtpy state when no ce
  useEffect(() => {
    if (subjectsQuery?.length) {
      setShowEmptyState(false);
    } else if (!subjectsQuery?.length && dataFetched) {
      setShowEmptyState(true);
    }
  }, [subjectsQuery, dataFetched]);

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

  const SubjectDetailsTableToRender = useMemo(
    () => <SubjectsDetailTable subjectIds={subjectIds} onEdit={handleOnEdit} />,
    [subjectIds, handleOnEdit]
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={'Listado de Asignaturas 🌎' || t('header.title')}
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
            <Stack spacing={4}>
              <Select
                data={centersData}
                placeholder={'Select a center 🌎' || t('header.centerSelectPlaceholder')}
                onChange={(value) => {
                  setSelectedCenter(value);
                }}
                value={selectedCenter}
                sx={{ width: 230 }}
              />
              <Select
                data={programSelectData}
                placeholder={'Select a program 🌎' || t('header.centerSelectPlaceholder')}
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
            clean
          >
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
                        {'Nueva asignatura 🌎'}
                      </Button>
                    </Box>
                    {SubjectDetailsTableToRender}
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
                    {/* <ProgramsDetailTable
                      programsIds={subjectIds}
                      actions={
                        <Stack justifyContent="end" fullWidth>
                          <ActionButton
                            tooltip="Restaurar 🌎"
                            icon={<RestoreIcon width={18} height={18} />}
                          />
                        </Stack>
                      }
                    /> */}
                    <div>Subjects Table para archivados</div>
                  </ContextContainer>
                ) : (
                  <ContextContainer sx={{ padding: '24px 24px' }}>
                    <div>SOY UN EMPTY STATE FOR ARCHIVED PROGRAMS! 🎉</div>
                  </ContextContainer>
                )}
              </TabPanel>
            </Tabs>
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
      <SubjectSetupDrawer
        isOpen={addDrawerIsOpen}
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
