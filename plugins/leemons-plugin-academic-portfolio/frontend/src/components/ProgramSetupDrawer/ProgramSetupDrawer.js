import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isBoolean, isEmpty, omit } from 'lodash';
import {
  Drawer,
  Stack,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import {
  useCreateProgram,
  useUpdateProgram,
  useUpdateProgramConfiguration,
} from '@academic-portfolio/hooks/mutations/useMutateProgram';
import LoadingFormState from './LoadingFormState';
import AddProgramForm from './AddProgramForm';
import FormSetup from './AddFormSetup';
import UpdateProgramForm from './UpdateProgramForm';

/* Form setup data:
 {
    "moreThanOneCourse": true,
    "hasSubstages": true,
    "knowledgeAreas": true,
    "subjectTypes": true,
    "customSubjectIds": true,
    "referenceGroups": true,
    "creditsSystem": true,
    "durationInHours": false,
    "sequentialCourses": true,
    "hasCycles": true
}
 */

/* Data from the add form

    {
    "name": "Full Program",
    "abbreviation": "FULLPRO",
    "color": "#bf4040",
    "image": "lrn:local:leebrary:local:65e9b39a09f1d613445b5cfa:Files:65f00f7f92908155befd55a0",
    "evaluationSystem": "lrn:local:grades:local:65e9b39a09f1d613445b5cfa:Grades:65e9b3a53ea519c96c8237b6",
    "courses": [
        {
            "index": 1,
            "minCredits": 20,
            "maxCredits": 20
            "seatsForAllCourseClasses": 12,
        },
        {
            "index": 2,
            "minCredits": 20,
            "maxCredits": 20,
             "seatsForAllCourseClasses": 12,
        },
        {
            "minCredits": 20,
            "maxCredits": 20,
            "seatsForAllCourseClasses": 12,
            "index": 3
        }
    ],
    "referenceGroups": {
        "nameFormat": "alphabetical",
        "digits": null,
        "customNameFormat": null,
        "prefix": null,
        "groupsForCourse1": 3,
        "groupsForCourse2": 2,
        "groupsForCourse3": 1,
    },
    "hideStudentsFromEachOther": true,
    "autoAsignment": true,
    "hoursPerCredit": 2,
    "credits": 60,
    "susbstages": [
        {
            "name": "Stage 1",
            "abbreviation": "S2"
        },
        {
            "name": "Stage 2",
            "abbreviation": "S2"
        }
    ],
    "cycles": [
        {
            "name": "Ciclo inicial",
            "courses": [
                1,
                2
            ]
        },
        {
            "name": "Ciclo final",
            "courses": [
                3
            ]
        }
    ]
}
    */

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
  const { mutate: updateProgramConfiguration } = useUpdateProgramConfiguration();

  const scrollRef = useRef();

  // HANDLERS & FUNCTIONS ······································································||
  const handleOnCancel = () => {
    setActiveComponent(0);
    if (isEditing) setIsEditing(false);
    setIsOpen(false);
  };

  const handleSetup = (setupObjectData) => {
    setActiveComponent((current) => current + 2);
    setSetupData({ ...setupObjectData });
  };

  const handleReferenceGroups = (formData, _body) => {
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
  };

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

  const handleCourses = (formData, _body) => {
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
  };

  const constructRequestBody = ({ formData, isEditingConfig }) => {
    let body = {
      name: formData.name,
      abbreviation: formData.abbreviation,
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
      coursesName: 'Curso 🌎', //! TODO - library to get the course name??
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
  };

  const handleOnAdd = (formData) => {
    const body = constructRequestBody({ formData, isEditingConfig: false });
    console.log('body', body);

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
  };

  const handleOnSimpleEdit = (formData) => {
    let body = {
      ...formData,
      id: program.id,
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

  const getSubstagesToRemove = (substages) =>
    program.substages?.filter(
      (originalSubstage) => !substages.some((substage) => substage.id === originalSubstage.id)
    ) || [];

  const handleOnEditConfiguration = (formData) => {
    let body = {
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
  };

  console.log('program', program);

  const creationFlowComponents = useMemo(
    () => [
      <FormSetup
        key="setup"
        scrollRef={scrollRef}
        onCancel={handleOnCancel}
        onSetup={handleSetup}
        localizations={localizations}
      />,
      <LoadingFormState key="load-form" localizations={localizations} />,
      <AddProgramForm
        key="add-form"
        scrollRef={scrollRef}
        onCancel={handleOnCancel}
        setupData={setupData}
        centerId={centerId}
        onSubmit={handleOnAdd}
        drawerIsLoading={isCreateProgramLoading}
        localizations={localizations}
        programUnderEdit={isEditing ? program : null}
        onUpdate={handleOnEditConfiguration}
      />,
    ],
    [setupData, localizations, isEditing, program]
  );

  // EFFECTS ······································································||
  useEffect(() => {
    if (isEditing && !program?.students?.length) {
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
    <Drawer opened={isOpen} close={false} size={728} empty>
      <TotalLayoutContainer
        clean
        scrollRef={scrollRef}
        Header={
          <Header
            localizations={{
              title: localizations?.programDrawer.title,
              close: localizations?.labels.cancel,
            }}
            onClose={handleOnCancel}
          />
        }
      >
        <Stack ref={scrollRef} sx={{ padding: 24, overflowY: 'auto', overflowX: 'hidden' }}>
          <TotalLayoutStepContainer clean>
            {!isEditing && creationFlowComponents[activeComponent]}
            {isEditing &&
              !program?.subjects?.length &&
              creationFlowComponents[creationFlowComponents.length - 1]}

            {isEditing && program?.subjects?.length > 0 && (
              <UpdateProgramForm
                program={program}
                onSubmit={handleOnSimpleEdit}
                drawerIsLoading={isUpdateProgramLoading}
              />
            )}
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </Drawer>
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
