const _ = require('lodash');
const { table } = require('../tables');
const { getConditionsByRule } = require('../conditions/getConditionsByRule');
const { getConditionGroupsByRule } = require('../condition-groups/getConditionGroupsByRule');

async function getRuleConditionsByRuleIds(ids, { transacting } = {}) {
  const result = {};

  const [rules, conditions, groupConditions] = await Promise.all([
    table.rules.find(
      { id_$in: _.isArray(ids) ? ids : [ids] },
      { columns: ['id', 'group'], transacting }
    ),
    getConditionsByRule(ids, { transacting }),
    getConditionGroupsByRule(ids, { transacting }),
  ]);

  _.forEach(rules, (rule) => {
    result[rule.id] = {
      tree: null,
      conditions: [],
      conditionGroups: [],
      programIds: [],
      courseIds: [],
      subjectTypeIds: [],
      knowledgeIds: [],
      subjectIds: [],
    };
  });

  const groupsById = _.keyBy(groupConditions, 'id');
  const conditionsByGroup = _.groupBy(conditions, 'parentGroup');

  const toRemove = [
    'id',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted',
    'rule',
    'childGroup',
    'parentGroup',
  ];

  _.forEach(groupConditions, (group) => {
    result[group.rule].conditionGroups.push(group);
    // eslint-disable-next-line no-param-reassign
    group.conditions = conditionsByGroup[group.id];
    _.forEach(toRemove, (key) => {
      // eslint-disable-next-line no-param-reassign
      delete group[key];
    });
  });

  _.forEach(conditions, (condition) => {
    result[condition.rule].conditions.push(condition);
    if (condition.source === 'program')
      result[condition.rule].programIds.push(condition.sourceIds[0]);
    if (condition.source === 'course')
      result[condition.rule].courseIds.push(condition.sourceIds[0]);
    if (condition.source === 'subject-type')
      result[condition.rule].subjectTypeIds.push(condition.sourceIds[0]);
    if (condition.source === 'knowledge')
      result[condition.rule].knowledgeIds.push(condition.sourceIds[0]);
    if (condition.source === 'subject')
      result[condition.rule].subjectIds.push(condition.sourceIds[0]);
    if (condition.source === 'subject-group')
      result[condition.rule].subjectIds.push(...condition.sourceIds);
    if (condition.childGroup) {
      // eslint-disable-next-line no-param-reassign
      condition.group = groupsById[condition.childGroup];
    }
    _.forEach(toRemove, (key) => {
      // eslint-disable-next-line no-param-reassign
      delete condition[key];
    });
  });

  _.forEach(rules, (rule) => {
    result[rule.id].tree = groupsById[rule.group];
    result[rule.id].programIds = _.uniq(result[rule.id].programIds);
    result[rule.id].courseIds = _.uniq(result[rule.id].courseIds);
    result[rule.id].subjectTypeIds = _.uniq(result[rule.id].subjectTypeIds);
    result[rule.id].knowledgeIds = _.uniq(result[rule.id].knowledgeIds);
    result[rule.id].subjectIds = _.uniq(result[rule.id].subjectIds);
  });

  return result;
}

module.exports = { getRuleConditionsByRuleIds };
