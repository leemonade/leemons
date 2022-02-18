import {
  createSubject,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  listSubjects,
  updateSubject,
  updateSubjectCredits,
} from './subjects';
import {
  createProgram,
  detailProgram,
  getProgramTree,
  havePrograms,
  listPrograms,
  updateProgram,
} from './programs';
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
  createClass,
  createClassInstance,
  haveClasses,
  listClasses,
  updateClass,
  updateClassMany,
} from './classes';

export { listCourses as listCoursesRequest, updateCourse as updateCourseRequest } from './courses';

export {
  createGroup as createGroupRequest,
  updateGroup as updateGroupRequest,
  removeGroupFromClasses as removeGroupFromClassesRequest,
} from './groups';

export const listSubjectsRequest = listSubjects;
export const createSubjectRequest = createSubject;
export const updateSubjectRequest = updateSubject;
export const updateSubjectCreditsRequest = updateSubjectCredits;
export const getSubjectCreditsRequest = getSubjectCredits;
export const listSubjectCreditsForProgramRequest = listSubjectCreditsForProgram;

export const haveClassesRequest = haveClasses;
export const listClassesRequest = listClasses;
export const createClassRequest = createClass;
export const updateClassRequest = updateClass;
export const updateClassManyRequest = updateClassMany;
export const createClassInstanceRequest = createClassInstance;
export const addStudentsToClassRequest = addStudentsToClass;
export const addTeachersToClassRequest = addTeachersToClass;

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

export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
export const isConfigProfilesRequest = isConfigProfiles;
export const getProfilesRequest = getProfiles;
export const setProfilesRequest = setProfiles;
