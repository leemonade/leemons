import { enableMenuItem, getSettings, updateSettings } from './settings';
import {
  addGrade,
  addGradeScale,
  addGradeTag,
  canDeleteGradeScale,
  deleteGrade,
  deleteGradeScale,
  deleteGradeTag,
  getGrade,
  haveGrades,
  listGrades,
  updateGrade,
  updateGradeScale,
  updateGradeTag,
} from './evaluations';
import {
  addPromotion,
  deletePromotion,
  havePromotions,
  listPromotions,
  updatePromotion,
} from './promotions';
import {
  addDependency,
  deleteDependency,
  listDependencies,
  updateDependency,
} from './dependencies';

export const getGradeRequest = getGrade;
export const addGradeRequest = addGrade;
export const haveGradesRequest = haveGrades;
export const listGradesRequest = listGrades;
export const deleteGradeRequest = deleteGrade;
export const updateGradeRequest = updateGrade;
export const getSettingsRequest = getSettings;
export const addGradeTagRequest = addGradeTag;
export const addPromotionRequest = addPromotion;
export const addGradeScaleRequest = addGradeScale;
export const listPromotionsRequest = listPromotions;
export const updatePromotionRequest = updatePromotion;
export const deletePromotionRequest = deletePromotion;

export const listDependenciesRequest = listDependencies;
export const addDependencyRequest = addDependency;
export const updateDependencyRequest = updateDependency;
export const deleteDependencyRequest = deleteDependency;

export const updateGradeTagRequest = updateGradeTag;
export const deleteGradeTagRequest = deleteGradeTag;
export const updateSettingsRequest = updateSettings;
export const enableMenuItemRequest = enableMenuItem;
export const havePromotionsRequest = havePromotions;
export const updateGradeScaleRequest = updateGradeScale;
export const deleteGradeScaleRequest = deleteGradeScale;
export const canDeleteGradeScaleRequest = canDeleteGradeScale;
