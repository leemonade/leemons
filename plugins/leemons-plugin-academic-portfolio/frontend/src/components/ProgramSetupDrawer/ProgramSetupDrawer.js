import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BaseDrawer } from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { cloneDeep, isBoolean, isEmpty, omit } from 'lodash';
import PropTypes from 'prop-types';

import FormSetup from './AddFormSetup';
import AddProgramForm from './AddProgramForm';
import UpdateProgramForm from './UpdateProgramForm';

import getTranslationKeyPrefixes from '@academic-portfolio/helpers/getTranslationKeyPrefixes';
import {
  useCreateProgram,
  useUpdateProgram,
  useUpdateProgramConfiguration,
} from '@academic-portfolio/hooks/mutations/useMutateProgram';
import useSetProgramCustomTranslationKeys from '@academic-portfolio/hooks/mutations/useSetProgramCustomTranslationKeys';

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
  const [nomenclature, setNomenclature] = useState(null);
  const { mutate: createProgram, isLoading: isCreateProgramLoading } = useCreateProgram();
  const { mutate: updateProgram, isLoading: isUpdateProgramLoading } = useUpdateProgram();
  const { mutate: updateProgramConfiguration, isLoading: isUpdateProgramConfigurationLoading } =
    useUpdateProgramConfiguration();
  const { mutate: setProgramCustomTranslationKeys } = useSetProgramCustomTranslationKeys({
    successMessage:
      localizations?.programDrawer?.addProgramForm?.formLabels?.nomenclature?.success?.set,
  });
  const scrollRef = useRef();

  // HANDLERS & FUNCTIONS ······································································||
  const handleOnCancel = useCallback(() => {
    setActiveComponent(0);
    setNomenclature(null);
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

  const handleStaff = useCallback(
    (formData, _body) => {
      const cleanObject = Object.entries(formData.staff).reduce((acc, [key, value]) => {
        const valueHasChangedOnEdition = isEditing && program?.staff?.[key] !== value;
        const valueIsNotEmptyOnCreation = !isEditing && value?.length;

        if (valueHasChangedOnEdition || valueIsNotEmptyOnCreation) {
          acc[key] = value;
        }
        return acc;
      }, {});

      if (!isEmpty(cleanObject)) {
        const body = cloneDeep(_body);
        body.staff = cleanObject;
        return body;
      }

      return _body;
    },
    [isEditing, program?.staff]
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
      };
      body = handleCredits(formData, body);
      body = handleCourses(formData, body);
      body = handleReferenceGroups(formData, body);
      body = handleStaff(formData, body);
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
    [setupData, centerId, handleCourses, handleReferenceGroups, handleStaff]
  );

  const handleOnAdd = useCallback(
    (formData) => {
      const body = constructRequestBody({ formData, isEditingConfig: false });
      createProgram(body, {
        onSuccess: (data) => {
          addSuccessAlert(localizations?.alerts.success.add);
          if (!isEmpty(nomenclature)) {
            setProgramCustomTranslationKeys({
              programId: data.program.id,
              prefix: getTranslationKeyPrefixes().PROGRAM,
              localizations: nomenclature,
            });
          }
          handleOnCancel();
        },
        onError: (e) => {
          console.error(e);
          addErrorAlert(localizations?.alerts.failure.add);
        },
      });
    },
    [
      createProgram,
      constructRequestBody,
      localizations?.alerts,
      nomenclature,
      setProgramCustomTranslationKeys,
      handleOnCancel,
    ]
  );

  const handleOnSimpleEdit = useCallback(
    (formData) => {
      let body = {
        ...omit(formData, 'autoAssignment', 'nomenclature', 'staff'),
        id: program.id,
        useAutoAssignment: formData.autoAssignment,
      };
      body = handleCredits(formData, body, program);
      body = handleStaff(formData, body);

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
    },
    [updateProgram, handleCredits, handleStaff, localizations?.alerts, handleOnCancel, program]
  );

  const handleOnConfigurationEdit = useCallback(
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
        programBeingEdited={isEditing ? program : null}
        onUpdate={handleOnConfigurationEdit}
        setNomenclature={
          (nomenclature) => setNomenclature(cloneDeep(nomenclature)) // Ensures a re-render of the callback functions depending on nomenclature
        }
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
      handleOnConfigurationEdit,
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
          setNomenclature={(nomenclature) => setNomenclature(cloneDeep(nomenclature))}
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
