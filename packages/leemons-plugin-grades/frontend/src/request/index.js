import { enableMenuItem, getSettings, updateSettings } from './settings';
import {
  addGrade,
  addGradeScale,
  addGradeTag,
  canDeleteGradeScale,
  deleteGradeScale,
  deleteGradeTag,
  listGrades,
  updateGrade,
  updateGradeScale,
  updateGradeTag,
} from './evaluations';

export const addGradeRequest = addGrade;
export const listGradesRequest = listGrades;
export const updateGradeRequest = updateGrade;
export const getSettingsRequest = getSettings;
export const addGradeTagRequest = addGradeTag;
export const addGradeScaleRequest = addGradeScale;
export const updateGradeTagRequest = updateGradeTag;
export const deleteGradeTagRequest = deleteGradeTag;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
export const updateGradeScaleRequest = updateGradeScale;
export const deleteGradeScaleRequest = deleteGradeScale;
export const canDeleteGradeScaleRequest = canDeleteGradeScale;
