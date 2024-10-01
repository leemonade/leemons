import React, { useRef } from 'react';

import {
  BaseDrawer,
  Stack,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import { useQueryClient } from '@tanstack/react-query';
import { cloneDeep, isArray } from 'lodash';
import PropTypes from 'prop-types';

import SubjectForm from './SubjectForm';

import { useProgramDetail } from '@academic-portfolio/hooks';
import { getProgramSubjectsKey } from '@academic-portfolio/hooks/keys/programSubjects';
import {
  useCreateClass,
  useDeleteClass,
  useUpdateClass,
} from '@academic-portfolio/hooks/mutations/useMutateClass';
import { createSubjectRequest, updateSubjectRequest } from '@academic-portfolio/request';

const INTERNAL_ID_IN_USE = 'INTERNAL_ID_IN_USE';

const SubjectSetupDrawer = ({
  isOpen,
  setIsOpen,
  programId,
  subject,
  isEditing,
  setIsEditing,
  localizations,
  allSubjectIds, // temporary for us to be able to reset the details query when updating a subject... for all subjects, shouldn't be like that. TODO: Update hook
}) => {
  const { data: programDetail } = useProgramDetail(programId, {
    enabled: programId?.length > 0,
  });

  const { mutateAsync: createClassAsync, isLoading: isCreateClassLoading } = useCreateClass();
  const { mutateAsync: updateClassAsync, isLoading: isUpdateClassLoading } = useUpdateClass();
  const { mutateAsync: deleteClassAsync } = useDeleteClass();

  const queryClient = useQueryClient();
  const scrollRef = useRef();

  const handleOnCancel = () => {
    if (isEditing) setIsEditing(false);
    setIsOpen(false);
  };

  const getClassChanges = (classrooms, courses) => {
    const classesToUpdate = [];
    const classesToCreate = [];
    const classesToRemove =
      subject.classes?.filter(
        (originalClass) => !classrooms.some((classroom) => classroom.id === originalClass.id)
      ) || [];

    classrooms.forEach((classroom) => {
      const originalClass = subject.classes?.find((c) => c.id === classroom.id);

      if (originalClass) {
        const hasChanges =
          ['seats', 'classroomId', 'alias', 'id'].some(
            (field) => classroom[field] !== originalClass[field]
          ) || classroom.referenceGroup?.split('::')[1] !== originalClass.groups?.id;

        let originalCourses = subject.classes?.find((c) => c.id === classroom.id)?.courses;
        if (!isArray(originalCourses)) originalCourses = [originalCourses];
        originalCourses = originalCourses.map((course) => course.id);
        const coursesHaveChanged =
          JSON.stringify(originalCourses.sort()) !== JSON.stringify(courses.sort());

        if (hasChanges || coursesHaveChanged) {
          const updateClassroom = { ...classroom };
          if (coursesHaveChanged) updateClassroom.course = courses;
          classesToUpdate.push(updateClassroom);
        }
      } else {
        classesToCreate.push(classroom);
      }
    });

    return { classesToUpdate, classesToCreate, classesToRemove };
  };

  const getUpdateSubjectBody = ({
    subjectsBody,
    _subject,
    knowledgeArea,
    subjectType,
    substage,
  }) => {
    const body = cloneDeep(subjectsBody);

    body.id = subject.id;
    delete body.program;
    if (_subject.knowledgeArea?.id !== knowledgeArea) body.knowledgeArea = knowledgeArea;
    if (_subject.subjectType?.id !== subjectType) body.subjectType = subjectType;

    // Currently all subject classes use only and relate to a single substage
    const currentSubstage =
      _subject.classes.length > 0 && _subject.classes[0].substages?.length > 0
        ? _subject.classes[0].substages[0].id
        : null;
    if (currentSubstage !== substage) {
      body.substage = substage;
    }
    return body;
  };

  const handleClassesUpdate = async (_classesToUpdate) => {
    const classesToUpdate = _classesToUpdate.map(
      ({ seats, classroomId, referenceGroup, alias, id, substage, course }) => {
        const classBody = {
          id,
          group: referenceGroup ? referenceGroup.split('::')[1] : null,
          seats,
          alias: referenceGroup ? null : alias,
          classroomId: classroomId ?? null,
          course,
        };
        if (substage) classBody.substage = substage;
        return classBody;
      }
    );
    const classesUpdatePromises = [];
    classesToUpdate.forEach((classToUpdate) => {
      classesUpdatePromises.push(updateClassAsync(classToUpdate));
    });

    await Promise.all(classesUpdatePromises);
  };

  const handleClassesDeletion = async (classesToDelete) => {
    // This is a hard delete
    const classesDeletionPromises = [];
    classesToDelete.forEach((classToDelete) => {
      classesDeletionPromises.push(deleteClassAsync(classToDelete?.id));
    });

    await Promise.all(classesDeletionPromises);
  };

  const handleClassesCreation = async ({
    classrooms,
    courses,
    subjectType,
    knowledgeArea,
    substage,
    subjectImage,
    subjectId,
    _programId,
    subjectColor,
  }) => {
    const commonBody = {
      subject: subjectId,
      program: _programId,
      course: courses,
      subjectType: subjectType || null,
      knowledgeArea,
      image: subjectImage,
      color: subjectColor,
    };
    if (substage && substage !== 'all') commonBody.substage = substage;

    const getClassSeats = () => {
      if (programDetail?.seatsForAllCourses) {
        // When multiple courses are passed, it means the program has non-sequential courses.
        // Classes that use reference groups in programs of this nature use the same number of seats regardless of the course.
        // This information can be found in seatsForAllCourses - The course metadata will also contain the number of seats.
        return programDetail.seatsForAllCourses;
      }
      return programDetail.courses.find((c) => c.id === courses[0])?.metadata?.seats;
    };

    const finalBodyArray = classrooms.map(
      ({ classroomId, referenceGroup, alias, seats, classWithoutGroupId }) => ({
        ...commonBody,
        group: referenceGroup ? referenceGroup.split('::')[1] : null,
        alias: referenceGroup || !alias?.length ? null : alias,
        seats: referenceGroup ? getClassSeats() : seats,
        classroomId: classroomId || null,
        classWithoutGroupId: referenceGroup ? null : classWithoutGroupId,
      })
    );

    const classesCreationPromises = [];
    finalBodyArray.forEach((classToCreate) => {
      classesCreationPromises.push(createClassAsync(classToCreate));
    });

    await Promise.all(classesCreationPromises);
  };

  const handleOnSubmit = async (formData) => {
    const {
      name,
      image,
      icon,
      color,
      credits,
      internalId,
      courses,
      substage,
      classrooms,
      subjectType,
      knowledgeArea,
    } = formData;
    const courseArray = isArray(courses) ? courses : [courses];
    let subjectsBody = {
      program: programId,
      name: name?.trimEnd(),
      credits,
      internalId: internalId?.trimEnd(),
      image,
      icon,
      color,
      course: JSON.stringify(courseArray),
    };

    if (isEditing) {
      subjectsBody = getUpdateSubjectBody({
        subjectsBody,
        _subject: subject,
        knowledgeArea,
        subjectType,
        substage,
      });
    }
    const classesChanges = isEditing ? getClassChanges(classrooms, courseArray) : {};

    try {
      const subjectRequest = isEditing ? updateSubjectRequest : createSubjectRequest;
      const subjectResponse = await subjectRequest(subjectsBody);

      if (isEditing && classesChanges?.classesToRemove?.length) {
        await handleClassesDeletion(classesChanges.classesToRemove);
      }
      if (isEditing && classesChanges?.classesToUpdate?.length) {
        await handleClassesUpdate(classesChanges.classesToUpdate);
      }

      const classesToCreate = isEditing ? classesChanges.classesToCreate : classrooms;

      if (classesToCreate?.length && subjectResponse?.subject?.id) {
        await handleClassesCreation({
          classrooms: classesToCreate,
          courses: courseArray,
          subjectType,
          knowledgeArea,
          substage,
          subjectImage: image,
          subjectColor: color,
          subjectId: subjectResponse.subject.id,
          _programId: programId,
        });
      }

      addSuccessAlert(
        !isEditing ? localizations?.alerts?.success?.add : localizations?.alerts?.success?.update
      );
      setIsOpen(false);

      if (isEditing) {
        setIsEditing(false);
        queryClient.invalidateQueries(['subjectDetail', { subject: allSubjectIds }]);
      }
      const programSubjectsQueryKey = getProgramSubjectsKey(programId);
      queryClient.invalidateQueries(programSubjectsQueryKey);
    } catch (error) {
      let errorToAppend = '';

      if (error?.code === INTERNAL_ID_IN_USE) {
        errorToAppend = `: ${localizations?.alerts.failure.internalIdInUse}`;
      }
      addErrorAlert(
        !isEditing
          ? `${localizations?.alerts.failure.add}${errorToAppend}`
          : `${localizations?.alerts.failure.update}${errorToAppend}`
      );
    }
  };

  return (
    <BaseDrawer opened={isOpen} close={false} size={728} empty>
      <TotalLayoutContainer
        clean
        scrollRef={scrollRef}
        Header={
          <Header
            localizations={{
              title: isEditing ? localizations?.drawer?.updateTitle : localizations?.drawer?.title,
              close: localizations?.drawer?.cancel,
            }}
            onClose={handleOnCancel}
          />
        }
      >
        <Stack ref={scrollRef} sx={{ padding: 24, overflowY: 'auto', overflowX: 'hidden' }}>
          <TotalLayoutStepContainer clean>
            {!isEditing ? (
              <SubjectForm
                scrollRef={scrollRef}
                onCancel={handleOnCancel}
                onSubmit={handleOnSubmit}
                program={programDetail}
                drawerIsLoading={isCreateClassLoading}
                localizations={localizations}
              />
            ) : (
              <SubjectForm
                scrollRef={scrollRef}
                onCancel={handleOnCancel}
                onSubmit={handleOnSubmit}
                program={programDetail}
                drawerIsLoading={isUpdateClassLoading}
                subject={subject}
                isEditing
                localizations={localizations}
              />
            )}
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </BaseDrawer>
  );
};

SubjectSetupDrawer.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  programId: PropTypes.string,
  subject: PropTypes.object,
  setIsEditing: PropTypes.func,
  isEditing: PropTypes.bool,
  allSubjectIds: PropTypes.array,
  localizations: PropTypes.object,
};

export default SubjectSetupDrawer;
