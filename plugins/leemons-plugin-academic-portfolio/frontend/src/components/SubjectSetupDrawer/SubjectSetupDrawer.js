import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import {
  Drawer,
  Stack,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useCreateSubject } from '@academic-portfolio/hooks/mutations/useMutateSubject';

import { useProgramDetail } from '@academic-portfolio/hooks';
import { useCreateClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { getProgramSubjectsKey } from '@academic-portfolio/hooks/keys/programSubjects';
import SubjectForm from './SubjectForm';

const SubjectSetupDrawer = ({ isOpen, setIsOpen, programId, subject, isEditing, setIsEditing }) => {
  const { data: programDetail, isLoading: isProgramDetailLoading } = useProgramDetail(programId, {
    enabled: programId?.length > 0,
  });
  const { mutateAsync: createSubjectAsync, isLoading: isCreateSubjectLoading } = useCreateSubject();
  const { mutateAsync: createClassAsync, isLoading: isCreateClassLoading } = useCreateClass();
  const queryClient = useQueryClient();
  const scrollRef = useRef();

  const handleOnCancel = () => {
    if (isEditing) setIsEditing(false);
    setIsOpen(false);
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
    const subjectsBody = {
      program: programId,
      name,
      credits,
      internalId,
      image,
      icon,
      color,
      course: JSON.stringify(courseArray),
    };

    if (isEditing) {
      subjectsBody.id = subject.id;
    }

    try {
      const subjectResponse = await createSubjectAsync(subjectsBody);

      const classesToCreate = classrooms.map(
        ({ availableSeats, classroomId, referenceGroup, alias, id }) => {
          const classBody = {
            subject: subjectResponse.subject?.id,
            program: programId,
            course: courseArray,
            group: referenceGroup ? referenceGroup.split('::')[1] : null,
            subjectType,
            knowledge: knowledgeArea,
            seats: availableSeats,
            alias: referenceGroup ? null : alias, // Classes related to a reference group don't have alias
            classroomId: classroomId ?? null,
            image,
            color,
          };
          if (substage && substage !== 'all') classBody.substage = substage;
          if (id) classBody.id = id;
          return classBody;
        }
      );

      const classesCreationPromises = [];
      classesToCreate.forEach((classToCreate) => {
        classesCreationPromises.push(createClassAsync(classToCreate));
      });
      await Promise.all(classesCreationPromises);

      // invalidate the subject list query
      addSuccessAlert('Subject and classrooms created successfully');
      setIsOpen(false);
      if (isEditing) setIsEditing(false);
      const queryKey = getProgramSubjectsKey(programId);
      queryClient.invalidateQueries(queryKey);
    } catch (error) {
      addErrorAlert('Failed to create subject and classrooms 🌎');
    }
  };

  return (
    <>
      <LoadingOverlay visible={isProgramDetailLoading} />
      <Drawer opened={isOpen} close={false} size={728} empty>
        <TotalLayoutContainer
          clean
          scrollRef={scrollRef}
          Header={
            <Header
              localizations={{ title: 'Nueva Asignatura 🌎', close: 'Cerrar 🌎' }}
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
                  // drawerIsLoading={isCreateProgramLoading}
                />
              ) : (
                <SubjectForm
                  scrollRef={scrollRef}
                  onCancel={handleOnCancel}
                  onSubmit={handleOnSubmit}
                  program={programDetail}
                  // drawerIsLoading={isCreateProgramLoading}
                  subject={subject}
                  isEditing
                />
              )}
            </TotalLayoutStepContainer>
          </Stack>
        </TotalLayoutContainer>
      </Drawer>
    </>
  );
};

SubjectSetupDrawer.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  programId: PropTypes.string,
  subject: PropTypes.object,
  setIsEditing: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default SubjectSetupDrawer;
