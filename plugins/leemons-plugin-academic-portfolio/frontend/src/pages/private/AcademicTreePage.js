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

const TreeView = ({ data, onSubjectClick, level = 0 }) => {
  // Function to determine if an item should be sorted
  const shouldSortItem = (item) => item.type === 'cycles' || item.type === 'course';

  // Sort data if the items are of type 'cycles' or 'course' by their 'index'
  const sortedData = data.sort((a, b) => {
    // If both items should be sorted, compare their indexes
    if (shouldSortItem(a) && shouldSortItem(b)) {
      return a.index - b.index;
    }
    // Keep items in their original order if they don't need to be sorted
    return 0;
  });

  // Function to format the display name based on the item type and properties
  const formatDisplayName = (item) => {
    if (item.type === 'cycles' || item.type === 'course') {
      return item.type === 'course'
        ? `${item.type} ${item.index}`
        : `${item.type} ${item.index} ${item.name || ''}`;
    }
    return item.name;
  };

  const handleClick = (item) => {
    if (item.type === 'subject' && onSubjectClick) {
      onSubjectClick(item);
    }
  };

  const marginLeft = level * 10;

  return (
    <ul style={{ marginLeft: `${marginLeft}px` }}>
      {sortedData.map((item) => (
        <li
          key={item.id}
          onClick={() => handleClick(item)}
          style={{ cursor: item.type === 'subject' ? 'pointer' : 'default' }}
        >
          {formatDisplayName(item)}
          {/* If the item has children, recursively render them with increased level */}
          {item.children && (
            <TreeView data={item.children} onSubjectClick={onSubjectClick} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

const SubjectScreen = ({ subject }) => {
  return (
    <Stack>
      <Title></Title>
    </Stack>
  );
};

const AcademicTreePage = () => {
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
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

  const handleSubjectClick = (item) => {
    console.log('Subject clicked:', item);
    // Add your logic here
    setSelectedItem(item);
  };

  const screenToRender = useMemo(() => {}, []);

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
          fullWidth
        >
          <Stack spacing={8}>
            <div>
              {/* Your existing layout code... */}
              <TreeView data={academicTreeQuery} onSubjectClick={handleSubjectClick} />
            </div>
            <Stack></Stack>
          </Stack>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
};

export default AcademicTreePage;
