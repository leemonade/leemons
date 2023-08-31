const _ = require('lodash');
const { getRuleConditionsByRuleIds } = require('./getRuleConditionsByRuleIds');
const { gradeByIds: getGradeByIds } = require('../grades/gradeByIds');
const { RuleProcess } = require('../classes/rule-process');
const { getUserAgentNotesForSubjects } = require('./getUserAgentNotesForSubjects');

async function processRulesForUserAgent({ ruleIds, userAgent, ctx }) {
  const [rules, ruleConditions] = await Promise.all([
    ctx.tx.db.Rules.find({ id: _.isArray(ruleIds) ? ruleIds : [ruleIds] }).lean(),
    getRuleConditionsByRuleIds({ ids: ruleIds, ctx }),
  ]);

  const [grades, programsClasses] = await Promise.all([
    getGradeByIds({ ids: _.map(rules, 'grade'), ctx }),
    ctx.tx.call('academic-portfolio.classes.getBasicClassesByProgram', {
      program: _.map(rules, 'program'),
    }),
  ]);

  const [userNotes, subjectCredits, userAgentClasses] = await Promise.all([
    getUserAgentNotesForSubjects({
      userAgentId: userAgent,
      subjectIds: _.map(programsClasses, 'subject'),
      ctx,
    }),

    ctx.tx.call('academic-portfolio.subjects.getSubjectCredits', {
      subject: _.map(programsClasses, 'subject'),
      program: _.map(rules, 'program'),
    }),

    ctx.tx.call('academic-portfolio.classes.studentGetByClassAndUserAgent', {
      class: _.map(programsClasses, 'id'),
      userAgent,
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
