import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useUserCenters } from '@users/hooks';
import {
  Select,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  Stack,
  ImageLoader,
  Box,
  LoadingOverlay,
} from '@bubbles-ui/components';
import useProgramAcademicTree from '@academic-portfolio/hooks/queries/useProgramAcademicTree';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import EnrollmentDrawer from '@academic-portfolio/components/AcademicTree/EnrollmentDrawer/EnrollmentDrawer';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { CourseView } from '@academic-portfolio/components/AcademicTree/CourseView/CourseView';
import { KnowledgeView } from '@academic-portfolio/components/AcademicTree/KnowledgeView/KnowledgeView';
import TreeBox from '@academic-portfolio/components/AcademicTree/TreeBox';
import { EmptyState } from '@academic-portfolio/components/EmptyState';
import { OpenIcon } from '@bubbles-ui/icons/outline';
import { cloneDeep, sortBy } from 'lodash';
import { GroupView } from '../../components/AcademicTree/GroupView/GroupView';
import SubjectView from '../../components/AcademicTree/SubjectView/SubjectView';

const AcademicTreePage = () => {
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [enrollmentDrawerIsOpen, setEnrollmentDrawerIsOpen] = useState(false);

  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [enrolllmentDrawerOpenedFromClassroom, setEnrolllmentDrawerOpenedFromClassroom] =
    useState(null);
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters({
    refetchOnWindowFocus: false,
  });
  const scrollRef = useRef();
  const history = useHistory();
  const viewRef = useRef();

  const handleNodeClick = (nodeId) => {
    setSelectedTreeNode(nodeId);
  };

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
      const sortedCenterProgramsQuery = sortBy(centerProgramsQuery, 'createdAt');
      return [
        ...sortedCenterProgramsQuery.map((program) => ({ value: program.id, label: program.name })),
      ];
    }
    return [];
  }, [centerProgramsQuery]);

  const { data: academicTreeQuery, isLoading: isAcademicTreeLoading } = useProgramAcademicTree({
    programId: selectedProgram,
    options: { enabled: selectedProgram?.length > 0 },
  });

  const isLoading = useMemo(
    () =>
      areCentersLoading ||
      areCenterProgramsLoading ||
      (programSelectData.length > 0 && isAcademicTreeLoading),
    [areCenterProgramsLoading, isAcademicTreeLoading, programSelectData]
  );

  const generateGUID = () => uuidv4();

  const parseAcademicTreeData = (academicTreeData) => {
    const trees = [];
    const processNode = (node, parentId = 0, parentElementId = 0, isRoot = false) => {
      const guid = generateGUID();
      const treeNode = {
        id: guid,
        parent: parentId,
        nodeId: guid,
        text: node.type === 'course' ? `${t('courseTranslation')} ${node.index}` : node.name,
        type: node.type,
        droppable: !!node.children && node.children.length > 0,
        parentItemId: parentElementId,
        itemId: node.id,
      };

      const processedNodes = [];
      if (!isRoot) {
        processedNodes.push(treeNode);
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processedNodes.push(...processNode(child, isRoot ? 0 : guid, isRoot ? 0 : node.id));
        });
      }

      return processedNodes;
    };

    academicTreeData.forEach((rootNode) => {
      if (rootNode.type === 'cycle') {
        const tree = {
          header: rootNode,
          treeData: rootNode.children ? processNode(rootNode, 0, 0, true) : [],
        };
        trees.push(tree);
      } else {
        trees.push({
          header: null,
          treeData: processNode(rootNode),
        });
      }
    });
    if (trees.length > 0 && trees[0].treeData.length > 0) {
      setSelectedTreeNode(trees[0].treeData[0]);
    }
    return trees;
  };

  const treeStructures = useMemo(
    () => parseAcademicTreeData(academicTreeQuery || []),
    [academicTreeQuery]
  );

  // EFFECTS ····················································································|Ç
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

  // FUNCTIONS && HANDLERS ····················································································|
  const toggleEnrollmentDrawer = (classroomId = null) => {
    setEnrollmentDrawerIsOpen((prevState) => !prevState);
    setEnrolllmentDrawerOpenedFromClassroom(classroomId);
  };

  const findNodeById = (node, id, parentType = null) => {
    if (node.id === id) {
      return { ...node, parentNodeType: parentType }; // Add parentNodeType property
    }
    if (node.children) {
      return node.children.reduce((acc, child) => acc || findNodeById(child, id, node.type), null); // Pass current node's type as parentType for the next level
    }
    return null;
  };

  const findNodeInTrees = (trees, id) =>
    trees.reduce((acc, tree) => acc || findNodeById(tree, id), null);

  const selectedNodeObject = useMemo(
    () => findNodeInTrees(academicTreeQuery || [], selectedTreeNode?.itemId),
    [academicTreeQuery, selectedTreeNode]
  );

  const searchForGroupType = useCallback(
    (nodes) =>
      nodes.some((node) => {
        if (node.type === 'group') return true;
        if (node.children) return searchForGroupType(node.children);
        return false;
      }),
    []
  );

  const programHasReferenceGroups = useMemo(() => {
    if (academicTreeQuery) {
      return searchForGroupType(academicTreeQuery);
    }
    return false;
  }, [academicTreeQuery, searchForGroupType]);

  // RENDER ····················································································|

  const viewToRender = useMemo(() => {
    switch (selectedTreeNode?.type) {
      case 'course':
        return (
          <CourseView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            courseTreeNode={cloneDeep(selectedTreeNode)}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
            programHasReferenceGroups={programHasReferenceGroups}
          />
        );
      case 'group':
        return (
          <GroupView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            groupTreeNode={cloneDeep(selectedTreeNode)}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      case 'knowledgeArea':
        return (
          <KnowledgeView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            knowledgeTreeNode={cloneDeep(selectedTreeNode)}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      case 'subject':
        return (
          <SubjectView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            subjectTreeNode={cloneDeep(selectedTreeNode)}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      default:
        return null;
    }
  }, [selectedTreeNode, centerProgramsQuery, selectedProgram, programHasReferenceGroups]);

  const TreeBoxMemo = useMemo(
    () => (
      <TreeBox
        treeStructures={treeStructures}
        selectedTreeNode={selectedTreeNode}
        handleNodeClick={handleNodeClick}
      />
    ),
    [treeStructures, selectedTreeNode]
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('enrollmentAndManagement').toUpperCase()}
            onCancel={() => history.goBack()}
            mainActionLabel={t('cancelHeaderButton')}
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
                placeholder={t('centerPlaceholder')}
                onChange={(value) => {
                  setSelectedCenter(value);
                  setSelectedTreeNode(null);
                }}
                value={selectedCenter}
                sx={{ width: 230 }}
              />
              <Select
                data={programSelectData}
                placeholder={t('programPlaceholder')}
                onChange={(value) => {
                  setSelectedProgram(value);
                  setSelectedTreeNode(null);
                }}
                value={selectedProgram}
                sx={{ width: 180 }}
              />
            </Stack>
          </TotalLayoutHeader>
        }
      >
        {programSelectData.length < 1 ? (
          <Stack
            justifyContent="center"
            ref={scrollRef}
            style={{ overflow: 'auto' }}
            fullWidth
            fullHeight
          >
            <TotalLayoutStepContainer scrollRef={scrollRef}>
              <EmptyState
                description={t('noProgramEmptyStateDescription')}
                actionLabel={t('noProgramEmptyStateAction')}
                Icon={<OpenIcon />}
                onClick={() => history.push('/private/academic-portfolio/programs')}
              />
            </TotalLayoutStepContainer>
          </Stack>
        ) : (
          <Stack
            ref={scrollRef}
            spacing={4}
            sx={{
              overflowY: 'auto',
              backgroundColor: '#f8f9fb',
              width: '100%',
              maxWidth: 1400,
              margin: 'auto',
              paddingTop: 24,
              paddingInline: 24,
            }}
          >
            {TreeBoxMemo}
            <Box sx={{ width: 192 }}></Box>
            <Stack direction="column" sx={{ width: 'calc(100% - 192px)' }} ref={viewRef}>
              {viewToRender}
            </Stack>
          </Stack>
        )}
      </TotalLayoutContainer>
      <EnrollmentDrawer
        scrollRef={scrollRef}
        isOpen={enrollmentDrawerIsOpen}
        closeDrawer={toggleEnrollmentDrawer}
        selectedNode={selectedNodeObject}
        centerId={centerProgramsQuery?.find((item) => item.id === selectedProgram)?.center}
        opensFromClasroom={enrolllmentDrawerOpenedFromClassroom} // classroomId (string)
      />
    </>
  );
};

export default AcademicTreePage;
