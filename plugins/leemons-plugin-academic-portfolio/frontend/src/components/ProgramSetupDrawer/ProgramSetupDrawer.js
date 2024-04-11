import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isBoolean, isEmpty, omit } from 'lodash';
import { BaseDrawer } from '@bubbles-ui/components';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import {
  useCreateProgram,
  useUpdateProgram,
  useUpdateProgramConfiguration,
} from '@academic-portfolio/hooks/mutations/useMutateProgram';
import AddProgramForm from './AddProgramForm';
import FormSetup from './AddFormSetup';
import UpdateProgramForm from './UpdateProgramForm';

const ProgramSetupDrawer = ({
  isOpen,
  setIsOpen,
  centerId,
  program,
  isEditing,
  setIsEditing,
  localizations,
}) => {
  const [activeComponent, setActiveComponent] = useState(0);
  const [setupData, setSetupData] = useState(null);
  const { mutate: createProgram, isLoading: isCreateProgramLoading } = useCreateProgram();
  const { mutate: updateProgram, isLoading: isUpdateProgramLoading } = useUpdateProgram();
  const { mutate: updateProgramConfiguration, isLoading: isUpdateProgramConfigurationLoading } =
    useUpdateProgramConfiguration();
  const scrollRef = useRef();

  // HANDLERS & FUNCTIONS ······································································||
  const handleOnCancel = useCallback(() => {
    setActiveComponent(0);
    setIsEditing(false);
    setIsOpen(false);
  }, [setActiveComponent, setIsEditing, setIsOpen]);

  const handleSetup = (setupObjectData) => {
    setActiveComponent((current) => current + 1);
    setSetupData({ ...setupObjectData });
  };

  const handleReferenceGroups = useCallback(
    (formData, _body) => {
      const body = cloneDeep(_body);

      if (setupData.referenceGroups && !isEmpty(formData.referenceGroups)) {
        const groups = formData.referenceGroups;
        if (!setupData.sequentialCourses && setupData.moreThanOneCourse) {
          body.referenceGroups = {
            ...omit(groups, ['groupsForCourse1']),
            groupsForAllCourses: groups.groupsForCourse1,
          };
        } else {
          body.referenceGroups = formData.referenceGroups;
        }
      }
      return body;
    },
    [setupData]
  );

  const handleCredits = (formData, _body, _program) => {
    const body = cloneDeep(_body);
    if (formData.credits || _program?.credits) {
      body.credits = formData.credits;
      body.hoursPerCredit = formData.hoursPerCredit;
      body.totalHours = parseInt(formData.credits) * parseInt(formData.hoursPerCredit);
    } else {
      body.credits = null;
      body.hoursPerCredit = null;
      body.totalHours = formData.totalHours || null;
    }
    return body;
  };

  const handleCourses = useCallback(
    (formData, _body) => {
      const body = cloneDeep(_body);
      const { courses, seatsPerCourse } = formData;
      const sameSeatsAllCourses = !!seatsPerCourse?.all;
      if (courses?.length) {
        body.courses = courses.map((course) => ({
          ...course,
          seats: sameSeatsAllCourses ? seatsPerCourse.all : seatsPerCourse?.[course.index],
        }));
        body.seatsForAllCourses = sameSeatsAllCourses ? seatsPerCourse.all : null;
      } else {
        // default course for programs with only one course
        body.courses = [{ index: 1, minCredits: null, maxCredits: null }];
        if (setupData?.referenceGroups) {
          body.courses[0].seats = seatsPerCourse.all;
          body.seatsForAllCourses = seatsPerCourse.all;
        }
      }

      return body;
    },
    [setupData]
  );

  const constructRequestBody = useCallback(
    ({ formData, isEditingConfig }) => {
      let body = {
        name: formData.name?.trimEnd(),
        abbreviation: formData.abbreviation.trimEnd(),
        color: formData.color,
        image: formData.image,
        numberOfSubstages: formData.substages?.length || 0,
        evaluationSystem: formData.evaluationSystem,
        hideStudentsToStudents: !!formData.hideStudentsFromEachOther,
        useAutoAssignment: !!formData.autoAssignment,
        moreThanOneAcademicYear: isBoolean(setupData.sequentialCourses)
          ? !setupData.sequentialCourses
          : false,
        maxNumberOfCourses: formData.courses?.length || 1,
        substages: formData.substages || [],
        coursesName: localizations?.labels?.course || 'Curso ',
      };
      body = handleCredits(formData, body);
      body = handleCourses(formData, body);
      body = handleReferenceGroups(formData, body);
      body.cycles = formData.cycles?.length
        ? formData.cycles.map(({ name, courses, index }) => ({ name, courses, index }))
        : [];

      if (!isEditingConfig) {
        body.centers = [centerId];
        body.haveKnowledge = setupData.knowledgeAreas;
        body.hasSubjectTypes = setupData.subjectTypes;
        body.useCustomSubjectIds = setupData.customSubjectIds;
        body.sequentialCourses = isBoolean(setupData.sequentialCourses)
          ? setupData.sequentialCourses
          : true;
        body.moreThanOneAcademicYear = isBoolean(setupData.sequentialCourses)
          ? !setupData.sequentialCourses
          : false;
      }

      return body;
    },
    [setupData, centerId, localizations?.labels?.course, handleCourses, handleReferenceGroups]
  );

  const handleOnAdd = useCallback(
    (formData) => {
      const body = constructRequestBody({ formData, isEditingConfig: false });
      createProgram(body, {
        onSuccess: () => {
          addSuccessAlert(localizations?.alerts.success.add);
          handleOnCancel();
        },
        onError: (e) => {
          console.error(e);
          addErrorAlert(localizations?.alerts.failure.add);
        },
      });
    },
    [createProgram, constructRequestBody, localizations?.alerts]
  );

  const handleOnSimpleEdit = (formData) => {
    let body = {
      ...omit(formData, 'autoAssignment'),
      id: program.id,
      useAutoAssignment: formData.autoAssignment,
    };
    body = handleCredits(formData, body, program);

    updateProgram(body, {
      onSuccess: () => {
        addSuccessAlert(localizations?.alerts.success.update);
        handleOnCancel();
      },
      onError: (e) => {
        console.error(e);
        addErrorAlert(localizations?.alerts.failure.update);
      },
    });
  };

  const handleOnEditConfiguration = useCallback(
    (formData) => {
      const getSubstagesToRemove = (substages) =>
        program.substages?.filter(
          (originalSubstage) => !substages.some((substage) => substage.id === originalSubstage.id)
        ) || [];

      const body = {
        ...constructRequestBody({ formData, isEditingConfig: true }),
        id: program.id,
      };
      body.substagesToRemove = getSubstagesToRemove(formData.substages);

      updateProgramConfiguration(body, {
        onSuccess: () => {
          addSuccessAlert(localizations?.alerts.success.update);
          handleOnCancel();
        },
        onError: (e) => {
          console.error(e);
          addErrorAlert(localizations?.alerts.failure.update);
        },
      });
    },
    [
      constructRequestBody,
      program?.id,
      updateProgramConfiguration,
      handleOnCancel,
      localizations?.alerts,
      program?.substages,
    ]
  );

  const creationFlowComponents = useMemo(
    () => [
      <FormSetup
        key="setup"
        scrollRef={scrollRef}
        onCancel={handleOnCancel}
        onSetup={handleSetup}
        localizations={localizations}
      />,
      <AddProgramForm
        key="add-form"
        scrollRef={scrollRef}
        onCancel={handleOnCancel}
        setupData={setupData}
        centerId={centerId}
        onSubmit={handleOnAdd}
        drawerIsLoading={isCreateProgramLoading || isUpdateProgramConfigurationLoading}
        localizations={localizations}
        programUnderEdit={isEditing ? program : null}
        onUpdate={handleOnEditConfiguration}
      />,
    ],
    [
      setupData,
      localizations,
      isEditing,
      program,
      isCreateProgramLoading,
      isUpdateProgramConfigurationLoading,
      centerId,
      handleOnAdd,
      handleOnEditConfiguration,
      handleOnCancel,
    ]
  );

  // EFFECTS ······································································||
  useEffect(() => {
    if (isEditing) {
      const setupObject = {
        moreThanOneCourse: program.courses?.length > 1,
        hasSubstages: program.substages?.length > 0,
        referenceGroups: program.groups?.length > 0,
        creditsSystem: !!program.credits,
        durationInHours: !program.credits && program.totalHours,
        sequentialCourses: program.sequentialCourses,
        hasCycles: program.cycles?.length > 0,
      };
      setSetupData(setupObject);
    }
  }, [isEditing, program]);

  return (
    <BaseDrawer opened={isOpen} close={false} size={728} empty>
      {!isEditing && creationFlowComponents[activeComponent]}
      {isEditing && !program?.subjects?.length && creationFlowComponents[1]}

      {isEditing && program?.subjects?.length > 0 && (
        <UpdateProgramForm
          program={program}
          onSubmit={handleOnSimpleEdit}
          drawerIsLoading={isUpdateProgramLoading}
          localizations={localizations}
          onCancel={handleOnCancel}
        />
      )}
    </BaseDrawer>
  );
};

ProgramSetupDrawer.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  centerId: PropTypes.string,
  program: PropTypes.object,
  setIsEditing: PropTypes.func,
  isEditing: PropTypes.bool,
  localizations: PropTypes.object,
};

export default ProgramSetupDrawer;
