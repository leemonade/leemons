import ProgramTreeType from '@academic-portfolio/components/ProgramTreeType';
import { TreeCycleDetail } from '@academic-portfolio/components/Tree/TreeCycleDetail';
import { getCycleTreeTypeTranslation } from '@academic-portfolio/helpers/getCycleTreeTypeTranslation';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import {
  ActionButton,
  Box,
  Button,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
  useResizeObserver,
  useTree,
} from '@bubbles-ui/components';
import {
  AddCircleIcon,
  DuplicateIcon,
  PluginSettingsIcon,
  RemoveIcon,
} from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useQuery, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { cloneDeep, find, forEach, isArray, isNil, isUndefined, map, omitBy } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import SelectProgram from '../../components/Selectors/SelectProgram';
import SelectSubjectsByTable from '../../components/Selectors/SelectSubjectsByTable';
import { TreeClassDetail } from '../../components/Tree/TreeClassDetail';
import { TreeCourseDetail } from '../../components/Tree/TreeCourseDetail';
import { TreeGroupDetail } from '../../components/Tree/TreeGroupDetail';
import { TreeKnowledgeDetail } from '../../components/Tree/TreeKnowledgeDetail';
import { TreeNewSubjectDetail } from '../../components/Tree/TreeNewSubjectDetail';
import { TreeProgramDetail } from '../../components/Tree/TreeProgramDetail';
import { TreeSubjectTypeDetail } from '../../components/Tree/TreeSubjectTypeDetail';
import getCourseName from '../../helpers/getCourseName';
import { getSubjectsTranslation } from '../../helpers/getSubjectsTranslation';
import { getTableActionsTranslation } from '../../helpers/getTableActionsTranslation';
import { getTreeAddUsersComponentTranslation } from '../../helpers/getTreeAddUsersComponentTranslation';
import { getTreeClassDetailTranslation } from '../../helpers/getTreeClassDetailTranslation';
import { getTreeCourseDetailTranslation } from '../../helpers/getTreeCourseDetailTranslation';
import { getTreeGroupDetailTranslation } from '../../helpers/getTreeGroupDetailTranslation';
import { getTreeKnowledgeDetailTranslation } from '../../helpers/getTreeKnowledgeDetailTranslation';
import { getTreeProgramDetailTranslation } from '../../helpers/getTreeProgramDetailTranslation';
import { getTreeSubjectTypeDetailTranslation } from '../../helpers/getTreeSubjectTypeDetailTranslation';
import {
  addStudentsToClassesUnderNodeTreeRequest,
  createClassRequest,
  createGroupRequest,
  createKnowledgeRequest,
  createSubjectRequest,
  createSubjectTypeRequest,
  detailProgramRequest,
  duplicateGroupRequest,
  getProfilesRequest,
  getProgramTreeRequest,
  listSubjectCreditsForProgramRequest,
  removeClassRequest,
  removeGroupFromClassesRequest,
  removeStudentFromClassRequest,
  removeSubjectRequest,
  updateClassRequest,
  updateCourseRequest,
  updateCycleRequest,
  updateGroupRequest,
  updateKnowledgeRequest,
  updateProgramRequest,
  updateSubjectRequest,
  updateSubjectTypeRequest,
} from '../../request';

