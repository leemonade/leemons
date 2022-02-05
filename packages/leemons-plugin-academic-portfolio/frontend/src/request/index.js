import {
  createProgram,
  detailProgram,
  havePrograms,
  listPrograms,
  updateProgram,
} from './programs';
import { enableMenuItem, getSettings, updateSettings } from './settings';
import { createKnowledge, listKnowledges } from './knowledges';
import { createSubjectType, listSubjectTypes } from './subjectTypes';

import {
  addStudentsToClass,
  addTeachersToClass,
  createClass,
  createClassInstance,
  listClasses,
  updateClass,
  updateClassMany,
} from './classes';

export const listClassesRequest = listClasses;
export const createClassRequest = createClass;
export const updateClassRequest = updateClass;
export const updateClassManyRequest = updateClassMany;
export const createClassInstanceRequest = createClassInstance;
export const addStudentsToClassRequest = addStudentsToClass;
export const addTeachersToClassRequest = addTeachersToClass;

export const createKnowledgeRequest = createKnowledge;
export const listKnowledgesRequest = listKnowledges;

export const createSubjectTypeRequest = createSubjectType;
export const listSubjectTypesRequest = listSubjectTypes;

export const listProgramsRequest = listPrograms;
export const haveProgramsRequest = havePrograms;
export const detailProgramRequest = detailProgram;
export const createProgramRequest = createProgram;
export const updateProgramRequest = updateProgram;

export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
