import React, { useEffect, useState } from 'react';
import { find, forEach } from 'lodash';
import { withLayout } from '@layout/hoc';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { Box, Text, Title, Button } from '@bubbles-ui/components';
import { useHistory, useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { Tree, useTree } from 'leemons-ui';
import { addNodeLevelsRequest, detailCurriculumRequest } from '../../../request';

function AddCurriculumStep1() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [t, translations] = useTranslateLoader(prefixPN('addCurriculumStep1'));
  const [curriculum, setCurriculum] = useState({});
  const [nodeLevels, setNodeLevels] = useState([]);

  const tree = useTree();
  const history = useHistory();
  const { id } = useParams();

  function onCheckboxChange(event, nodeLevel, levelOrder) {
    if (event.target.checked) {
      nodeLevels[levelOrder] = nodeLevel;
      setNodeLevels([...nodeLevels]);
    } else {
      delete nodeLevels[levelOrder];
      setNodeLevels([...nodeLevels]);
    }
  }

  // eslint-disable-next-line react/prop-types
  function NodeLevelInput({ nodeLevel, levelOrder }) {
    return (
      <input
        type="checkbox"
        checked={nodeLevels.indexOf(nodeLevel) >= 0}
        onChange={(e) => onCheckboxChange(e, nodeLevel, levelOrder)}
      />
    );
  }

  useEffect(() => {
    tree.setTreeData([
      {
        id: 'program',
        parent: 0,
        draggable: false,
        text: (
          <>
            <NodeLevelInput nodeLevel="program" levelOrder={1} />
            {t('program')}
          </>
        ),
      },
      {
        id: 'courses',
        parent: 'program',
        draggable: false,
        text: (
          <>
            <NodeLevelInput nodeLevel="courses" levelOrder={2} />
            {t('courses')}
          </>
        ),
      },
      {
        id: 'groups',
        parent: 'courses',
        draggable: false,
        text: (
          <>
            <NodeLevelInput nodeLevel="groups" levelOrder={3} />
            {t('groups')}
          </>
        ),
      },
      {
        id: 'knowledges',
        parent: 'subjectType',
        draggable: false,
        text: (
          <>
            <NodeLevelInput nodeLevel="knowledges" levelOrder={4} />
            {t('knowledges')}
          </>
        ),
      },
      {
        id: 'subjectType',
        parent: 'groups',
        draggable: false,
        text: (
          <>
            <NodeLevelInput nodeLevel="subjectType" levelOrder={5} />
            {t('subjectType')}
          </>
        ),
      },
    ]);
  }, [translations, nodeLevels]);

  async function load() {
    try {
      setLoading(true);
      const [
        { curriculum: c },
        {
          data: { items: centers },
        },
      ] = await Promise.all([
        detailCurriculumRequest(id),
        listCentersRequest({ page: 0, size: 999999 }),
      ]);

      const { program } = await detailProgramRequest(c.program);

      c.program = program;
      c.center = find(centers, { id: c.center });

      setCurriculum(c);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    try {
      setSaving(true);
      const toSend = [];
      forEach(nodeLevels, (nodeLevel) => {
        if (nodeLevel) {
          toSend.push({
            name: t(nodeLevel),
            type: nodeLevel,
            listType: 'style-1',
            levelOrder: toSend.length,
          });
        }
      });
      await addNodeLevelsRequest(curriculum.id, toSend);
      await history.push(`/private/curriculum/${curriculum.id}/step/2`);
      setSaving(false);
    } catch (e) {
      setSaving(false);
    }
  }

  if (loading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box m={32}>
      <Box mb={12}>
        <Title>{curriculum.name}</Title>
      </Box>
      <Box mb={12}>
        <Title order={3}>
          {curriculum.center.name}|{curriculum.program.name}
        </Title>
      </Box>
      <Box mb={12}>
        <Text role={'productive'}>{t('description1')}</Text>
      </Box>
      <Box mb={16}>
        <Text role={'productive'}>{t('description2')}</Text>
      </Box>
      <Box>
        <Tree
          {...tree}
          rootId={0}
          onAdd={(id) => alert(`Add Node inside parentId: ${id}`)}
          onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
          onEdit={(node) => alert(`Editing ${node.id}`)}
        />
        <Box mt={16}>
          <Button rounded size="xs" loading={saving} loaderPosition="right" onClick={save}>
            {t('saveButtonLabel')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default withLayout(AddCurriculumStep1);
