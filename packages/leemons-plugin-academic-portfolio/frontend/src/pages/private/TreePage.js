import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectCenter } from '@users/components/SelectCenter';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useQuery, useStore } from '@common';
import { find } from 'lodash';
import SelectProgram from '../../components/Selectors/SelectProgram';
import { getProgramTreeRequest, listSubjectCreditsForProgramRequest } from '../../request';

export default function TreePage() {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [store, render] = useStore();

  const params = useQuery();

  async function getProgramTree() {
    const [{ tree }, { subjectCredits }] = await Promise.all([
      getProgramTreeRequest(store.programId),
      listSubjectCreditsForProgramRequest(store.programId),
    ]);
    const result = [];

    function processItem(item, parents, parentId, childIndex) {
      let text = item.value.name;
      if (item.nodeType === 'courses') {
        text = item.value.name
          ? `${item.value.name} (${item.value.index}º)`
          : `${item.value.index}º`;
      }
      if (item.nodeType === 'class') {
        const classSubjectCredits = find(subjectCredits, {
          subject: item.value.subject.id,
        });
        const course = find(parents, { nodeType: 'courses' });
        text = `${course ? course.value.index : ''}${classSubjectCredits?.internalId} ${
          item.value.subject.name
        }`;
      }
      result.push({
        id: `${childIndex}.${parentId}.${item.value.id}`,
        parent: parents[parents.length - 1] ? parentId : 0,
        text,
        actions: [
          {
            name: 'rename',
            showOnHover: false,
            icon: () => <span>R</span>,
            handler: () => alert('Handler works'),
          },
          'edit',
          {
            name: 'delete',
          },
        ],
      });
      if (item.childrens && item.childrens.length) {
        item.childrens.forEach((child, index) =>
          processItem(
            child,
            [...parents, item],
            `${childIndex}.${parentId}.${item.value.id}`,
            index
          )
        );
      }
    }

    processItem(tree, [], '0');
    return result;
  }

  async function init() {
    store.centerId = params.center;
    store.programId = params.program;
    if (store.centerId && store.programId) {
      store.tree = await getProgramTree();
    }
    render();
  }

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
    }),
    [t]
  );

  function onSelectCenter(centerId) {
    store.centerId = centerId;
    render();
  }

  async function onSelectProgram(programId) {
    store.programId = programId;
    store.tree = await getProgramTree();
    render();
  }

  useEffect(() => {
    init();
  }, [params]);

  async function onSelect() {}

  async function onAdd() {}

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Grid grow>
                      <Col span={6}>
                        <SelectCenter
                          label={t('centerLabel')}
                          onChange={onSelectCenter}
                          value={store.centerId}
                        />
                      </Col>
                      <Col span={6}>
                        <SelectProgram
                          label={t('programLabel')}
                          onChange={onSelectProgram}
                          center={store.centerId}
                          value={store.programId}
                        />
                      </Col>
                    </Grid>
                    {store.tree ? (
                      <Box>
                        <Tree
                          treeData={store.tree}
                          allowDragParents={false}
                          onSelect={onSelect}
                          onAdd={onAdd}
                        />
                      </Box>
                    ) : null}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {store.program ? (
                  <Paper fullWidth padding={5}>
                    Gatitos
                  </Paper>
                ) : null}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
