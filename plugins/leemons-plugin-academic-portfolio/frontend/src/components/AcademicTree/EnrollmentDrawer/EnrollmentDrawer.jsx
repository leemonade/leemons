import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BaseDrawer,
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  Button,
  RadioGroup,
  ContextContainer,
} from '@bubbles-ui/components';

import { addSuccessAlert, addErrorAlert } from '@layout/alert';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import FooterContainer from '@academic-portfolio/components/ProgramSetupDrawer/FooterContainer';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { useEnrollStudentsToClasses } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { getProfilesRequest } from '@academic-portfolio/request';
import StudentsSelectByUserData from './StudentsSelectByUserData';
import StudentsSelectByTags from './StudentsSelectByTags';

function distributeStudentsToClasses(classes, selectedStudents) {
  const cannotEnrollClasses = [];
  const studentUserAgents = selectedStudents.map(({ value }) => value);

  const subjectsClassesMap = {};
  const studentSubjectEnrollment = {}; // Tracks which subjects students are already enrolled in

  classes.forEach((cls) => {
    const subjectId = cls.subject?.id;
    if (!subjectsClassesMap[subjectId]) {
      subjectsClassesMap[subjectId] = {
        classes: [],
        totalSeats: 0,
        enrolledStudents: 0,
        attemptedEnrollments: 0,
      };
    }
    const availableSeats = cls.seats - cls.students.length;
    subjectsClassesMap[subjectId].classes.push({ ...cls, availableSeats });
    subjectsClassesMap[subjectId].totalSeats += availableSeats;

    cls.students.forEach((studentId) => {
      if (!studentSubjectEnrollment[studentId]) {
        studentSubjectEnrollment[studentId] = new Set();
      }
      studentSubjectEnrollment[studentId].add(subjectId);
    });
  });

  const studentsToEnrollByClass = new Map();

  // Attempt to enroll students in subjects, skipping those already enrolled in the subject
  studentUserAgents.forEach((studentValue) => {
    Object.keys(subjectsClassesMap).forEach((subjectId) => {
      if (
        studentSubjectEnrollment[studentValue] &&
        studentSubjectEnrollment[studentValue].has(subjectId)
      ) {
        // Skip this student for this subject since they're already enrolled
        return;
      }
      const subjectData = subjectsClassesMap[subjectId];
      subjectData.attemptedEnrollments += 1;
      if (subjectData.enrolledStudents < subjectData.totalSeats) {
        const classToEnroll = subjectData.classes.find((cls) => cls.availableSeats > 0);
        if (classToEnroll) {
          if (!studentsToEnrollByClass.has(classToEnroll.id)) {
            studentsToEnrollByClass.set(classToEnroll.id, []);
          }
          studentsToEnrollByClass.get(classToEnroll.id).push(studentValue);
          classToEnroll.availableSeats -= 1;
          subjectData.enrolledStudents += 1;
        }
      }
    });
  });

  Object.keys(subjectsClassesMap).forEach((subjectId) => {
    const subjectData = subjectsClassesMap[subjectId];
    if (subjectData.attemptedEnrollments > subjectData.totalSeats) {
      subjectData.classes.forEach((cls) => {
        cannotEnrollClasses.push(cls.id);
      });
    }
  });

  return { cannotEnrollClasses, studentsToEnrollByClass };
}