export default function TreePage() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('tree_page'));
  const [ts, , , tsLoading] = useTranslateLoader(prefixPN('subject_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({
    scroll: 0,
    firstLoading: true,
  });
  const { openDeleteConfirmationModal, setLoading, layoutState } = useLayout();
  const treeProps = useTree();

  const [containerRef, container] = useResizeObserver();
  const [headerBaseRef, headerBase] = useResizeObserver();
  const [headerDescriptionRef, headerDescription] = useResizeObserver();

  const params = useQuery();

  function onScroll() {
    store.scroll = layoutState.contentRef.current.scrollTop;
    render();
  }

  React.useEffect(() => {
    layoutState.contentRef.current?.addEventListener('scroll', onScroll);

    // cleanup this component
    return () => {
      layoutState.contentRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [layoutState.contentRef.current]);

  useEffect(() => {
    if (store.tree) {
      treeProps.setTreeData(store.tree);
    }
  }, [store.tree]);

  function getTreeItemByTreeId(treeId) {
    const item = find(store.tree, { id: treeId });
    if (item) return item.item;
    return null;
  }

  function setAgainActiveTree() {
    let key = null;
    if (store.editingItem) key = 'editingItem';
    if (store.newItem) key = 'newItem';
    if (store.duplicateItem) key = 'duplicateItem';
    if (key) {
      const treeItem = getTreeItemByTreeId(store[key].treeId);
      if (treeItem) store[key] = treeItem;
    }
  }

  async function onEdit(item) {
    store.newItem = null;
    store.duplicateItem = null;
    store.showTreeType = null;
    store.editingItem = item;
    render();
  }

  async function onDuplicate(item) {
    store.newItem = null;
    store.editingItem = null;
    store.showTreeType = null;
    store.duplicateItem = item;
    render();
  }

  async function onRemove(item) {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          if (item.nodeType === 'groups') {
            await removeGroupFromClassesRequest(item.value.id);
          }
          if (item.nodeType === 'class') {
            await removeClassRequest(item.value.id);
          }

          // eslint-disable-next-line no-use-before-define
          store.tree = await getProgramTree();
          setAgainActiveTree();
          addSuccessAlert(t(`${item.nodeType}Removed`));
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        render();
      },
    })();
  }

  async function onNew(item) {
    store.editingItem = null;
    store.duplicateItem = null;
    store.showTreeType = null;
    store.newItem = item;
    render();
  }

  async function onNewSubject(item) {
    store.editingItem = null;
    store.duplicateItem = null;
    store.showTreeType = null;
    store.newItem = { ...item, nodeType: 'subject' };
    render();
  }

  async function getProgramTree() {
    setLoading(true);
    try {
      const [{ tree }, { subjectCredits }, { program }, { profiles }] = await Promise.all([
        getProgramTreeRequest(store.programId),
        listSubjectCreditsForProgramRequest(store.programId),
        detailProgramRequest(store.programId),
        getProfilesRequest(),
      ]);

      const classesBySubject = {};
      const result = [];
      const newSubjects = [];

      const editLabel = t('treeEdit');
      const removeLabel = t('treeRemove');
      const duplicateLabel = t('treeDuplicate');

      // eslint-disable-next-line no-inner-declarations
      function processItem(item, parents) {
        let text = item.value.name;
        if (item.nodeType === 'courses') {
          text = getCourseName(item.value);
        }
        if (item.nodeType === 'class') {
          const classSubjectCredits = find(subjectCredits, {
            subject: item.value.subject.id,
          });
          const course = find(parents, { nodeType: 'courses' });
          const groups = find(parents, { nodeType: 'groups' });
          const courseName = course ? course.value.index : '';
          const substageName =
            item.value.substages && item.value.substages.abbreviation
              ? ` - ${item.value.substages.abbreviation}`
              : '';
          let groupName = '';
          if (!groups) {
            groupName =
              item.value.groups && !item.value.groups.isAlone && item.value.groups.abbreviation
                ? ` - ${item.value.groups.abbreviation}`
                : '';
          }
          text = `${courseName}${classSubjectCredits?.internalId} ${item.value.subject.name}${groupName}${substageName}`;
          if (!isArray(classesBySubject[item.value.subject?.id]))
            classesBySubject[item.value.subject?.id] = [];
          classesBySubject[item.value.subject?.id].push({
            ...item.value,
            treeName: text,
            treeId: item.treeId,
          });
        }

        const actions = [
          {
            name: 'edit',
            tooltip: editLabel,
            showOnHover: true,
            handler: () => onEdit({ ...item }),
          },
        ];

        if (item.nodeType === 'groups') {
          actions.push({
            name: 'delete',
            tooltip: removeLabel,
            showOnHover: true,
            handler: () => onRemove({ ...item, parents }),
          });
        }

        if (item.nodeType === 'groups') {
          actions.push({
            name: 'duplicate',
            tooltip: duplicateLabel,
            showOnHover: true,
            icon: () => <DuplicateIcon />,
            handler: () => onDuplicate({ ...item, parents }),
          });
        }

        /*
        if (item.nodeType === 'class') {
          actions.push({
            name: 'add-subject',
            tooltip: t('newsubject'),
            showOnHover: true,
            icon: () => <AddCircleIcon />,
            handler: () => onNewSubject({ ...item, parents }),
          });
        }
         */

        if (
          item.nodeType !== 'program' &&
          item.nodeType !== 'class' &&
          item.nodeType !== 'courses' &&
          item.nodeType !== 'cycles'
        ) {
          actions.push({
            name: 'new',
            tooltip: t(`new${item.nodeType}`),
            showOnHover: true,
            icon: () => <AddCircleIcon />,
            handler: () => onNew({ ...item, parents }),
          });
        }

        const parent = parents[parents.length - 1]?.treeId || 0;

        result.push({
          id: item.treeId,
          parent,
          text,
          actions,
          item,
          handler: () => onEdit({ ...item }),
        });
        if (item.childrens && item.childrens.length) {
          item.childrens.forEach((child) => processItem(child, [...parents, item]));
        } else {
          const id = `add-button-${parents[parents.length - 1]?.treeId || 0}`;
          const exists = find(newSubjects, { id });
          if (!exists) {
            newSubjects.push({
              id,
              parent,
              text: t('newsubject'),
              type: 'button',
              draggable: false,
              node: null,
              data: {
                action: 'add',
              },
              handler: () => onNewSubject({ ...item, parents }),
            });
          }
        }
      }

      processItem(tree, []);
      store.profiles = profiles;
      store.program = program;
      store.classesBySubject = classesBySubject;
      setLoading(false);
      return result.concat(newSubjects);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
      return false;
    }
  }

  async function init() {
    if (params.center) store.centerId = params.center;
    if (params.program) store.programId = params.program;
    if (store.centerId && store.programId) {
      store.tree = await getProgramTree();
      setTimeout(() => {
        store.firstLoading = false;
      }, [500]);
    }
    render();
  }

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
      addUsers: getTreeAddUsersComponentTranslation(t),
      treeProgram: getTreeProgramDetailTranslation(t),
      treeCourse: getTreeCourseDetailTranslation(t),
      treeCycle: getCycleTreeTypeTranslation(t),
      treeGroup: getTreeGroupDetailTranslation(t),
      treeSubjectType: getTreeSubjectTypeDetailTranslation(t),
      treeKnowledge: getTreeKnowledgeDetailTranslation(t),
      treeClass: getTreeClassDetailTranslation(t),
      subjects: getSubjectsTranslation(ts),
      tableLabels: getTableActionsTranslation(ts),
    }),
    [t, ts]
  );

  function onSelectCenter(centerId) {
    if (!(!!params?.center && store.firstLoading)) {
      store.centerId = centerId;
      render();
    }
  }

  async function onSelectProgram(programId) {
    if (!(!!params?.program && store.firstLoading)) {
      store.programId = programId;
      store.editingItem = null;
      store.showTreeType = null;
      store.tree = await getProgramTree();
      render();
      setTimeout(() => {
        treeProps.setOpenAll(true);
      }, 100);
    }
  }

  useEffect(() => {
    if (!tLoading && !tsLoading) init();
  }, [params, tLoading, tsLoading]);

  async function addStudentIfNeed(students, id, nodeType) {
    if (students) {
      await addStudentsToClassesUnderNodeTreeRequest({
        program: store.programId,
        nodeType,
        nodeId: store.editingItem.treeId,
        students,
      });
    }
  }

  async function onSaveCycle({ id, name, managers, ...d }) {
    try {
      store.saving = true;
      render();
      // console.log('onSaveCycle', d);
      await updateCycleRequest({ id, name, managers });
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('cycleUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveProgram({ id, name, abbreviation, credits, students, managers }) {
    try {
      store.saving = true;
      render();
      await updateProgramRequest({ id, name, abbreviation, credits, managers });
      await addStudentIfNeed(students, id, 'program');
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('programUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveCourse({ id, name, credits, students, managers }) {
    try {
      store.saving = true;
      render();
      await updateCourseRequest({ id, name, abbreviation: name, number: credits, managers });
      await addStudentIfNeed(students, id, 'courses');
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('courseUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveGroup({ id, name, abbreviation, students, managers }) {
    try {
      store.saving = true;
      render();
      await updateGroupRequest({ id, name, abbreviation, managers });
      await addStudentIfNeed(students, id, 'groups');

      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('groupUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveSubjectType({
    students,
    id,
    name,
    groupVisibility,
    managers,
    credits_course,
    credits_program,
  }) {
    try {
      store.saving = true;
      render();
      await updateSubjectTypeRequest({
        id,
        name,
        groupVisibility: !!groupVisibility,
        credits_course,
        credits_program,
        managers,
      });
      await addStudentIfNeed(students, id, 'subjectType');
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('subjectTypeUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveKnowledge({
    id,
    name,
    abbreviation,
    color,
    credits_course,
    credits_program,
    managers,
    students,
  }) {
    try {
      store.saving = true;
      render();
      await updateKnowledgeRequest({
        id,
        name,
        abbreviation,
        color,
        credits_course,
        credits_program,
        managers,
        icon: ' ',
      });
      await addStudentIfNeed(students, id, 'knowledges');
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('knowledgeUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveSubject({
    id,
    name,
    course,
    subjectType,
    internalId,
    knowledge,
    image,
    icon,
    color,
  }) {
    try {
      store.saving = true;
      render();
      const body = {
        id,
        name,
        subjectType,
        image,
        icon,
        color,
        course,
        internalId,
      };
      if (!isUndefined(knowledge)) body.knowledge = knowledge;
      await updateSubjectRequest(body);
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(t('subjectUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function removeSubject(id) {
    openDeleteConfirmationModal({
      title: t('class.attention'),
      description: t('class.removeSubjectDescription'),
      labels: {
        confirm: t('class.removeSubjectButton'),
      },
      onConfirm: async () => {
        try {
          store.removing = true;
          render();
          await removeSubjectRequest(id);
          store.editingItem = null;
          store.duplicateItem = null;
          store.showTreeType = null;
          store.newItem = null;
          store.tree = await getProgramTree();
          setAgainActiveTree();
          addSuccessAlert(t('subjectRemoved'));
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        store.removing = false;
        render();
      },
    })();
  }

  async function removeClass(id) {
    openDeleteConfirmationModal({
      title: t('class.attention'),
      description: t('class.removeClassDescription'),
      labels: {
        confirm: t('class.removeSubjectButton'),
      },
      onConfirm: async () => {
        try {
          store.removing = true;
          render();
          await removeClassRequest(id);
          store.editingItem = null;
          store.duplicateItem = null;
          store.showTreeType = null;
          store.newItem = null;
          store.tree = await getProgramTree();
          setAgainActiveTree();
          addSuccessAlert(t('subjectRemoved'));
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        store.removing = false;
        render();
      },
    })();
  }

  function selectClass(classId) {
    const item = cloneDeep(store.editingItem || store.newItem);
    item.value = find(store.classesBySubject[item.value.subject?.id], {
      id: classId,
    });
    item.treeId = item.value.treeId;
    if (store.editingItem) {
      store.editingItem = item;
    }
    if (store.newItem) {
      store.newItem = item;
    }

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

  async function onSaveClass({ schedule, teacher, associateTeachers, group, isNewGroup, ...data }) {
    try {
      store.saving = true;
      render();
      let alert = null;
      const teachers = [];
      if (isNewGroup) {
        const g = await createGroup({ name: group, abbreviation: group });
        group = g.id;
      }
      if (teacher) {
        teachers.push({ type: 'main-teacher', teacher });
      }
      if (associateTeachers) {
        forEach(associateTeachers, (tea) => {
          teachers.push({ type: 'associate-teacher', teacher: tea });
        });
      }
      let subjectType = null;
      let course = null;
      if (store.newItem?.value?.courses) {
        if (isArray(store.newItem.value.courses)) {
          course = map(store.newItem.value.courses, 'id');
        } else {
          course = store.newItem.value.courses.id;
        }
      }
      if (store.newItem?.value?.subjectType) {
        subjectType = store.newItem.value.subjectType.id;
      }
      if (data.id) {
        await updateClassRequest({
          ...data,
          group,
          teachers,
          schedule: schedule ? schedule.days : [],
        });
        alert = ts('classUpdated');
      } else {
        const {
          class: { id },
        } = await createClassRequest({
          ...omitBy(data, isNil),
          group,
          teachers,
          course,
          subjectType,
          schedule: schedule ? schedule.days : [],
          subject: store.newItem.value.subject?.id,
          program: store.program.id,
        });
        // eslint-disable-next-line no-param-reassign
        data.id = id;
        store.editingItem = { ...store.newItem };
        store.newItem = null;
        store.showTreeType = null;
        alert = ts('classCreated');
      }
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(alert);
    } catch (err) {
      console.error(err);
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
    if (data?.id) selectClass(data.id);
  }

  async function onNewGroup(data) {
    try {
      store.saving = true;
      render();
      const aditionalData = {};
      if (data.subjects) {
        const types = {
          groups: 'group',
          courses: 'course',
          knowledges: 'knowledge',
          subjectType: 'subjectType',
        };
        forEach(store.newItem.parents, (parent) => {
          if (types[parent.nodeType]) {
            aditionalData[types[parent.nodeType]] = parent.value.id;
          }
        });
      }
      await createGroupRequest({
        ...data,
        aditionalData,
        program: store.program.id,
      });
      store.tree = await getProgramTree();
      store.newItem = null;
      addSuccessAlert(t('groupCreated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onDuplicateGroup({ id, name, abbreviation, students }) {
    try {
      store.saving = true;
      render();
      await duplicateGroupRequest({ id, name, abbreviation, students });
      store.tree = await getProgramTree();
      store.duplicateItem = null;
      addSuccessAlert(t('groupDuplicated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onNewSubjectType({ groupVisibility, ...data }) {
    try {
      store.saving = true;
      render();
      await createSubjectTypeRequest({
        ...data,
        groupVisibility: !!groupVisibility,
        program: store.program.id,
      });
      store.tree = await getProgramTree();
      store.newItem = null;
      addSuccessAlert(t('subjectTypeCreated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onNewKnowledge({ ...data }) {
    try {
      store.saving = true;
      render();
      await createKnowledgeRequest({
        ...data,
        program: store.program.id,
      });
      store.tree = await getProgramTree();
      store.newItem = null;
      addSuccessAlert(t('knowledgeCreated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
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
      addSuccessAlert(ts('subjectCreated'));
      return subject;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
      store.program.classes = isArray(store.program.classes) ? [...store.program.classes] : [];
      store.program = { ...store.program };
      store.saving = false;
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
    }
    return null;
  }

  async function onNewSubjectSave(data) {
    try {
      // eslint-disable-next-line no-param-reassign
      if (!data.credits) data.credits = 1;
      store.saving = true;
      render();
      const subject = await addNewSubject({
        name: data.subject,
        course: isArray(data.courses) ? null : data.courses,
        internalId: data.internalId,
        credits: data.credits,
        managers: data.managers,
      });
      if (subject) {
        // eslint-disable-next-line no-param-reassign
        data.subject = subject?.id;
        await addNewClass(data);
        store.tree = await getProgramTree();
        store.newItem = null;
        addSuccessAlert(ts('classCreated'));
        store.saving = false;
        render();
        return true;
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
      store.program.classes = [...store.program.classes];
      store.program = { ...store.program };
      store.saving = false;
      render();
    }
    return null;
  }

  async function addClassUsers(students, id) {
    try {
      store.saving = true;
      render();
      await addStudentIfNeed(students, id, 'class');
      store.tree = await getProgramTree();
      setAgainActiveTree();
      addSuccessAlert(messages.treeClass.studentsAddedSuccessfully);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  function removeUserFromClass(student, id) {
    return new Promise((resolve, reject) => {
      openDeleteConfirmationModal({
        onConfirm: async () => {
          try {
            await removeStudentFromClassRequest(id, student);
            store.tree = await getProgramTree();
            setAgainActiveTree();
            resolve();
          } catch (error) {
            addErrorAlert(getErrorMessage(error));
            reject();
          }
          render();
        },
        onCancel: () => {
          // console.log('on cancel');
          reject();
        },
      })();
    });
  }

  async function onProgramTreeTypeChange(event) {
    try {
      await updateProgramRequest({
        id: store.program.id,
        treeType: event,
      });
      store.tree = await getProgramTree();
      render();
      setTimeout(() => {
        treeProps.setOpenAll(true);
      }, 100);
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  let { scroll } = store;
  if (scroll > headerBase.height) scroll = headerBase.height;
  const correct = 48;
  const correctBottom = 24;

  let top = headerBase.height + correct - scroll;
  const minTop = headerBase.height - headerDescription.height + 24;
  if (top < minTop) {
    top = minTop;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        baseRef={headerBaseRef}
        descriptionRef={headerDescriptionRef}
        values={messages.header}
      />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid>
              {/* TREE ----------------------------------------- */}
              <Col span={5}>
                <Box ref={containerRef}>
                  <Box
                    style={{
                      width: `${container.width}px`,
                      position: 'fixed',
                      top: `${top}px`,
                      height: `calc(100vh - ${top + correctBottom}px)`,
                    }}
                  >
                    <Paper fullWidth fullHeight padding={5}>
                      <ContextContainer divided>
                        <Box>
                          <Grid grow>
                            <Col span={6}>
                              <SelectCenter
                                firstSelected
                                label={t('centerLabel')}
                                onChange={onSelectCenter}
                                value={store.centerId}
                              />
                            </Col>
                            <Col span={6}>
                              <SelectProgram
                                firstSelected
                                label={t('programLabel')}
                                onChange={onSelectProgram}
                                center={store.centerId}
                                value={store.programId}
                              />
                            </Col>
                          </Grid>
                          <Box
                            sx={(theme) => ({
                              marginBottom: -theme.spacing[3],
                              marginTop: theme.spacing[4],
                            })}
                          >
                            <Button
                              onClick={() => {
                                store.editingItem = null;
                                store.newItem = null;
                                store.duplicateItem = null;
                                store.showTreeType = true;
                                render();
                              }}
                              leftIcon={<PluginSettingsIcon />}
                              variant="link"
                            >
                              {t('configTreeView')}
                            </Button>
                          </Box>
                        </Box>
                        {store.tree ? (
                          <Box
                            sx={(theme) => ({
                              flex: 'none!important',
                              marginLeft: -theme.spacing[5],
                              marginRight: -theme.spacing[5],
                              paddingLeft: theme.spacing[5],
                              paddingRight: theme.spacing[5],
                            })}
                            style={{
                              height: `calc(100vh - ${top + correctBottom + 150}px)`,
                              overflowY: 'auto',
                            }}
                          >
                            <Tree
                              {...treeProps}
                              rootId={0}
                              selectedNode={store.editingItem ? store.editingItem.treeId : null}
                              allowDragParents={false}
                              allowMultipleOpen
                              onAdd={(a) => {
                                a.handler();
                              }}
                              onSelect={(a) => {
                                a.handler();
                              }}
                            />
                          </Box>
                        ) : null}
                      </ContextContainer>
                    </Paper>
                  </Box>
                </Box>
              </Col>
              {/* CONTENT ----------------------------------------- */}
              <Col span={7}>
                {store.showTreeType ? (
                  <Paper style={{ position: 'relative' }} fullWidth padding={5}>
                    <Box
                      sx={(theme) => ({
                        position: 'absolute',
                        right: theme.spacing[3],
                        top: theme.spacing[3],
                      })}
                    >
                      <ActionButton
                        icon={<RemoveIcon />}
                        onClick={() => {
                          store.showTreeType = null;
                          render();
                        }}
                      />
                    </Box>
                    <ProgramTreeType program={store.program} onChange={onProgramTreeTypeChange} />
                  </Paper>
                ) : (
                  <>
                    {store.editingItem ? (
                      <Paper style={{ position: 'relative' }} fullWidth padding={5}>
                        <Box
                          sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing[3],
                            top: theme.spacing[3],
                          })}
                        >
                          <ActionButton
                            icon={<RemoveIcon />}
                            onClick={() => {
                              store.editingItem = null;
                              render();
                            }}
                          />
                        </Box>
                        {store.editingItem.nodeType === 'program' ? (
                          <TreeProgramDetail
                            onSave={onSaveProgram}
                            program={store.editingItem.value}
                            center={store.centerId}
                            item={store.editingItem}
                            messages={messages.treeProgram}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'cycles' ? (
                          <TreeCycleDetail
                            onSave={onSaveCycle}
                            item={store.editingItem}
                            messages={messages.treeCycle}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'courses' ? (
                          <TreeCourseDetail
                            onSave={onSaveCourse}
                            course={store.editingItem.value}
                            center={store.centerId}
                            item={store.editingItem}
                            messages={messages.treeCourse}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'groups' ? (
                          <TreeGroupDetail
                            onSave={onSaveGroup}
                            program={store.program}
                            group={store.editingItem.value}
                            center={store.centerId}
                            item={store.editingItem}
                            messages={messages.treeGroup}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'subjectType' ? (
                          <TreeSubjectTypeDetail
                            onSave={onSaveSubjectType}
                            subjectType={store.editingItem.value}
                            center={store.centerId}
                            item={store.editingItem}
                            messages={messages.treeSubjectType}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'knowledges' ? (
                          <TreeKnowledgeDetail
                            onSave={onSaveKnowledge}
                            program={store.program}
                            center={store.centerId}
                            knowledge={store.editingItem.value}
                            item={store.editingItem}
                            messages={messages.treeKnowledge}
                            messagesAddUsers={messages.addUsers}
                            saving={store.saving}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.editingItem.nodeType === 'class' ? (
                          <TreeClassDetail
                            onNew={onNew}
                            onSaveSubject={onSaveSubject}
                            onSaveClass={onSaveClass}
                            selectClass={selectClass}
                            onRemoveClass={removeClass}
                            addClassUsers={addClassUsers}
                            removeUserFromClass={removeUserFromClass}
                            removeSubject={removeSubject}
                            removing={store.removing}
                            program={store.program}
                            center={store.centerId}
                            messagesAddUsers={messages.addUsers}
                            classe={store.editingItem.value}
                            item={store.editingItem}
                            classes={store.classesBySubject[store.editingItem.value.subject?.id]}
                            messages={messages.treeClass}
                            saving={store.saving}
                            teacherSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                      </Paper>
                    ) : null}
                    {store.newItem ? (
                      <Paper style={{ position: 'relative' }} fullWidth padding={5}>
                        <Box
                          sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing[3],
                            top: theme.spacing[3],
                          })}
                        >
                          <ActionButton
                            icon={<RemoveIcon />}
                            onClick={() => {
                              store.newItem = null;
                              render();
                            }}
                          />
                        </Box>
                        {store.newItem.nodeType === 'groups' ? (
                          <TreeGroupDetail
                            onSave={onNewGroup}
                            program={store.program}
                            item={store.newItem}
                            messages={messages.treeGroup}
                            saving={store.saving}
                            messagesAddUsers={messages.addUsers}
                            selectSubjectsNode={<SelectSubjectsByTable program={store.program} />}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.newItem.nodeType === 'subjectType' ? (
                          <TreeSubjectTypeDetail
                            onSave={onNewSubjectType}
                            item={store.newItem}
                            messagesAddUsers={messages.addUsers}
                            messages={messages.treeSubjectType}
                            saving={store.saving}
                            selectSubjectsNode={<SelectSubjectsByTable program={store.program} />}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.newItem.nodeType === 'knowledges' ? (
                          <TreeKnowledgeDetail
                            onSave={onNewKnowledge}
                            program={store.program}
                            item={store.newItem}
                            messagesAddUsers={messages.addUsers}
                            messages={messages.treeKnowledge}
                            saving={store.saving}
                            selectSubjectsNode={<SelectSubjectsByTable program={store.program} />}
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.newItem.nodeType === 'subject' ? (
                          <TreeNewSubjectDetail
                            onSave={onNewSubjectSave}
                            item={store.newItem}
                            program={store.program}
                            messagesAddUsers={messages.addUsers}
                            messages={{
                              subjects: messages.subjects,
                              tableLabels: messages.tableLabels,
                            }}
                            saving={store.saving}
                            selectUserAgent={
                              <SelectUserAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                            managersSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                        {store.newItem.nodeType === 'class' ? (
                          <TreeClassDetail
                            onNew={onNew}
                            onSaveSubject={onSaveSubject}
                            onSaveClass={onSaveClass}
                            onRemoveClass={removeClass}
                            selectClass={selectClass}
                            messagesAddUsers={messages.addUsers}
                            item={store.newItem}
                            program={store.program}
                            removeSubject={removeSubject}
                            removing={store.removing}
                            classe={store.newItem.value}
                            classes={store.classesBySubject[store.newItem.value.subject?.id]}
                            messages={messages.treeClass}
                            saving={store.saving}
                            createMode={true}
                            teacherSelect={
                              <SelectAgent
                                profiles={store.profiles.teacher}
                                centers={store.centerId}
                              />
                            }
                          />
                        ) : null}
                      </Paper>
                    ) : null}
                    {store.duplicateItem ? (
                      <Paper style={{ position: 'relative' }} fullWidth padding={5}>
                        <Box
                          sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing[3],
                            top: theme.spacing[3],
                          })}
                        >
                          <ActionButton
                            icon={<RemoveIcon />}
                            onClick={() => {
                              store.duplicateItem = null;
                              render();
                            }}
                          />
                        </Box>
                        {store.duplicateItem.nodeType === 'groups' ? (
                          <TreeGroupDetail
                            onSave={onDuplicateGroup}
                            group={store.duplicateItem.value}
                            item={store.duplicateItem}
                            program={store.program}
                            messages={messages.treeGroup}
                            saving={store.saving}
                            duplicateMode={true}
                            messagesAddUsers={messages.addUsers}
                            selectSubjectsNode={<SelectSubjectsByTable program={store.program} />}
                          />
                        ) : null}
                      </Paper>
                    ) : null}
                  </>
                )}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

function SelectAgent(props) {
  return <SelectUserAgent {...props} />;
}
