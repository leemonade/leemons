/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import {
  Box,
  Button,
  ContextContainer,
  PageContainer,
  Paper,
  Select,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useStore } from '@common/useStore';
import { SelectCenter } from '@users/components/SelectCenter';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { find, isArray, map } from 'lodash';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { useHistory } from 'react-router-dom';
import {
  createClassRequest,
  createGroupRequest,
  createKnowledgeRequest,
  createSubjectRequest,
  createSubjectTypeRequest,
  detailProgramRequest,
  getProfilesRequest,
  listClassesRequest,
  listProgramsRequest,
  listSubjectCreditsForProgramRequest,
  updateClassRequest,
  updateProgramRequest,
  updateSubjectRequest,
} from '../../../request';
import { KnowledgeTable } from '../../../components/KnowledgeTable';
import { getKnowledgesTranslation } from '../../../helpers/getKnowledgesTranslation';
import { SubjectTypesTable } from '../../../components/SubjectTypesTable';
import { getSubjectTypesTranslation } from '../../../helpers/getSubjectTypesTranslation';
import { getTableActionsTranslation } from '../../../helpers/getTableActionsTranslation';
import { getSubjectsTranslation } from '../../../helpers/getSubjectsTranslation';
import { SubjectsTable } from '../../../components/SubjectsTable';
import { ProgramTreeType } from '../../../components/ProgramTreeType';
import { getProgramTreeTypeTranslation } from '../../../helpers/getProgramTreeTypeTranslation';
import { activeMenuItemTree } from '../../../helpers/activeMenuItemTree';

export default function SubjectList() {
  const [t] = useTranslateLoader(prefixPN('subject_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const history = useHistory();

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
      programTreeType: getProgramTreeTypeTranslation(t),
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
    store.program = { ...store.program };
    render();
  }

  async function createGroup({ name, abbreviation }) {
    try {
      const { group } = await createGroupRequest({
        name,
        abbreviation,
        program: store.program.id,
      });
      addSuccessAlert(t('groupCreated'));
      return group;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function addNewSubject({ name, course, internalId, credits }) {
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
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      render();
    }
    return null;
  }

  async function updateSubject({ id, course, internalId, credits, color }) {
    try {
      const { subject } = await updateSubjectRequest({
        id,
        course,
        internalId,
        credits,
        color,
      });
      return subject;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      render();
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
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      render();
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
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      render();
    }
    return null;
  }

  async function addUpdateClass(data, event, isUpdate) {
    try {
      if (!data.credits) data.credits = 1;
      if (event.isNewSubject) {
        const subject = await addNewSubject({
          name: data.subject,
          course: isArray(data.courses) ? null : data.courses,
          internalId: data.internalId,
          credits: data.credits,
        });
        if (!subject) return null;
        data.subject = subject?.id;
      } else {
        const subject = await updateSubject({
          id: data.subject,
          course: isArray(data.courses) ? null : data.courses,
          internalId: data.internalId,
          credits: data.credits,
          color: data.color,
        });
        if (!subject) return null;
      }

      if (event.isNewGroup) {
        const group = await createGroup({
          name: data.groups,
          abbreviation: data.groups,
        });
        if (!group) return null;
        data.groups = group?.id;
      }

      let classe = null;

      if (isUpdate) {
        classe = await updateClass(data);
      } else {
        classe = await addNewClass(data);
        await activeMenuItemTree();
      }

      if (classe) addSuccessAlert(isUpdate ? t('classUpdated') : t('classCreated'));
      store.program = await getProgramDetail();
      render();
      return true;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      render();
    }
    return null;
  }

  async function onProgramTreeTypeChange(event) {
    try {
      await updateProgramRequest({
        id: store.program.id,
        treeType: event,
      });
      store.program.treeType = event;
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function goTree() {
    await history.push(
      `/private/academic-portfolio/tree?center=${store.center}&program=${store.program.id}`
    );
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />
      <Paper color="solid" shadow="none">
        <PageContainer>
          <Box sx={(theme) => ({ marginBottom: theme.spacing[12] })}>
            <ContextContainer>
              <ContextContainer direction="row">
                <Box skipFlex>
                  <SelectCenter
                    label={t('centerLabel')}
                    placeholder={t('centerPlaceholder')}
                    onChange={onCenterChange}
                    firstSelected
                  />
                </Box>
                <Box skipFlex>
                  <Select
                    data={store.programs || []}
                    disabled={!store.programs}
                    label={t('programLabel')}
                    placeholder={t('programPlaceholder')}
                    onChange={onProgramChange}
                    value={store.selectProgram}
                  />
                </Box>
              </ContextContainer>

              {store.program ? (
                <Paper>
                  <ContextContainer divided>
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
                              <SelectUserAgent
                                profiles={store.profiles.teacher}
                                centers={store.center}
                              />
                            }
                          />,
                          <ProgramTreeType
                            key="3"
                            messages={messages.programTreeType}
                            value={store.program.treeType}
                            onChange={onProgramTreeTypeChange}
                            data={[
                              {
                                value: 1,
                                label: messages.programTreeType.opt1Label,
                                help: store.program.moreThanOneAcademicYear
                                  ? messages.programTreeType.opt1DescriptionNoCourse
                                  : messages.programTreeType.opt1Description,
                                helpPosition: 'bottom',
                              },
                              {
                                value: 2,
                                label: messages.programTreeType.opt2Label,
                                help: store.program.moreThanOneAcademicYear
                                  ? messages.programTreeType.opt2DescriptionNoCourse
                                  : messages.programTreeType.opt2Description,
                                helpPosition: 'bottom',
                              },
                              {
                                value: 3,
                                label: messages.programTreeType.opt3Label,
                                help: store.program.moreThanOneAcademicYear
                                  ? messages.programTreeType.opt3DescriptionNoCourse
                                  : messages.programTreeType.opt3Description,
                                helpPosition: 'bottom',
                              },
                              {
                                value: 4,
                                label: messages.programTreeType.opt4Label,
                                help: messages.programTreeType.opt4Description,
                                helpPosition: 'bottom',
                              },
                            ]}
                          />,
                        ]
                      : null}
                  </ContextContainer>
                </Paper>
              ) : null}
            </ContextContainer>
            {store.program ? (
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Button onClick={goTree}>{t('goTree')}</Button>
              </Box>
            ) : null}
          </Box>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
