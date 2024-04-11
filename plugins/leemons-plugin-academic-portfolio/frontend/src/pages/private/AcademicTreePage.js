import React, { useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useUserCenters } from '@users/hooks';
import {
  Select,
  TotalLayoutContainer,
  TotalLayoutHeader,
  Stack,
  ImageLoader,
  Box,
} from '@bubbles-ui/components';
import useProgramAcademicTree from '@academic-portfolio/hooks/queries/useProgramAcademicTree';
import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';
import EnrollmentDrawer from '@academic-portfolio/components/AcademicTree/EnrollmentDrawer/EnrollmentDrawer';
import { DndProvider } from 'react-dnd';
import { Tree, MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { CourseView } from '@academic-portfolio/components/AcademicTree/CourseView/CourseView';
import { GroupView } from '../../components/AcademicTree/GroupView/GroupView';
import SubjectView from '../../components/AcademicTree/SubjectView/SubjectView';
import { NodeRenderer } from '../../components/AcademicTree/NodeRenderer/NodeRenderer';
import { TreeHeader } from '../../components/AcademicTree/TreeHeader/TreeHeader';

const AcademicTreePage = () => {
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [enrollmentDrawerIsOpen, setEnrollmentDrawerIsOpen] = useState(false);
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [enrolllmentDrawerOpenedFromClassroom, setEnrolllmentDrawerOpenedFromClassroom] =
    useState(null);
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const scrollRef = useRef();
  const history = useHistory();

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

  const generateGUID = () => `_${Math.random().toString(36).substr(2, 9)}`;

  const parseAcademicTreeData = (academicTreeData) => {
    const trees = [];
    const processNode = (node, parentId = 0, parentElementId = 0, isRoot = false) => {
      const guid = generateGUID();
      const treeNode = {
        id: guid,
        parent: parentId,
        nodeId: guid,
        text: node.name || `Curso ${node.index}`,
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

    return trees;
  };

  const treeStructures = useMemo(
    () => parseAcademicTreeData(academicTreeQuery || []),
    [academicTreeQuery]
  );
  // FUNCTIONS && HANDLERS ····················································································|
  const toggleEnrollmentDrawer = (classroomId = null) => {
    setEnrollmentDrawerIsOpen((prevState) => !prevState);
    setEnrolllmentDrawerOpenedFromClassroom(classroomId);
  };

  const findNodeById = (node, id) => {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      return node.children.reduce((acc, child) => acc || findNodeById(child, id), null);
    }
    return null;
  };

  const findNodeInTrees = (trees, id) =>
    trees.reduce((acc, tree) => acc || findNodeById(tree, id), null);

  const selectedNodeObject = useMemo(
    () => findNodeInTrees(academicTreeQuery || [], selectedTreeNode?.itemId),
    [academicTreeQuery, selectedTreeNode]
  );

  console.log('selectedNodeObject', selectedNodeObject);

  // RENDER ····················································································|

  const viewToRender = useMemo(() => {
    switch (selectedTreeNode?.type) {
      case 'course':
        return (
          <CourseView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            courseTreeNode={selectedTreeNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      case 'group':
        return (
          <GroupView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            groupTreeNode={selectedTreeNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      // case 'knowledgeArea':
      //   return <div>knowledgeArea</div>;
      case 'subject':
        return (
          <SubjectView
            scrollRef={scrollRef}
            openEnrollmentDrawer={toggleEnrollmentDrawer}
            subjectTreeNode={selectedTreeNode}
            program={centerProgramsQuery?.find((item) => item.id === selectedProgram)}
          />
        );
      default:
        return null;
    }
  }, [selectedTreeNode, centerProgramsQuery, selectedProgram]);

  return (
    <>
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
        <Stack
          ref={scrollRef}
          spacing={10}
          fullwidth
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb', padding: 24 }}
        >
          <Stack direction="column" spacing={6} sx={{ width: '15%' }}>
            {treeStructures.map((treeStructure, index) => (
              <Box key={`${index}-${treeStructure?.header?.name}`}>
                {treeStructure.header && <TreeHeader name={treeStructure.header.name} />}
                <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                  <Tree
                    tree={treeStructure.treeData}
                    rootId={0}
                    canDrag={() => false}
                    canDrop={() => false}
                    render={(node, { depth, isOpen, onToggle }) => (
                      <NodeRenderer
                        node={node}
                        depth={depth}
                        isOpen={isOpen}
                        onToggle={onToggle}
                        isActive={selectedTreeNode?.nodeId === node.nodeId}
                        handleNodeClick={handleNodeClick}
                      />
                    )}
                  />
                </DndProvider>
              </Box>
            ))}
          </Stack>
          {viewToRender}
        </Stack>
      </TotalLayoutContainer>
      <EnrollmentDrawer
        scrollRef={scrollRef}
        isOpen={enrollmentDrawerIsOpen}
        closeDrawer={toggleEnrollmentDrawer}
        selectedTreeNode={selectedTreeNode}
        selectedNode={selectedNodeObject}
        centerId={centerProgramsQuery?.find((item) => item.id === selectedProgram)?.center}
        opensFromClasroom={enrolllmentDrawerOpenedFromClassroom} // classroomId (string)
      />
    </>
  );
};

export default AcademicTreePage;
