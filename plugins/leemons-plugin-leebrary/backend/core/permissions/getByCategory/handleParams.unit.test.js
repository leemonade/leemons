const { it, expect } = require('@jest/globals');
const { handleParams } = require('./handleParams');

it('should handle params correctly when programs and subjects are provided', () => {
  const params = {
    programs: ['program1', 'program2'],
    subjects: ['subject1', 'subject2'],
    providerQuery: {},
  };
  const [programs, subjects, providerQuery] = handleParams(params);
  expect(programs).toEqual(params.programs);
  expect(subjects).toEqual(params.subjects);
  expect(providerQuery).toEqual(params.providerQuery);
});

it('should handle params correctly when programs and subjects are not provided', () => {
  const params = {
    providerQuery: {
      program: 'program1',
      subjects: ['subject1', 'subject2'],
    },
  };
  const [programs, subjects, providerQuery] = handleParams(params);
  expect(programs).toEqual([params.providerQuery.program]);
  expect(subjects).toEqual(params.providerQuery.subjects);
  expect(providerQuery).toEqual(params.providerQuery);
});

it('should handle params correctly when providerQuery is not provided', () => {
  const params = {
    programs: ['program1', 'program2'],
    subjects: ['subject1', 'subject2'],
  };
  const [programs, subjects, providerQuery] = handleParams(params);
  expect(programs).toEqual(params.programs);
  expect(subjects).toEqual(params.subjects);
  expect(providerQuery).toEqual({ program: params.programs[0], subjects: params.subjects });
});
