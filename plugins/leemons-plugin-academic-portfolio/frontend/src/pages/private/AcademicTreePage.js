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
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import useProgramAcademicTree from '@academic-portfolio/hooks/queries/useProgramAcademicTree';

const AcademicTreePage = () => {
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const scrollRef = useRef();
  const history = useHistory();

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

  const { data: academicTreeQuery, isLoading: isAcademicTreeLoading } = useProgramAcademicTree({
    programId: selectedProgram,
    options: { enabled: selectedProgram?.length > 0 },
  });

  console.log('academicTreeQuery', academicTreeQuery);

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={'MATRICULACIÓN Y GESTIÓN 🌎'}
          onCancel={() => history.goBack()}
          mainActionLabel={'Cancelar 🌎'}
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
              placeholder={'Select a center 🌎'}
              onChange={(value) => {
                setSelectedCenter(value);
              }}
              value={selectedCenter}
              sx={{ width: 230 }}
            />
            <Select
              data={programSelectData}
              placeholder={'Select a program 🌎'}
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
          <div>
            <h3>DATA FROM BACKEND ⬇️⬇️</h3>
            <p>{JSON.stringify(academicTreeQuery)}</p>
          </div>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
};

export default AcademicTreePage;
