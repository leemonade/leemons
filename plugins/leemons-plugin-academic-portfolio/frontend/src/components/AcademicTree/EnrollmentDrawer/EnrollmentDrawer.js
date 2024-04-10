import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  Button,
  RadioGroup,
} from '@bubbles-ui/components';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import FooterContainer from '@academic-portfolio/components/ProgramSetupDrawer/FooterContainer';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { useEnrollStudentsToClasses } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { getProfilesRequest } from '@academic-portfolio/request';
import StudentsSelectByUserData from './StudentsSelectByUserData';
import StudentsSelectByTags from './StudentsSelectByTags';

function distributeStudentsToClasses(classes, selectedStudents) {
  const cannotEnrollClasses = [];
  const studentUserAgents = selectedStudents.map(({ value }) => value);

  const knowledgeAreaClassesMap = new Map();
  classes.forEach((cls) => {
    const knowledgeAreaId = cls.knowledge?.id;
    if (!knowledgeAreaClassesMap.has(knowledgeAreaId)) {
      knowledgeAreaClassesMap.set(knowledgeAreaId, { classes: [], totalSeats: 0 });
    }
    knowledgeAreaClassesMap
      .get(knowledgeAreaId)
      .classes.push({ ...cls, availableSeats: cls.seats - cls.students.length });
  });

  // Adjust total seats by checking possible already enrolled students within each knowledge area
  knowledgeAreaClassesMap.forEach((knowledgeAreaData) => {
    let adjustedTotalSeats = 0;
    knowledgeAreaData.classes.forEach((cls) => {
      // Exclude already enrolled students from the total available seats calculation
      const nonEnrolledSelectedStudents = studentUserAgents?.filter(
        (value) => !cls.students.includes(value)
      );
      adjustedTotalSeats += Math.max(0, cls.availableSeats - nonEnrolledSelectedStudents.length);
    });
    knowledgeAreaData.totalSeats = adjustedTotalSeats;
  });

  // Distribute students to classes within each knowledge area
  const studentsToEnrollByClass = new Map();
  studentUserAgents.forEach((studentValue) => {
    knowledgeAreaClassesMap.forEach((knowledgeAreaData) => {
      if (!knowledgeAreaData.classes.some((cls) => cls.students.includes(studentValue))) {
        // Check if not already enrolled
        const classToEnroll = knowledgeAreaData.classes.find((cls) => cls.availableSeats > 0);
        if (classToEnroll) {
          if (!studentsToEnrollByClass.has(classToEnroll.id)) {
            studentsToEnrollByClass.set(classToEnroll.id, []);
          }
          studentsToEnrollByClass.get(classToEnroll.id).push(studentValue);
          classToEnroll.availableSeats -= 1; // Decrement available seat
          knowledgeAreaData.totalSeats -= 1; // Adjust total seats for the knowledge area
        }
      }
      // If no seats are available after adjustment, add to cannotEnrollClasses
      if (knowledgeAreaData.totalSeats <= 0) {
        knowledgeAreaData.classes.forEach((cls) => {
          if (!cannotEnrollClasses.includes(cls.id)) {
            cannotEnrollClasses.push(cls.id);
          }
        });
      }
    });
  });

  return { cannotEnrollClasses, studentsToEnrollByClass };
}

