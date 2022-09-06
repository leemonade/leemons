import {
  createSubject,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  listSubjects,
  removeSubject,
  updateSubject,
  updateSubjectCredits,
} from './subjects';
import {
  addStudentsToClassesUnderNodeTree,
  createProgram,
  detailProgram,
  getProgramEvaluationSystem,
  getProgramTree,
  getUserPrograms,
  havePrograms,
  listPrograms,
  updateProgram,
} from './programs';
import { updateCycle } from './cycles';
import {
  enableMenuItem,
  getProfiles,
  getSettings,
  isConfigProfiles,
  setProfiles,
  updateSettings,
} from './settings';
import { createKnowledge, listKnowledges, updateKnowledge } from './knowledges';
import { createSubjectType, listSubjectTypes, updateSubjectType } from './subjectTypes';

import {
  addStudentsToClass,
  addTeachersToClass,
  classByIds,
  classDetailForDashboard,
  createClass,
  createClassInstance,
  haveClasses,
  listClasses,
  listSessionClasses,
  listStudentClasses,
  listSubjectClasses,
  listTeacherClasses,
  removeClass,
  removeStudentFromClass,
  updateClass,
  updateClassMany,
} from './classes';
import { getStudentsByTags } from './common';

export { listCourses as listCoursesRequest, updateCourse as updateCourseRequest } from './courses';

export {
  createGroup as createGroupRequest,
  updateGroup as updateGroupRequest,
  duplicateGroup as duplicateGroupRequest,
  removeGroupFromClasses as removeGroupFromClassesRequest,
} from './groups';

export const updateCycleRequest = updateCycle;
export const listSubjectsRequest = listSubjects;
export const createSubjectRequest = createSubject;
export const updateSubjectRequest = updateSubject;
export const removeSubjectRequest = removeSubject;
export const updateSubjectCreditsRequest = updateSubjectCredits;
export const getSubjectCreditsRequest = getSubjectCredits;
export const listSubjectCreditsForProgramRequest = listSubjectCreditsForProgram;

export const haveClassesRequest = haveClasses;
export const listClassesRequest = listClasses;
export const createClassRequest = createClass;
export const updateClassRequest = updateClass;
export const removeClassRequest = removeClass;
export const listSubjectClassesRequest = listSubjectClasses;
export const getProgramEvaluationSystemRequest = getProgramEvaluationSystem;
export const updateClassManyRequest = updateClassMany;
export const listSessionClassesRequest = listSessionClasses;
export const createClassInstanceRequest = createClassInstance;
export const addStudentsToClassRequest = addStudentsToClass;
export const addTeachersToClassRequest = addTeachersToClass;
export const listStudentClassesRequest = listStudentClasses;
export const listTeacherClassesRequest = listTeacherClasses;
export const classDetailForDashboardRequest = classDetailForDashboard;
export const removeStudentFromClassRequest = removeStudentFromClass;
export const classByIdsRequest = classByIds;

export const createKnowledgeRequest = createKnowledge;
export const listKnowledgesRequest = listKnowledges;
export const updateKnowledgeRequest = updateKnowledge;

export const createSubjectTypeRequest = createSubjectType;
export const listSubjectTypesRequest = listSubjectTypes;
export const updateSubjectTypeRequest = updateSubjectType;

export const getProgramTreeRequest = getProgramTree;
export const listProgramsRequest = listPrograms;
export const haveProgramsRequest = havePrograms;
export const detailProgramRequest = detailProgram;
export const createProgramRequest = createProgram;
export const updateProgramRequest = updateProgram;
export const getUserProgramsRequest = getUserPrograms;

export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
export const isConfigProfilesRequest = isConfigProfiles;
export const getProfilesRequest = getProfiles;
export const setProfilesRequest = setProfiles;
export const addStudentsToClassesUnderNodeTreeRequest = addStudentsToClassesUnderNodeTree;

export const getStudentsByTagsRequest = getStudentsByTags;
