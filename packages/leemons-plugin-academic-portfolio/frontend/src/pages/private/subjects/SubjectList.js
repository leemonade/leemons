import React, { useMemo } from 'react';
import { ContextContainer, PageContainer, Select } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useStore } from '@common/useStore';
import { SelectCenter } from '@users/components/SelectCenter';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { map } from 'lodash';
import {
  createKnowledgeRequest,
  detailProgramRequest,
  listProgramsRequest,
} from '../../../request';
import { KnowledgeTable } from '../../../components/KnowledgeTable';
import { getKnowledgesTranslation } from '../../../helpers/getKnowledgesTranslation';

export default function SubjectList() {
  const [t] = useTranslateLoader(prefixPN('subject_page'));

  const [store, render] = useStore({
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
      knowledge: getKnowledgesTranslation(t),
    }),
    [t]
  );

  async function getProgramDetail() {
    const { program } = await detailProgramRequest(store.selectProgram);
    return program;
  }

  async function onCenterChange(center) {
    const {
      data: { items },
    } = await listProgramsRequest({ page: 0, size: 9999, center });
    store.programs = map(items, ({ id, name }) => ({ value: id, label: name }));
    store.selectProgram = null;
    render();
  }

  async function onProgramChange(program) {
    store.selectProgram = program;
    store.program = await getProgramDetail();
    render();
  }

  async function addKnowledge(knowledge) {
    try {
      const response = await createKnowledgeRequest({
        ...knowledge,
        program: store.program.id,
        icon: '-',
      });
      store.program.knowledges.push(response.knowledge);
      addSuccessAlert(t('addKnowledgeDone'));
    } catch (err) {
      addErrorAlert(err.message);
    }
    store.program.knowledges = [...store.program.knowledges];
    render();
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />
      <PageContainer>
        <ContextContainer>
          <ContextContainer direction="row">
            <SelectCenter
              label={t('centerLabel')}
              placeholder={t('centerPlaceholder')}
              onChange={onCenterChange}
              firstSelected
            />
            <Select
              data={store.programs || []}
              disabled={!store.programs}
              label={t('programLabel')}
              placeholder={t('programPlaceholder')}
              onChange={onProgramChange}
              value={store.selectProgram}
            />
          </ContextContainer>
          {store.program && store.program.haveKnowledge ? (
            <KnowledgeTable
              messages={messages.knowledge}
              program={store.program}
              onAdd={addKnowledge}
            />
          ) : null}
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
