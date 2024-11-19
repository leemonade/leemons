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
  userEnrollments,
  classPublicData,
  classPublicDataMany,
} from './classes';
import { getStudentsByTags } from './common';
import { updateCycle } from './cycles';
import {
  createKnowledgeArea,
  listKnowledgeAreas,
  updateKnowledgeArea,
  deleteKnowledgeArea,
  getKnowledgeArea,
} from './knowledges';
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
  getProgramsPublicInfo,
  removeProgram,
  updateProgramConfiguration,
  programHasSubjectHistory,
  duplicateProgram,
  getProgramAcademicTree,
  setProgramCustomTranslationKeys,
  getProgramNomenclature,
  validateStaffChange,
} from './programs';
import {
  enableMenuItem,
  getProfiles,
  getSettings,
  isConfigProfiles,
  setProfiles,
  updateSettings,
} from './settings';
import {
  createSubjectType,
  listSubjectTypes,
  updateSubjectType,
  deleteSubjectType,
} from './subjectTypes';
import {
  createSubject,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  listSubjects,
  removeSubject,
  updateSubject,
  duplicateSubject,
  updateSubjectCredits,
  isMainTeacherInSubject,
} from './subjects';

export {
  listCourses as listCoursesRequest,
  updateCourse as updateCourseRequest,
  getCourseById as getCourseByIdRequest,
} from './courses';

export {
  createGroup as createGroupRequest,
  updateGroup as updateGroupRequest,
  duplicateGroup as duplicateGroupRequest,
  getGroupById as getGroupByIdRequest,
  removeGroupFromClasses as removeGroupFromClassesRequest,
} from './groups';

export {
  listBlocksBySubjectRequest,
  createBlockRequest,
  updateBlockRequest,
  removeBlockRequest,
} from './blocks';

export const updateCycleRequest = updateCycle;
export const listSubjectsRequest = listSubjects;
export const createSubjectRequest = createSubject;
export const updateSubjectRequest = updateSubject;
export const removeSubjectRequest = removeSubject;
export const duplicateSubjectRequest = duplicateSubject;

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
export const userEnrollmentsRequest = userEnrollments;
export const classPublicDataRequest = classPublicData;
export const classPublicDataManyRequest = classPublicDataMany;
export const createKnowledgeRequest = createKnowledgeArea;
export const listKnowledgesRequest = listKnowledgeAreas;
export const updateKnowledgeRequest = updateKnowledgeArea;
export const createKnowledgeAreaRequest = createKnowledgeArea;
export const updateKnowledgeAreaRequest = updateKnowledgeArea;
export const listKnowledgeAreasRequest = listKnowledgeAreas;
export const deleteKnowledgeAreaRequest = deleteKnowledgeArea;
export const getKnowledgeAreaRequest = getKnowledgeArea;

export const createSubjectTypeRequest = createSubjectType;
export const listSubjectTypesRequest = listSubjectTypes;
export const updateSubjectTypeRequest = updateSubjectType;
export const deleteSubjectTypeRequest = deleteSubjectType;

export const getProgramTreeRequest = getProgramTree;
export const listProgramsRequest = listPrograms;
export const haveProgramsRequest = havePrograms;
export const detailProgramRequest = detailProgram;
export const createProgramRequest = createProgram;
export const updateProgramRequest = updateProgram;
export const updateProgramConfigurationRequest = updateProgramConfiguration;
export const programHasSubjectHistoryRequest = programHasSubjectHistory;
export const duplicateProgramRequest = duplicateProgram;
export const getProgramAcademicTreeRequest = getProgramAcademicTree;

export const getUserProgramsRequest = getUserPrograms;
export const getProgramsPublicInfoRequest = getProgramsPublicInfo;
export const removeProgramRequest = removeProgram;

export const setProgramCustomTranslationKeysRequest = setProgramCustomTranslationKeys;
export const getProgramNomenclatureRequest = getProgramNomenclature;
export const validateStaffChangeRequest = validateStaffChange;
export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
export const isConfigProfilesRequest = isConfigProfiles;
export const getProfilesRequest = getProfiles;
export const setProfilesRequest = setProfiles;
export const addStudentsToClassesUnderNodeTreeRequest = addStudentsToClassesUnderNodeTree;

export const getStudentsByTagsRequest = getStudentsByTags;
export const isMainTeacherInSubjectRequest = isMainTeacherInSubject;
