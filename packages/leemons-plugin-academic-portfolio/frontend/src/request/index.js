import {
  createProgram,
  detailProgram,
  havePrograms,
  listPrograms,
  updateProgram,
} from './programs';
import { enableMenuItem, getSettings, updateSettings } from './settings';
import { createKnowledge, listKnowledges } from './knowledges';

export const createKnowledgeRequest = createKnowledge;
export const listKnowledgesRequest = listKnowledges;

export const listProgramsRequest = listPrograms;
export const haveProgramsRequest = havePrograms;
export const detailProgramRequest = detailProgram;
export const createProgramRequest = createProgram;
export const updateProgramRequest = updateProgram;

export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
