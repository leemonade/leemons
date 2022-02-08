import { listPrograms, detailProgram, createProgram, updateProgram } from './programs';
import { getSettings, updateSettings, enableMenuItem } from './settings';

export const listProgramsRequest = listPrograms;
export const detailProgramRequest = detailProgram;
export const createProgramRequest = createProgram;
export const updateProgramRequest = updateProgram;

export const getSettingsRequest = getSettings;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
