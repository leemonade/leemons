import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { cloneDeep } from 'lodash';
import { useUserCenters } from '@users/hooks';
import {
  Select,
  TotalLayoutContainer,
  TotalLayoutHeader,
  Stack,
  ImageLoader,
} from '@bubbles-ui/components';
import useProgramAcademicTree from '@academic-portfolio/hooks/queries/useProgramAcademicTree';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import EnrollmentDrawer from '@academic-portfolio/components/AcademicTree/EnrollmentDrawer/EnrollmentDrawer';
import { GroupView } from '../../components/AcademicTree/GroupView/GroupView';
import SubjectView from '../../components/AcademicTree/SubjectView/SubjectView';

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
  const [enrolllmentDrawerOpenedFromClassroom, setEnrolllmentDrawerOpenedFromClassroom] =
    useState(null);
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
    setSelectedNode(cloneDeep(item));
  };

  const addParentInfo = (node, parent = null) => {
    node.parent = parent;

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

  // FUNCTIONS && HANDLERS ····················································································|
  const toggleEnrollmentDrawer = (classroomId = null) => {
    setEnrollmentDrawerIsOpen((prevState) => !prevState);
    setEnrolllmentDrawerOpenedFromClassroom(classroomId);
  };

  // RENDER ····················································································|

  const viewToRender = useMemo(() => {
    switch (selectedNode?.type) {
      case 'cycle':
        return <div>CYCLE</div>;
      case 'course':
        return <div>COURSE</div>;
      case 'group':
        return (
          <GroupView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            groupNode={selectedNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      case 'knowledgeArea':
        return <div>knowledgeArea</div>;
      case 'subject':
        return (
          <SubjectView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            subjectNode={selectedNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      default:
        return null;
    }
  }, [selectedNode, centerProgramsQuery, selectedProgram]);

  return (
    <>
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={'MATRICULACIÓN Y GESTIÓN 🔫'}
            onCancel={() => history.goBack()}
            mainActionLabel={'Cancelar 🔫'}
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
          {viewToRender}
        </Stack>
      </TotalLayoutContainer>
      <EnrollmentDrawer
        scrollRef={scrollRef}
        isOpen={enrollmentDrawerIsOpen}
        closeDrawer={toggleEnrollmentDrawer}
        selectedNode={selectedNode}
        centerId={centerProgramsQuery?.find((item) => item.id === selectedProgram)?.center}
        opensFromClasroom={enrolllmentDrawerOpenedFromClassroom} // classroomId (string)
      />
    </>
  );
};

export default AcademicTreePage;
