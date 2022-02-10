/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import { ContextContainer, PageContainer, Select } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useStore } from '@common/useStore';
import { SelectCenter } from '@users/components/SelectCenter';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { find, map } from 'lodash';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import SelectUserAgent from '@users/components/SelectUserAgent';
import {
  createClassRequest,
  createKnowledgeRequest,
  createSubjectRequest,
  createSubjectTypeRequest,
  detailProgramRequest,
  getProfilesRequest,
  listClassesRequest,
  listProgramsRequest,
  listSubjectCreditsForProgramRequest,
  updateClassRequest,
  updateSubjectRequest,
} from '../../../request';
import { KnowledgeTable } from '../../../components/KnowledgeTable';
import { getKnowledgesTranslation } from '../../../helpers/getKnowledgesTranslation';
import { SubjectTypesTable } from '../../../components/SubjectTypesTable';
import { getSubjectTypesTranslation } from '../../../helpers/getSubjectTypesTranslation';
import { getTableActionsTranslation } from '../../../helpers/getTableActionsTranslation';
import { getSubjectsTranslation } from '../../../helpers/getSubjectsTranslation';
import { SubjectsTable } from '../../../components/SubjectsTable';

export default function SubjectList() {
  const [t] = useTranslateLoader(prefixPN('subject_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    mounted: true,
    programs: [],
    currentProgram: null,
    teacherSelects: {},
  });

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
      knowledge: getKnowledgesTranslation(t),
      subjectTypes: getSubjectTypesTranslation(t),
      subjects: getSubjectsTranslation(t),
      tableLabels: getTableActionsTranslation(t),
    }),
    [t]
  );

  async function getProgramClasses() {
    const {
      data: { items },
    } = await listClassesRequest({ page: 0, size: 9999, program: store.selectProgram });
    return items;
  }

  async function getProgramDetail() {
    const [{ program }, { subjectCredits }, classes] = await Promise.all([
      detailProgramRequest(store.selectProgram),
      listSubjectCreditsForProgramRequest(store.selectProgram),
      getProgramClasses(),
    ]);

    map(classes, (classe) => {
      const classSubjectCredits = find(subjectCredits, {
        subject: classe.subject.id,
      });
      classe.credits = classSubjectCredits?.credits;
      classe.internalId = classSubjectCredits?.internalId;
      classe.schedule = { days: classe.schedule };
      classe.teacher = find(classe.teachers, { type: 'main-teacher' })?.teacher;
    });
    return { ...program, classes, subjectCredits };
  }

  async function onCenterChange(center) {
    const {
      data: { items },
    } = await listProgramsRequest({ page: 0, size: 9999, center });
    store.center = center;
    store.programs = map(items, ({ id, name }) => ({ value: id, label: name }));
    store.selectProgram = null;
    render();
  }

  async function onProgramChange(programId) {
    store.selectProgram = programId;
    const [program, { profiles }] = await Promise.all([getProgramDetail(), getProfilesRequest()]);
    store.program = program;
    store.profiles = profiles;
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
      addErrorAlert(getErrorMessage(err));
    }
    store.program.knowledges = [...store.program.knowledges];
    render();
  }

  async function addSubjectType(subjectType) {
    try {
      const response = await createSubjectTypeRequest({
        ...subjectType,
        program: store.program.id,
      });
      store.program.subjectTypes.push(response.subjectType);
      addSuccessAlert(t('addSubjectTypeDone'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.program.subjectTypes = [...store.program.subjectTypes];
    render();
  }

  async function addNewSubject({ name, course, internalId, credits, substages }) {
    try {
      const { subject } = await createSubjectRequest({
        name,
        course,
        internalId,
        program: store.program.id,
        credits,
      });
      addSuccessAlert(t('subjectCreated'));
      return subject;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function updateSubject({ id, course, internalId, credits }) {
    try {
      const { subject } = await updateSubjectRequest({
        id,
        course,
        internalId,
        credits,
      });
      return subject;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function addNewClass({
    courses,
    knowledges,
    substages,
    credits,
    groups,
    internalId,
    schedule,
    teacher,
    ...data
  }) {
    try {
      const { class: c } = await createClassRequest({
        ...data,
        course: courses,
        knowledge: knowledges,
        substage: substages,
        program: store.program.id,
        group: groups,
        schedule: schedule ? schedule.days : [],
        teachers: teacher ? [{ teacher, type: 'main-teacher' }] : [],
      });
      return c;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function updateClass({
    courses,
    knowledges,
    substages,
    credits,
    groups,
    internalId,
    schedule,
    teacher,
    ...data
  }) {
    try {
      const { class: c } = await updateClassRequest({
        ...data,
        course: courses,
        knowledge: knowledges,
        substage: substages,
        group: groups,
        schedule: schedule ? schedule.days : [],
        teachers: teacher ? [{ teacher, type: 'main-teacher' }] : [],
      });
      return c;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function addUpdateClass(data, event, isUpdate) {
    try {
      if (event.isNewSubject) {
        const subject = await addNewSubject({
          name: data.subject,
          course: data.courses,
          internalId: data.internalId,
          credits: data.credits,
        });
        if (!subject) return null;
        data.subject = subject?.id;
      } else {
        const subject = await updateSubject({
          id: data.subject,
          course: data.courses,
          internalId: data.internalId,
          credits: data.credits,
        });
        if (!subject) return null;
      }

      let classe = null;
      if (isUpdate) {
        classe = await updateClass(data);
      } else {
        classe = await addNewClass(data);
      }

      if (classe) addSuccessAlert(isUpdate ? t('classUpdated') : t('classCreated'));
      store.program = await getProgramDetail();
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />
      <PageContainer>
        <ContextContainer divided>
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
              tableLabels={messages.tableLabels}
              program={store.program}
              onAdd={addKnowledge}
            />
          ) : null}
          {store.program
            ? [
                <SubjectTypesTable
                  key="1"
                  messages={messages.subjectTypes}
                  tableLabels={messages.tableLabels}
                  program={store.program}
                  onAdd={addSubjectType}
                />,
                <SubjectsTable
                  key="2"
                  messages={messages.subjects}
                  tableLabels={messages.tableLabels}
                  program={store.program}
                  onAdd={(d, e) => addUpdateClass(d, e, false)}
                  onUpdate={(d, e) => addUpdateClass(d, e, true)}
                  teacherSelect={
                    <SelectUserAgent profiles={store.profiles.student} centers={store.center} />
                  }
                />,
              ]
            : null}
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
