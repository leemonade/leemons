import { forEach, isEmpty } from 'lodash';

export function getIfCurriculumSubjectsHaveValues(subjects) {
  let assessmentCriteria = false;
  let content = false;
  let objectives = false;
  forEach(subjects, (subject) => {
    if (subject.curriculum) {
      if (!isEmpty(subject.curriculum.assessmentCriteria)) {
        assessmentCriteria = true;
      }
      if (!isEmpty(subject.curriculum.content)) {
        content = true;
      }
      if (!isEmpty(subject.curriculum.objectives)) {
        objectives = true;
      }
    }
  });
  return { assessmentCriteria, content, objectives };
}
