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
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useProgramAcademicTree from '@academic-portfolio/hooks/queries/useProgramAcademicTree';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import { GroupView } from '../../components/AcademicTree/GroupView/GroupView';
import SubjectView from '../../components/AcademicTree/SubjectView/SubjectView';
import EnrollmentDrawer from '@academic-portfolio/components/AcademicTree/EnrollmentDrawer/EnrollmentDrawer';

const TreeView = ({ data, onSubjectClick, level = 0 }) => {
  // Function to determine if an item should be sorted
  const shouldSortItem = (item) => item.type === 'cycles' || item.type === 'course';

  // Sort data if the items are of type 'cycles' or 'course' by their 'index'
  const sortedData = data?.sort((a, b) => {
    // If both items should be sorted, compare their indexes
    if (shouldSortItem(a) && shouldSortItem(b)) {
      return a.index - b.index;
    }
    // Keep items in their original order if they don't need to be sorted
    return 0;
  });

  // Function to format the display name based on the item type and properties
  const formatDisplayName = (item) => {
    if (item.type === 'cycle' || item.type === 'course') {
      return item.type === 'course'
        ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} ${item.index}`
        : `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} ${item.index} ${
            item.name || ''
          }`;
    }
    return item.name;
  };

  const handleClick = (item, event) => {
    event.stopPropagation();
    if (item.type !== 'cycle' && onSubjectClick) {
      onSubjectClick(item);
    }
  };

  const marginLeft = level * 10;

  return (
    <ul style={{ marginLeft: `${marginLeft}px` }}>
      {sortedData?.map((item) => (
        <li
          key={item.id}
          onClick={(event) => handleClick(item, event)}
          style={{ cursor: item.type !== 'cycle' ? 'pointer' : 'default' }}
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

const AcademicTreePage = () => {
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [enrollmentDrawerIsOpen, setEnrollmentDrawerIsOpen] = useState(false);
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
    setSelectedNode(item);
  };

  const addParentInfo = (node, parent = null) => {
    // Assign the parent to the current node
    node.parent = parent;

    // If the node has children, recursively set their parent property
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => addParentInfo(child, node));
    }
  };

  // Assuming `academicTreeQuery` is your raw data from the backend
  const parsedTree = useMemo(() => {
    if (academicTreeQuery?.length) {
      // Clone the data to avoid mutating the original response
      const dataClone = cloneDeep(academicTreeQuery);
      // Process each root-level node (which has no parent)
      dataClone.forEach((node) => addParentInfo(node));
      return dataClone;
    }
    return [];
  }, [academicTreeQuery]);
  console.log('parsedTree', parsedTree);

  const viewToRender = useMemo(() => {
    switch (selectedNode?.type) {
      case 'cycle':
        return <div>CYCLE</div>;
      case 'course':
        return <div>COURSE</div>;
      case 'group':
        return (
          <GroupView
            groupNode={selectedNode}
            scrollRef={scrollRef}
            setEnrollmentDrawerIsOpen={setEnrollmentDrawerIsOpen}
          />
        );
      case 'knowledgeArea':
        return <div>knowledgeArea</div>;
      case 'subject':
        return (
          <SubjectView
            scrollRef={scrollRef}
            setEnrollmentDrawerIsOpen={setEnrollmentDrawerIsOpen}
            subjectNode={selectedNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      default:
        return null;
    }
  }, [selectedNode, centerProgramsQuery, selectedProgram]);

  // FUNCTIONS && HANDLERS ····················································································|
  const formatedStepTitle = useMemo(() => {
    const programName = centerProgramsQuery?.find((item) => item.id === selectedProgram)?.name;
    if (selectedNode) {
      if (selectedNode.type === 'course') {
        return `${programName} - ${
          selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)
        } ${selectedNode.index}`;
      }
      if (selectedNode.type === 'group' && selectedNode.metadata?.course) {
        return `${programName} - ${selectedNode.metadata?.course}º${selectedNode.name}`;
      }
      return `${programName} - ${selectedNode.name}`;
    }
    return programName;
  }, [selectedNode, selectedProgram]);

  console.log('academicTreeQuery', academicTreeQuery);

  return (
    <>
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
                  setSelectedNode(null);
                }}
                value={selectedCenter}
                sx={{ width: 230 }}
              />
              <Select
                data={programSelectData}
                placeholder={'Select a program 🌎'}
                onChange={(value) => {
                  setSelectedProgram(value);
                  setSelectedNode(null);
                }}
                value={selectedProgram}
                sx={{ width: 180 }}
              />
            </Stack>
          </TotalLayoutHeader>
        }
      >
        {/* <VerticalStepperContainer
        // currentStep={store.currentStep}
        data={academicTreeQuery}
        // onChangeActiveIndex={setStep}
        scrollRef={scrollRef}
      > */}
        <Stack
          ref={scrollRef}
          // justifyContent="center"
          spacing={10}
          fullwidth
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb', padding: 24 }}
        >
          <Stack>
            <TreeView data={parsedTree} onSubjectClick={handleSubjectClick} />
          </Stack>
          {/* <TotalLayoutStepContainer stepName={formatedStepTitle} clean>
          {viewToRender}
        </TotalLayoutStepContainer> */}
          {viewToRender}
        </Stack>
        {/* </VerticalStepperContainer> */}
      </TotalLayoutContainer>
      <EnrollmentDrawer
        isOpen={enrollmentDrawerIsOpen}
        setIsOpen={setEnrollmentDrawerIsOpen}
        classes={[]}
      />
    </>
  );
};

export default AcademicTreePage;
