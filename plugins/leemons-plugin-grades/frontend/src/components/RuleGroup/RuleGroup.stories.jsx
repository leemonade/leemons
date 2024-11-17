import React, { useState } from 'react';
import { RuleGroup, RULE_GROUP_DEFAULT_PROPS } from './RuleGroup';
import { LOGIC_OPERATORS } from '../ProgramRules';
import mdx from './RuleGroup.mdx';
import { v4 as uuidv4 } from 'uuid';

export default {
  title: 'leemons/AcademicRules/RuleGroup',
  parameters: {
    component: RuleGroup,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {},
};

const Template = ({ children, ...props }) => {
  const [data, setData] = useState({
    name: '',
    program: '',
    grade: '',
    group: {
      operator: LOGIC_OPERATORS[0].value,
      conditions: [{ id: uuidv4(), source: '', sourceIds: [], data: '', operator: '', target: 0 }],
    },
  });
  const [edited, setEdited] = useState([]);
  const [error, setError] = useState(false);
  const [logicOperator, setLogicOperator] = useState(LOGIC_OPERATORS[0]);
  return (
    <RuleGroup
      data={data}
      setData={setData}
      edited={edited}
      setEdited={setEdited}
      error={error}
      setError={setError}
      group={data.group}
      externalOperator={logicOperator}
      setExternalOperator={setLogicOperator}
      {...props}
    >
      {children}
    </RuleGroup>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...RULE_GROUP_DEFAULT_PROPS,
  program: { label: 'High School', value: 'highSchool' },
  grades: [
    {
      label: 'A (4.0)',
      value: '4',
    },
    {
      label: 'A- (3.66)',
      value: '3.6',
    },
    {
      label: 'B+ (3.33)',
      value: '3.33',
    },
    {
      label: 'B (3.0)',
      value: '3',
    },
    {
      label: 'B- (2.66)',
      value: '2.66',
    },
    {
      label: 'C+ (2.33)',
      value: '2.33',
    },
    {
      label: 'C (2.0)',
      value: '2',
    },
    {
      label: 'C- (1.66)',
      value: '1.66',
    },
    {
      label: 'D+ (1.33)',
      value: '1.33',
    },
    {
      label: 'D (1.0)',
      value: '1,',
    },
    {
      label: 'D- (0.66)',
      value: '0.66',
    },
    {
      label: 'F (0.33)',
      value: '0.33',
    },
  ],
  sources: [
    {
      label: 'Program',
      value: 'program',
    },
    {
      label: 'Course',
      value: 'course',
    },
    {
      label: 'Knowledge',
      value: 'knowledge',
    },
    {
      label: 'Subject',
      value: 'subject',
    },
    {
      label: 'Subject-type',
      value: 'subjectType',
    },
    {
      label: 'Subject-group',
      value: 'subjectGroup',
    },
  ],
  dataTypes: [
    {
      label: 'Media',
      value: 'gpa',
    },
    {
      label: 'Credits per program',
      value: 'cpp',
    },
    {
      label: 'Credits per course',
      value: 'cpc',
    },
    {
      label: 'Credits per course group',
      value: 'cpcg',
    },
    {
      label: 'Grade',
      value: 'grade',
    },
    {
      label: 'Enrolled',
      value: 'enrolled',
    },
    {
      label: 'Credits',
      value: 'credits',
    },
  ],
  operators: [
    {
      label: 'Greater than',
      value: 'gt',
    },
    {
      label: 'Greater than or equal',
      value: 'gte',
    },
    {
      label: 'Equal',
      value: 'eq',
    },
    {
      label: 'Less than or equal',
      value: 'lte',
    },
    {
      label: 'Less than',
      value: 'lt',
    },
    {
      label: 'Not equal',
      value: 'neq',
    },
    {
      label: 'Contains',
      value: 'contains',
    },
  ],
  courses: [
    {
      label: 'Course1',
      value: 'course1',
    },
    {
      label: 'Course2',
      value: 'course2',
    },
    {
      label: 'Course3',
      value: 'course3',
    },
    {
      label: 'Course4',
      value: 'course4',
    },
    {
      label: 'Course5',
      value: 'course5',
    },
  ],
  knowledges: [
    {
      label: 'English',
      value: 'english',
    },
    {
      label: 'Math',
      value: 'math',
    },
    {
      label: 'Science',
      value: 'science',
    },
    {
      label: 'History',
      value: 'history',
    },
    {
      label: 'Sports',
      value: 'sports',
    },
  ],
  subjects: [
    {
      label: 'Subject1',
      value: 'subject1',
    },
    {
      label: 'Subject2',
      value: 'subject2',
    },
    {
      label: 'Subject3',
      value: 'subject3',
    },
    {
      label: 'Subject4',
      value: 'subject4',
    },
    {
      label: 'Subject5',
      value: 'subject5',
    },
  ],
  subjectTypes: [
    {
      label: 'Type1',
      value: 'type1',
    },
    {
      label: 'Type2',
      value: 'type2',
    },
    {
      label: 'Type3',
      value: 'type3',
    },
    {
      label: 'Type4',
      value: 'type4',
    },
    {
      label: 'Type5',
      value: 'type5',
    },
  ],
  subjectGroups: [
    {
      label: 'Group1',
      value: 'group1',
    },
    {
      label: 'Group2',
      value: 'group2',
    },
    {
      label: 'Group3',
      value: 'group3',
    },
    {
      label: 'Group4',
      value: 'group4',
    },
    {
      label: 'Group5',
      value: 'group5',
    },
  ],
  labels: {
    newGroup: 'New Group',
    menuLabels: {
      remove: 'Remove',
    },
  },
  placeholders: {
    selectItem: 'Select Item',
  },
};