const EnrollmentDrawer = ({
  isOpen,
  closeDrawer,
  scrollRef,
  centerId,
  selectedNode,
  opensFromClasroom = null, // only for cases where it opens form subject view
}) => {
  const [t] = useTranslateLoader(prefixPN('tree_page.enrrollmentDrawer'));
  const [searchBy, setSearchBy] = useState('userData');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [previouslyEnrolledStudents, setPreviouslyEnrolledStudents] = useState([]);
  const { mutateAsync: addStudentsToClassesAsync, isLoading: isAddStudentsToClassesLoading } =
    useEnrollStudentsToClasses();

  const [studentProfile, setStudentProfile] = useState(null);

  // SETUP ············································································································|

  const extractSubjectIds = (nodes) =>
    nodes.reduce((acc, node) => {
      if (node.type === 'subject') {
        acc.push(node.id);
      } else if (node.children && (node.type === 'group' || node.type === 'knowledgeArea')) {
        acc.push(...extractSubjectIds(node.children));
      }
      return acc;
    }, []);

  const subjects = useMemo(() => {
    const higherLevelNodeTypes = ['group', 'knowledgeArea', 'course'];

    if (higherLevelNodeTypes.includes(selectedNode?.type)) {
      return extractSubjectIds(selectedNode?.children || []);
    }
    if (selectedNode?.type === 'subject') {
      return [selectedNode.id];
    }
    return [];
  }, [selectedNode]);

  const { data: allSubjectClasses, isLoading } = useSubjectClasses(subjects, {
    enabled: subjects?.length > 0 && isOpen,
  });

  const classes = useMemo(() => {
    if (!allSubjectClasses?.length) return [];

    // This is when the drawer is opened from the enrollment tab of a subject node, we can know directly what class we'll enroll students into. (reference groups or not)
    if (opensFromClasroom?.length > 0) {
      return allSubjectClasses?.filter((cls) => cls.id === opensFromClasroom);
    }

    if (selectedNode.type === 'group') {
      return allSubjectClasses?.filter((cls) => cls.groups?.id === selectedNode?.id);
    }

    // If it opens from a knowledgeArea or from a course with no groups we can return all classes
    return allSubjectClasses;
  }, [allSubjectClasses, selectedNode, opensFromClasroom]);

  const radioGroupData = useMemo(
    () => [
      { label: t('searchUsersByData'), value: 'userData' },
      { label: t('searchUsersByTag'), value: 'tags' },
    ],
    [t]
  );

  const localizations = useMemo(
    () => ({
      remove: t('remove'),
    }),
    [t]
  );

  // EFFECTS ·······························································································||

  useEffect(() => {
    const getStudentProfile = async () => {
      const response = await getProfilesRequest();
      setStudentProfile([response?.profiles?.student]);
    };

    getStudentProfile();
  }, [centerId, selectedNode]);

  useEffect(() => {
    // For simplicity, we filter already enrolled students from the UserAgentSelect only when enrolling from a subject node (when it opens from a classroom)
    // If this is not the case, removal of duplicated students is handled elsewhere
    if (isOpen && classes?.length && selectedNode?.type === 'subject') {
      const studentsAlreadyEnrolled = [];
      classes.forEach((cls) =>
        studentsAlreadyEnrolled.push(
          ...cls.students.map((studentUserAgent) => ({ value: studentUserAgent }))
        )
      );
      setPreviouslyEnrolledStudents(studentsAlreadyEnrolled);
    }
  }, [classes, isOpen, selectedNode]);

  // EARLY RETURN ·················································································||
  if (!isOpen) return null;

  // FUNCTIONS && HANDLERS ·················································································||
  const handleOnCancel = () => {
    setSelectedStudents([]);
    setPreviouslyEnrolledStudents([]);
    closeDrawer();
  };

  const getStudentsToEnrollByClass = () => {
    const cannotEnrollClasses = [];
    const studentsToEnrollByClass = new Map();

    if (selectedNode?.type === 'subject' && opensFromClasroom) {
      const [_class] = classes;
      const availableSeats = _class.seats - _class.students.length;
      if (selectedStudents.length > availableSeats) {
        cannotEnrollClasses.push(_class);
      }
      studentsToEnrollByClass.set(
        _class.id,
        selectedStudents?.map((st) => st.value)
      );
      return { studentsToEnrollByClass, cannotEnrollClasses };
    }

    // Handle multi-class enrollment by group, ignore duplications but abort when classes are full and there are no dups
    if (selectedNode?.type === 'group') {
      classes.forEach((cls) => {
        const studentsToEnroll = selectedStudents
          ?.map((st) => st.value)
          ?.filter((studentUserAgent) => !cls.students.includes(studentUserAgent));
        const availableSeats = cls.seats - cls.students.length;

        if (studentsToEnroll.length && studentsToEnroll.length <= availableSeats) {
          studentsToEnrollByClass.set(cls.id, studentsToEnroll);
        } else if (studentsToEnroll.length > availableSeats) {
          cannotEnrollClasses.push(cls);
        }
      });
      return { studentsToEnrollByClass, cannotEnrollClasses };
    }

    // Handle multi-class enrollment when there are no groups and multiple classrooms by subject are possible at the same time
    if (selectedNode?.type === 'knowledgeArea' || selectedNode?.type === 'course') {
      return distributeStudentsToClasses(classes, selectedStudents);
    }

    // Not made to handle any other cases
    return { cannotEnrollClasses: classes };
  };

  const handleStudentEnrollment = async () => {
    const { cannotEnrollClasses, studentsToEnrollByClass } = getStudentsToEnrollByClass();

    if (cannotEnrollClasses?.length) {
      addErrorAlert(t('enrollmentSeatsError'));
    } else {
      const enrollmentRequests = [];
      const classesWithTheSameStudents = new Map();
      studentsToEnrollByClass.forEach((students, classId) => {
        const key = students.join(',');
        if (classesWithTheSameStudents.has(key)) {
          const existing = classesWithTheSameStudents.get(key);
          existing.push(classId);
          classesWithTheSameStudents.set(key, existing);
        } else {
          classesWithTheSameStudents.set(key, [classId]);
        }
      });

      classesWithTheSameStudents.forEach((classIds, studentsKey) => {
        const students = studentsKey.split(',');
        if (classIds.length === 1) {
          enrollmentRequests.push({ class: classIds[0], students });
        } else {
          enrollmentRequests.push({ class: classIds, students });
        }
      });

      try {
        enrollmentRequests.forEach(async (requestBody) => {
          await addStudentsToClassesAsync(requestBody);
        });
        handleOnCancel();
        addSuccessAlert(t('enrollmentSuccess'));
      } catch (error) {
        addErrorAlert(t('enrollmentError'));
        console.error(error);
      }
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
              title: t('enrollStudents'),
            }}
            onClose={handleOnCancel}
          />
        }
        Footer={
          <FooterContainer scrollRef={scrollRef}>
            <Stack justifyContent={'space-between'} fullWidth>
              <Button variant="outline" type="button" onClick={handleOnCancel}>
                {t('cancel')}
              </Button>
              <Button
                onClick={handleStudentEnrollment}
                type="button"
                loading={isLoading}
                disabled={!selectedStudents?.length || isAddStudentsToClassesLoading}
              >
                {t('enrollStudents')}
              </Button>
            </Stack>
          </FooterContainer>
        }
      >
        <Stack
          ref={scrollRef}
          sx={{ padding: 24, overflowY: 'auto', overflowX: 'hidden', marginBottom: 50 }}
        >
          <TotalLayoutStepContainer clean>
            <RadioGroup
              data={radioGroupData}
              value={searchBy}
              onChange={(value) => {
                setSearchBy(value);
                setSelectedStudents([]);
              }}
            />
            <ContextContainer>
              {searchBy === 'userData' ? (
                <StudentsSelectByUserData
                  studentProfile={studentProfile}
                  centerId={centerId}
                  setSelectedStudents={setSelectedStudents}
                  selectedStudents={selectedStudents}
                  previouslyEnrolledStudents={previouslyEnrolledStudents}
                  localizations={localizations}
                />
              ) : (
                <StudentsSelectByTags
                  studentProfile={studentProfile}
                  centerId={centerId}
                  setSelectedStudents={setSelectedStudents}
                  selectedStudents={selectedStudents}
                  previouslyEnrolledStudents={previouslyEnrolledStudents}
                  localizations={{ search: t('search') }}
                />
              )}
            </ContextContainer>
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </BaseDrawer>
  );
};

EnrollmentDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
  closeDrawer: PropTypes.func.isRequired,
  centerId: PropTypes.string,
  opensFromClasroom: PropTypes.string, // Classroom id where it is opened from
  selectedNode: PropTypes.object,
};
export default EnrollmentDrawer;

/*

*/
