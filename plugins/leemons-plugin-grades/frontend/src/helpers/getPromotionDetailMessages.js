import { clone, forIn } from 'lodash';
import { PROMOTION_DETAIL_FORM_MESSAGES } from '../components/PromotionDetail';

export function getPromotionDetailMessages(t) {
  const m = clone(PROMOTION_DETAIL_FORM_MESSAGES);
  forIn(m, (value, key) => {
    m[key] = t(`detail.${key}`);
  });
  m.conditions = {
    labels: {
      saveButton: t(`detail.labels.saveButton`),
      newRule: t(`detail.labels.newRule`),
      newRuleGroup: t(`detail.labels.newRuleGroup`),
      menuLabels: {
        remove: t(`detail.labels.menuLabels.remove`),
        duplicate: t(`detail.labels.menuLabels.duplicate`),
        turnIntoCondition: t(`detail.labels.menuLabels.turnIntoCondition`),
        turnIntoGroup: t(`detail.labels.menuLabels.turnIntoGroup`),
      },
      where: t(`detail.labels.where`),
    },
    placeholders: {
      programName: t(`detail.placeholders.programName`),
      selectProgram: t(`detail.placeholders.selectProgram`),
      selectGradeSystem: t(`detail.placeholders.selectGradeSystem`),
      conditionPlaceholders: {
        selectItem: t(`detail.placeholders.conditionPlaceholders.selectItem`),
        selectCourse: t(`detail.placeholders.conditionPlaceholders.selectCourse`),
        selectKnowledge: t(`detail.placeholders.conditionPlaceholders.selectKnowledge`),
        selectSubject: t(`detail.placeholders.conditionPlaceholders.selectSubject`),
        selectSubjectType: t(`detail.placeholders.conditionPlaceholders.selectSubjectType`),
        selectSubjectGroup: t(`detail.placeholders.conditionPlaceholders.selectSubjectGroup`),
        selectDataType: t(`detail.placeholders.conditionPlaceholders.selectDataType`),
        selectOperator: t(`detail.placeholders.conditionPlaceholders.selectOperator`),
        selectTargetGrade: t(`detail.placeholders.conditionPlaceholders.selectTargetGrade`),
        enterTarget: t(`detail.placeholders.conditionPlaceholders.enterTarget`),
      },
    },
  };
  return m;
}
