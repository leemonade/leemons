const _ = require('lodash');
const { table } = require('../tables');
const { getRuleConditionsByRuleIds } = require('./getRuleConditionsByRuleIds');
const { gradeByIds: getGradeByIds } = require('../grades/gradeByIds');
const { RuleProcess } = require('../../classes/rule-process');
const { getUserAgentNotesForSubjects } = require('./getUserAgentNotesForSubjects');

async function processRulesForUserAgent(ruleIds, userAgent, { transacting } = {}) {
  const [rules, ruleConditions] = await Promise.all([
    table.rules.find({ id_$in: _.isArray(ruleIds) ? ruleIds : [ruleIds] }, { transacting }),
    getRuleConditionsByRuleIds(ruleIds, { transacting }),
  ]);

  const [grades, programsClasses] = await Promise.all([
    getGradeByIds(_.map(rules, 'grade'), { transacting }),
    leemons
      .getPlugin('academic-portfolio')
      .services.classes.getBasicClassesByProgram(_.map(rules, 'program'), { transacting }),
  ]);

  const [userNotes, subjectCredits, userAgentClasses] = await Promise.all([
    getUserAgentNotesForSubjects(userAgent, _.map(programsClasses, 'subject'), { transacting }),
    leemons
      .getPlugin('academic-portfolio')
      .services.subjects.getSubjectCredits(
        _.map(programsClasses, 'subject'),
        _.map(rules, 'program'),
        { transacting }
      ),
    leemons
      .getPlugin('academic-portfolio')
      .services.classes.student.getByClassAndUserAgent(_.map(programsClasses, 'id'), userAgent, {
        transacting,
      }),
  ]);

  const gradeByIds = _.keyBy(grades, 'id');
  const classesByProgram = _.groupBy(programsClasses, 'program');
  const subjectCreditsByProgram = _.groupBy(subjectCredits, 'program');

  const result = {};

  _.forEach(rules, (rule) => {
    const process = new RuleProcess(
      rule,
      ruleConditions[rule.id],
      gradeByIds[rule.grade],
      classesByProgram[rule.program],
      userNotes,
      subjectCreditsByProgram[rule.program],
      userAgentClasses
    );
    result[rule.id] = process.process();
  });

  return result;
}

module.exports = { processRulesForUserAgent };