const EnrollmentDrawer = ({
  isOpen,
  closeDrawer,
  scrollRef,
  selectedNode,
  centerId,
  opensFromClasroom = null,
}) => {
  const [searchBy, setSearchBy] = useState('userData');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [previouslyEnrolledStudents, setPreviouslyEnrolledStudents] = useState([]);
  const { mutateAsync: addStudentsToClassesAsync, isLoading: isAddStudentsToClassesLoading } =
    useEnrollStudentsToClasses();

  const [studentProfile, setStudentProfile] = useState(null);

  // SETUP ············································································································|
  useEffect(() => {
    const getStudentProfile = async () => {
      const response = await getProfilesRequest();
      setStudentProfile([response?.profiles?.student]);
    };

    getStudentProfile();
  }, [centerId, selectedNode]);

  const subjects = useMemo(() => {
    if (selectedNode?.type === 'group' || selectedNode?.type === 'knowledgeArea') {
      return selectedNode?.children
        ?.filter((child) => child.type === 'subject') // TODO This is not really needed. All children of these type of nodes are subjects.
        ?.map((subject) => subject.id);
    }
    if (selectedNode?.type === 'subject') {
      return [selectedNode.itemId];
    }
    return [];
  }, [selectedNode]);

  const { data: allSubjectClasses, isLoading } = useSubjectClasses(subjects, {
    enabled: subjects?.length > 0 && isOpen,
  });

  const classes = useMemo(() => {
    if (allSubjectClasses?.length && opensFromClasroom?.length > 0) {
      // This is when the drawer is opened from the enrollment tab of a subject node, we can know directly what class we'll enrolle students into. (reference groups or not)
      return allSubjectClasses?.filter((cls) => cls.id === opensFromClasroom);
    }
    if (allSubjectClasses?.length && selectedNode?.parent?.type === 'knowledgeArea') {
      // Cases where no groups of reference are being used
      // TODO But a subject can only be asociated to one single knowledge area... probably this is not needed.
      return allSubjectClasses?.filter((cls) => cls.knowledges?.id === selectedNode.parent.id);
    }
    return allSubjectClasses;
  }, [allSubjectClasses, selectedNode, opensFromClasroom]);

  const radioGroupData = useMemo(
    () => [
      { label: 'Buscar por datos del ususario 🔫', value: 'userData' },
      { label: 'Buscar por etiquetas 🔫', value: 'tags' },
    ],
    [] // This should depend on the labels/localizatoins
  );

  // EFFECTS ·······························································································||

  useEffect(() => {
    // For simplicity, we filter already enrolled students from the UserAgentSelect only when enrolling from a subject node (when it opens from a classroom)
    // If this is not the case, removal of duplicated students is handled elsewhere
    if (classes?.length && selectedNode?.type === 'subject') {
      const studentsAlreadyEnrolled = [];
      classes.forEach((cls) =>
        studentsAlreadyEnrolled.push(
          ...cls.students.map((studentUserAgent) => ({ value: studentUserAgent }))
        )
      );
      setPreviouslyEnrolledStudents(studentsAlreadyEnrolled);
    }
  }, [classes, selectedNode]);

  // FUNCTIONS && HANDLERS ·················································································||
  const handleOnCancel = () => {
    setSelectedStudents([]);
    closeDrawer();
  };

  console.log('classes', classes);

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

    // Handle multi-class enrollment by group
    if (selectedNode?.type === 'group') {
      classes.forEach((cls) => {
        const studentsToEnroll = selectedStudents
          ?.map((st) => st.value)
          ?.filter((studentUserAgent) => !cls.students.includes(studentUserAgent));
        const availableSeats = cls.seats - cls.students.length;
        if (studentsToEnroll.length > availableSeats) {
          cannotEnrollClasses.push(cls);
        }
        studentsToEnrollByClass.set(cls.id, studentsToEnroll);
      });
      return { studentsToEnrollByClass, cannotEnrollClasses };
    }

    // Handle multi-class enrollment by knowledge area
    if (selectedNode?.type === 'knowledgeArea') {
      return distributeStudentsToClasses(classes, selectedStudents);
    }

    // Not made to handle anything else
    return { cannotEnrollClasses: classes };
  };

  const handleStudentEnrollment = async () => {
    const { cannotEnrollClasses, studentsToEnrollByClass } = getStudentsToEnrollByClass();

    if (cannotEnrollClasses?.length) {
      console.log('show error');
      // show failure toast
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
        // set state to show success toast in whatever view we were at
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Drawer opened={isOpen} close={false} size={728} empty>
      <TotalLayoutContainer
        clean
        scrollRef={scrollRef}
        Header={
          <Header
            localizations={{
              title: 'Matriculación Estudiantes 🔫',
            }}
            onClose={handleOnCancel}
          />
        }
        Footer={
          <FooterContainer scrollRef={scrollRef}>
            <Stack justifyContent={'space-between'} fullWidth>
              <Button variant="outline" type="button" onClick={handleOnCancel}>
                {'Cancelar 🔫'}
              </Button>
              <Button
                onClick={handleStudentEnrollment}
                type="button"
                loading={isLoading}
                disabled={!selectedStudents?.length || isAddStudentsToClassesLoading}
              >
                {' Matricular estudiante 🔫'}
              </Button>
            </Stack>
          </FooterContainer>
        }
      >
        <Stack ref={scrollRef} sx={{ padding: 24, overflowY: 'auto', overflowX: 'hidden' }}>
          <TotalLayoutStepContainer clean>
            <RadioGroup data={radioGroupData} value={searchBy} onChange={(v) => setSearchBy(v)} />
            {searchBy === 'userData' ? (
              <StudentsSelectByUserData
                studentProfile={studentProfile}
                centerId={centerId}
                setSelectedStudents={setSelectedStudents}
                selectedStudents={selectedStudents}
                previouslyEnrolledStudents={previouslyEnrolledStudents}
              />
            ) : (
              <StudentsSelectByTags
                studentProfile={studentProfile}
                centerId={centerId}
                setSelectedStudents={setSelectedStudents}
                selectedStudents={selectedStudents}
                previouslyEnrolledStudents={previouslyEnrolledStudents}
              />
            )}
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </Drawer>
  );
};

EnrollmentDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedNode: PropTypes.obj,
  scrollRef: PropTypes.any,
  closeDrawer: PropTypes.func.isRequired,
  centerId: PropTypes.string,
  opensFromClasroom: PropTypes.string, // Classroom id where it is opened from
};
export default EnrollmentDrawer;

/*

*/
