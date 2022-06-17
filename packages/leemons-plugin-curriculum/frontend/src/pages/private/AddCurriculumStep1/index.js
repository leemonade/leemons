import React, { useEffect, useState } from 'react';
import { find, forEach } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  LoadingOverlay,
  PageContainer,
  Paper,
  Stack,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useHistory, useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { addNodeLevelsRequest, detailCurriculumRequest } from '../../../request';

function AddCurriculumStep1() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [t, translations] = useTranslateLoader(prefixPN('addCurriculumStep1'));
  const [curriculum, setCurriculum] = useState({});
  const defaultNodeLevels = [];
  defaultNodeLevels[1] = 'program';
  defaultNodeLevels[6] = 'subject';
  const [nodeLevels, setNodeLevels] = useState(defaultNodeLevels);

  const tree = useTree();
  const history = useHistory();
  const { id } = useParams();

  function onCheckboxChange(event, nodeLevel, levelOrder) {
    if (event) {
      nodeLevels[levelOrder] = nodeLevel;
      setNodeLevels([...nodeLevels]);
    } else {
      delete nodeLevels[levelOrder];
      setNodeLevels([...nodeLevels]);
    }
  }

  useEffect(() => {
    tree.setTreeData([
      /*
      {
        id: 'program',
        parent: 0,
        draggable: false,
        text: (
          <Checkbox
            label={t('program')}
            checked={nodeLevels.indexOf('program') >= 0}
            onChange={(e) => onCheckboxChange(e, 'program', 1)}
          />
        ),
      },

       */
      {
        id: 'courses',
        parent: 0,
        draggable: false,
        text: (
          <Checkbox
            label={t('courses')}
            checked={nodeLevels.indexOf('courses') >= 0}
            onChange={(e) => onCheckboxChange(e, 'courses', 2)}
          />
        ),
      },
      {
        id: 'groups',
        parent: 'courses',
        draggable: false,
        text: (
          <Checkbox
            label={t('groups')}
            checked={nodeLevels.indexOf('groups') >= 0}
            onChange={(e) => onCheckboxChange(e, 'groups', 3)}
          />
        ),
      },
      {
        id: 'knowledges',
        parent: 'subjectType',
        draggable: false,
        text: (
          <Checkbox
            label={t('knowledges')}
            checked={nodeLevels.indexOf('knowledges') >= 0}
            onChange={(e) => onCheckboxChange(e, 'knowledges', 4)}
          />
        ),
      },
      {
        id: 'subjectType',
        parent: 'groups',
        draggable: false,
        text: (
          <Checkbox
            label={t('subjectType')}
            checked={nodeLevels.indexOf('subjectType') >= 0}
            onChange={(e) => onCheckboxChange(e, 'subjectType', 5)}
          />
        ),
      },
      {
        id: 'subject',
        parent: 'knowledges',
        draggable: false,
        text: (
          <Checkbox label={t('subject')} disabled checked={nodeLevels.indexOf('subject') >= 0} />
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
            listType: 'not-ordered',
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
    return <LoadingOverlay visible />;
  }
  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: `${curriculum.name} <br/> (${curriculum.center.name}|${curriculum.program.name})`,
          description: t('description1') + t('description2'),
        }}
      />

      <Paper fullHeight color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer divided padded="vertical">
            <Box>
              <ContextContainer>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Tree {...tree} rootId={0} />
                  </ContextContainer>
                </Paper>
                <Alert severity="warning" closeable={false} title={t('alertTitle')}>
                  <Box dangerouslySetInnerHTML={{ __html: t('alertDescription') }} />
                </Alert>
              </ContextContainer>
            </Box>
            <Stack justifyContent="end">
              <Button onClick={save} loading={saving} type="submit">
                {t('saveButtonLabel')}
              </Button>
            </Stack>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

export default AddCurriculumStep1;
