const { parseFilters } = require('../lib/parseFilters');

const model = {
  schema: {
    primaryKey: {
      name: 'uid',
    },
  },
};

describe('parseFilters Functions', () => {
  describe('call parseFilters', () => {
    test('with no params', () => {
      expect(() => parseFilters()).toThrow();
    });

    test('With not valid model', () => {
      expect(() => parseFilters({ model: { no: { valid: 'model' } } })).toThrow();
    });

    test('With valid model', () => {
      expect(parseFilters({ model })).toEqual({});
    });

    test('With not valid filters (null)', () => {
      expect(() => parseFilters({ model, filters: null })).toThrow();
    });
    test('With not valid filters (string)', () => {
      expect(() => parseFilters({ model, filters: '' })).toThrow();
    });

    test('With default filters but empty filters', () => {
      expect(parseFilters({ model, defaults: { key: 'value' } })).toEqual({ key: 'value' });
    });

    describe('with Visualization filters', () => {
      describe('sort filter', () => {
        test('with invalid value', () => {
          expect(() => parseFilters({ model, filters: { $sort: 'name: ASCEND' } })).toThrow();
        });

        test('duplicated keys', () => {
          expect(() =>
            parseFilters({
              model,
              filters: {
                $sort: 'name: ASC, name: DESC',
              },
            })
          ).toThrow();
        });

        test('sort instruction is not a string', () => {
          expect(() =>
            parseFilters({
              model,
              filters: {
                $sort: 23,
              },
            })
          ).toThrow();

          expect(() =>
            parseFilters({
              model,
              filters: {
                $sort: { name: 'asc' },
              },
            })
          ).toThrow();
        });

        test('empty keys', () => {
          expect(() =>
            parseFilters({
              model,
              filters: {
                $sort: ' :ASC',
              },
            })
          ).toThrow();
        });

        describe('with asc value', () => {
          test('in lower-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name:asc' } })).toEqual({
              sort: [{ field: 'name', order: 'asc' }],
              where: [],
            });
          });

          test('in upper-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name:ASC' } })).toEqual({
              sort: [{ field: 'name', order: 'asc' }],
              where: [],
            });
          });

          test('in spaced-lower-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: asc' } })).toEqual({
              sort: [{ field: 'name', order: 'asc' }],
              where: [],
            });
          });

          test('in spaced-upper-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: ASC' } })).toEqual({
              sort: [{ field: 'name', order: 'asc' }],
              where: [],
            });
          });
        });

        describe('with desc value', () => {
          test('in lower-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name:desc' } })).toEqual({
              sort: [{ field: 'name', order: 'desc' }],
              where: [],
            });
          });

          test('in upper-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name:DESC' } })).toEqual({
              sort: [{ field: 'name', order: 'desc' }],
              where: [],
            });
          });

          test('in spaced-lower-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: desc' } })).toEqual({
              sort: [{ field: 'name', order: 'desc' }],
              where: [],
            });
          });

          test('in spaced-upper-case format', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: DESC' } })).toEqual({
              sort: [{ field: 'name', order: 'desc' }],
              where: [],
            });
          });
        });

        describe('with mixed values', () => {
          test('asc and desc', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: ASC, email:DESC' } })).toEqual({
              sort: [
                { field: 'name', order: 'asc' },
                { field: 'email', order: 'desc' },
              ],
              where: [],
            });
          });

          test('desc and asc', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: DESC, email:ASC' } })).toEqual({
              sort: [
                { field: 'name', order: 'desc' },
                { field: 'email', order: 'asc' },
              ],
              where: [],
            });
          });
          test('asc and desc without comma-space', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: ASC,email:DESC' } })).toEqual({
              sort: [
                { field: 'name', order: 'asc' },
                { field: 'email', order: 'desc' },
              ],
              where: [],
            });
          });

          test('desc and asc without comma-space', () => {
            expect(parseFilters({ model, filters: { $sort: 'name: DESC,email:ASC' } })).toEqual({
              sort: [
                { field: 'name', order: 'desc' },
                { field: 'email', order: 'asc' },
              ],
              where: [],
            });
          });

          test('all variants', () => {
            expect(
              parseFilters({
                model,
                filters: {
                  $sort:
                    'name: ASC,email:ASC,surname:DESC, test:DESC,   test2:asc, test3: asc, test4: desc,test5:desc',
                },
              })
            ).toEqual({
              sort: [
                { field: 'name', order: 'asc' },
                { field: 'email', order: 'asc' },
                { field: 'surname', order: 'desc' },
                { field: 'test', order: 'desc' },
                { field: 'test2', order: 'asc' },
                { field: 'test3', order: 'asc' },
                { field: 'test4', order: 'desc' },
                { field: 'test5', order: 'desc' },
              ],
              where: [],
            });
          });
        });

        describe('default value is asc', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $sort: 'name',
              },
            })
          ).toEqual({
            sort: [{ field: 'name', order: 'asc' }],
            where: [],
          });
        });
      });

      describe('offset filter', () => {
        test('with numeric value', () => {
          expect(parseFilters({ model, filters: { $offset: 13 } })).toEqual({
            offset: 13,
            where: [],
          });
        });

        describe('with non numeric value', () => {
          test('json', () => {
            expect(() => parseFilters({ model, filters: { $offset: {} } })).toThrow();
          });

          test('empty array', () => {
            expect(parseFilters({ model, filters: { $offset: [] } })).toEqual({
              offset: 0,
              where: [],
            });
          });

          test('filled array length: 1', () => {
            expect(parseFilters({ model, filters: { $offset: [1] } })).toEqual({
              offset: 1,
              where: [],
            });
          });

          test('filled array length: 2', () => {
            expect(() => parseFilters({ model, filters: { $offset: [1, 2] } })).toThrow();
          });

          test('string', () => {
            expect(parseFilters({ model, filters: { $offset: '12' } })).toEqual({
              offset: 12,
              where: [],
            });
          });

          test('non-numeric string', () => {
            expect(() => parseFilters({ model, filters: { $offset: 'hola' } })).toThrow();
          });
        });

        describe('$start alias', () => {
          test('with numeric value', () => {
            expect(parseFilters({ model, filters: { $start: 13 } })).toEqual({
              offset: 13,
              where: [],
            });
          });

          describe('with non numeric value', () => {
            test('json', () => {
              expect(() => parseFilters({ model, filters: { $start: {} } })).toThrow();
            });

            test('empty array', () => {
              expect(parseFilters({ model, filters: { $start: [] } })).toEqual({
                offset: 0,
                where: [],
              });
            });

            test('filled array length: 1', () => {
              expect(parseFilters({ model, filters: { $start: [1] } })).toEqual({
                offset: 1,
                where: [],
              });
            });

            test('filled array length: 2', () => {
              expect(() => parseFilters({ model, filters: { $start: [1, 2] } })).toThrow();
            });

            test('string', () => {
              expect(parseFilters({ model, filters: { $start: '12' } })).toEqual({
                offset: 12,
                where: [],
              });
            });

            test('non-numeric string', () => {
              expect(() => parseFilters({ model, filters: { $start: 'hola' } })).toThrow();
            });
          });
        });
      });

      describe('limit filter', () => {
        test('with numeric value', () => {
          expect(parseFilters({ model, filters: { $limit: 13 } })).toEqual({
            limit: 13,
            where: [],
          });
        });

        describe('with non numeric value', () => {
          test('json', () => {
            expect(() => parseFilters({ model, filters: { $limit: {} } })).toThrow();
          });

          test('empty array', () => {
            expect(parseFilters({ model, filters: { $limit: [] } })).toEqual({
              limit: 0,
              where: [],
            });
          });

          test('filled array length: 1', () => {
            expect(parseFilters({ model, filters: { $limit: [1] } })).toEqual({
              limit: 1,
              where: [],
            });
          });

          test('filled array length: 2', () => {
            expect(() => parseFilters({ model, filters: { $limit: [1, 2] } })).toThrow();
          });

          test('string', () => {
            expect(parseFilters({ model, filters: { $limit: '12' } })).toEqual({
              limit: 12,
              where: [],
            });
          });

          test('non-numeric string', () => {
            expect(() => parseFilters({ model, filters: { $limit: 'hola' } })).toThrow();
          });
        });
      });
    });

    describe('with Comparision filters', () => {
      describe('equals filter', () => {
        test('string value', () => {
          expect(parseFilters({ model, filters: { name: 'Jane' } })).toEqual({
            where: [
              {
                field: 'name',
                operator: 'eq',
                value: 'Jane',
              },
            ],
          });
        });

        test('numeric value', () => {
          expect(parseFilters({ model, filters: { grade: 2 } })).toEqual({
            where: [
              {
                field: 'grade',
                operator: 'eq',
                value: 2,
              },
            ],
          });
        });
        test('array value', () => {
          expect(parseFilters({ model, filters: { grades: [5, 7, 8, 9] } })).toEqual({
            where: [
              {
                field: 'grades',
                operator: 'eq',
                value: [5, 7, 8, 9],
              },
            ],
          });
        });
        test('json value', () => {
          expect(parseFilters({ model, filters: { grades: { maths: 7, physics: 8 } } })).toEqual({
            where: [
              {
                field: 'grades',
                operator: 'eq',
                value: { maths: 7, physics: 8 },
              },
            ],
          });
        });

        test('string value with suffix', () => {
          expect(parseFilters({ model, filters: { name_$eq: 'Jane' } })).toEqual({
            where: [
              {
                field: 'name',
                operator: 'eq',
                value: 'Jane',
              },
            ],
          });
        });
        test('numeric value with suffix', () => {
          expect(parseFilters({ model, filters: { grade_$eq: 2 } })).toEqual({
            where: [
              {
                field: 'grade',
                operator: 'eq',
                value: 2,
              },
            ],
          });
        });
        test('array value with suffix', () => {
          expect(parseFilters({ model, filters: { grades_$eq: [5, 7, 8, 9] } })).toEqual({
            where: [
              {
                field: 'grades',
                operator: 'eq',
                value: [5, 7, 8, 9],
              },
            ],
          });
        });
        test('json value with suffix', () => {
          expect(
            parseFilters({ model, filters: { grades_$eq: { maths: 7, physics: 8 } } })
          ).toEqual({
            where: [
              {
                field: 'grades',
                operator: 'eq',
                value: { maths: 7, physics: 8 },
              },
            ],
          });
        });

        test('with id (but custom primary key name)', () => {
          expect(parseFilters({ model, filters: { id: 1 } })).toEqual({
            where: [
              {
                field: model.schema.primaryKey.name,
                operator: 'eq',
                value: 1,
              },
            ],
          });
        });
        test('with id (but custom primary key name) and suffix', () => {
          expect(parseFilters({ model, filters: { id_$eq: 1 } })).toEqual({
            where: [
              {
                field: model.schema.primaryKey.name,
                operator: 'eq',
                value: 1,
              },
            ],
          });
        });

        test('without key', () => {
          expect(() => parseFilters({ model, filters: { '': 'jane' } })).toThrow();
        });

        test('without key but suffix', () => {
          expect(() => parseFilters({ model, filters: { _$eq: 'jane' } })).toThrow();
        });

        test('with key but empty suffix', () => {
          expect(parseFilters({ model, filters: { name_$: 'jane' } })).toEqual({
            where: [
              {
                field: 'name_$',
                operator: 'eq',
                value: 'jane',
              },
            ],
          });
        });
      });

      // Very important, parseFilters only transform the structure, does not
      // makes filter-specific checks (The only special case is equality,
      // because of suffix omission)
      describe.each([
        ['not equals', 'ne'],
        ['in', 'in'],
        ['not in', 'nin'],
        ['contains', 'contains'],
        ['not contains', 'ncontains'],
        ['strict contains', 'containss'],
        ['not strict contains', 'ncontainss'],
        ['lower than', 'lt'],
        ['lower than or equal to', 'lte'],
        ['greater than', 'gt'],
        ['greater than or equal to', 'gte'],
        ['is null', 'null'],
      ])('%s filter', (name, suffix) => {
        test('string value', () => {
          expect(parseFilters({ model, filters: { [`name_$${suffix}`]: 'Jane' } })).toEqual({
            where: [
              {
                field: 'name',
                operator: suffix,
                value: 'Jane',
              },
            ],
          });
        });

        test('numeric value', () => {
          expect(parseFilters({ model, filters: { [`grade_$${suffix}`]: 2 } })).toEqual({
            where: [
              {
                field: 'grade',
                operator: suffix,
                value: 2,
              },
            ],
          });
        });
        test('array value', () => {
          expect(parseFilters({ model, filters: { [`grades_$${suffix}`]: [5, 7, 8, 9] } })).toEqual(
            {
              where: [
                {
                  field: 'grades',
                  operator: suffix,
                  value: [5, 7, 8, 9],
                },
              ],
            }
          );
        });
        test('json value', () => {
          expect(
            parseFilters({ model, filters: { [`grades_$${suffix}`]: { maths: 7, physics: 8 } } })
          ).toEqual({
            where: [
              {
                field: 'grades',
                operator: suffix,
                value: { maths: 7, physics: 8 },
              },
            ],
          });
        });

        test('with id (but custom primary key name)', () => {
          expect(parseFilters({ model, filters: { [`id_$${suffix}`]: 1 } })).toEqual({
            where: [
              {
                field: model.schema.primaryKey.name,
                operator: suffix,
                value: 1,
              },
            ],
          });
        });

        test('without key', () => {
          expect(() => parseFilters({ model, filters: { [`_$${suffix}`]: 'jane' } })).toThrow();
        });
      });
    });

    describe('with Logic filters', () => {
      describe('where filter', () => {
        test('where as and', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $where: [{ age_$gte: 14 }, { age_$lte: 18 }],
              },
            })
          ).toEqual({
            where: [
              {
                field: 'age',
                operator: 'gte',
                value: 14,
              },
              {
                field: 'age',
                operator: 'lte',
                value: 18,
              },
            ],
          });
        });

        test('Multi-filter where', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $where: { age_$gte: 14, age_$lte: 18, subject_$in: ['maths', 'physics'] },
              },
            })
          ).toEqual({
            where: [
              {
                field: 'age',
                operator: 'gte',
                value: 14,
              },
              {
                field: 'age',
                operator: 'lte',
                value: 18,
              },
              {
                field: 'subject',
                operator: 'in',
                value: ['maths', 'physics'],
              },
            ],
          });
        });

        test('Mono-filter or', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $where: { $or: [{ subject_$in: ['maths', 'physics'] }, { teacher: 'Jane Doe' }] },
              },
            })
          ).toEqual({
            where: [
              {
                field: null,
                operator: 'or',
                value: [
                  [
                    {
                      field: 'subject',
                      operator: 'in',
                      value: ['maths', 'physics'],
                    },
                  ],
                  [
                    {
                      field: 'teacher',
                      operator: 'eq',
                      value: 'Jane Doe',
                    },
                  ],
                ],
              },
            ],
          });
        });

        test('Multi-filter or', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $where: {
                  $or: [
                    { subject_$in: ['maths', 'physics'], grade: 2 },
                    { teacher: 'Jane Doe', grade_$gte: 3 },
                  ],
                },
              },
            })
          ).toEqual({
            where: [
              {
                field: null,
                operator: 'or',
                value: [
                  [
                    {
                      field: 'subject',
                      operator: 'in',
                      value: ['maths', 'physics'],
                    },
                    {
                      field: 'grade',
                      operator: 'eq',
                      value: 2,
                    },
                  ],
                  [
                    {
                      field: 'teacher',
                      operator: 'eq',
                      value: 'Jane Doe',
                    },
                    {
                      field: 'grade',
                      operator: 'gte',
                      value: 3,
                    },
                  ],
                ],
              },
            ],
          });
        });

        describe('equals filter', () => {
          test('string value', () => {
            expect(parseFilters({ model, filters: { $where: { name: 'Jane' } } })).toEqual({
              where: [
                {
                  field: 'name',
                  operator: 'eq',
                  value: 'Jane',
                },
              ],
            });
          });

          test('numeric value', () => {
            expect(parseFilters({ model, filters: { $where: { grade: 2 } } })).toEqual({
              where: [
                {
                  field: 'grade',
                  operator: 'eq',
                  value: 2,
                },
              ],
            });
          });
          test('array value', () => {
            expect(parseFilters({ model, filters: { $where: { grades: [5, 7, 8, 9] } } })).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: 'eq',
                  value: [5, 7, 8, 9],
                },
              ],
            });
          });
          test('json value', () => {
            expect(
              parseFilters({ model, filters: { $where: { grades: { maths: 7, physics: 8 } } } })
            ).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: 'eq',
                  value: { maths: 7, physics: 8 },
                },
              ],
            });
          });

          test('string value with suffix', () => {
            expect(parseFilters({ model, filters: { $where: { name_$eq: 'Jane' } } })).toEqual({
              where: [
                {
                  field: 'name',
                  operator: 'eq',
                  value: 'Jane',
                },
              ],
            });
          });
          test('numeric value with suffix', () => {
            expect(parseFilters({ model, filters: { $where: { grade_$eq: 2 } } })).toEqual({
              where: [
                {
                  field: 'grade',
                  operator: 'eq',
                  value: 2,
                },
              ],
            });
          });
          test('array value with suffix', () => {
            expect(
              parseFilters({ model, filters: { $where: { grades_$eq: [5, 7, 8, 9] } } })
            ).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: 'eq',
                  value: [5, 7, 8, 9],
                },
              ],
            });
          });
          test('json value with suffix', () => {
            expect(
              parseFilters({ model, filters: { $where: { grades_$eq: { maths: 7, physics: 8 } } } })
            ).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: 'eq',
                  value: { maths: 7, physics: 8 },
                },
              ],
            });
          });

          test('with id (but custom primary key name)', () => {
            expect(parseFilters({ model, filters: { $where: { id: 1 } } })).toEqual({
              where: [
                {
                  field: model.schema.primaryKey.name,
                  operator: 'eq',
                  value: 1,
                },
              ],
            });
          });
          test('with id (but custom primary key name) and suffix', () => {
            expect(parseFilters({ model, filters: { $where: { id_$eq: 1 } } })).toEqual({
              where: [
                {
                  field: model.schema.primaryKey.name,
                  operator: 'eq',
                  value: 1,
                },
              ],
            });
          });

          test('without key', () => {
            expect(() => parseFilters({ model, filters: { $where: { '': 'jane' } } })).toThrow();
          });

          test('without key but suffix', () => {
            expect(() => parseFilters({ model, filters: { $where: { _$eq: 'jane' } } })).toThrow();
          });

          test('with key but empty suffix', () => {
            expect(parseFilters({ model, filters: { $where: { name_$: 'jane' } } })).toEqual({
              where: [
                {
                  field: 'name_$',
                  operator: 'eq',
                  value: 'jane',
                },
              ],
            });
          });
        });

        // Very important, parseFilters only transform the structure, does not
        // makes filter-specific checks (The only special case is equality,
        // because of suffix omission)
        describe.each([
          ['not equals', 'ne'],
          ['in', 'in'],
          ['not in', 'nin'],
          ['contains', 'contains'],
          ['not contains', 'ncontains'],
          ['strict contains', 'containss'],
          ['not strict contains', 'ncontainss'],
          ['lower than', 'lt'],
          ['lower than or equal to', 'lte'],
          ['greater than', 'gt'],
          ['greater than or equal to', 'gte'],
          ['is null', 'null'],
        ])('%s filter', (name, suffix) => {
          test('string value', () => {
            expect(
              parseFilters({ model, filters: { $where: { [`name_$${suffix}`]: 'Jane' } } })
            ).toEqual({
              where: [
                {
                  field: 'name',
                  operator: suffix,
                  value: 'Jane',
                },
              ],
            });
          });

          test('numeric value', () => {
            expect(
              parseFilters({ model, filters: { $where: { [`grade_$${suffix}`]: 2 } } })
            ).toEqual({
              where: [
                {
                  field: 'grade',
                  operator: suffix,
                  value: 2,
                },
              ],
            });
          });
          test('array value', () => {
            expect(
              parseFilters({ model, filters: { $where: { [`grades_$${suffix}`]: [5, 7, 8, 9] } } })
            ).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: suffix,
                  value: [5, 7, 8, 9],
                },
              ],
            });
          });
          test('json value', () => {
            expect(
              parseFilters({
                model,
                filters: { $where: { [`grades_$${suffix}`]: { maths: 7, physics: 8 } } },
              })
            ).toEqual({
              where: [
                {
                  field: 'grades',
                  operator: suffix,
                  value: { maths: 7, physics: 8 },
                },
              ],
            });
          });

          test('with id (but custom primary key name)', () => {
            expect(parseFilters({ model, filters: { $where: { [`id_$${suffix}`]: 1 } } })).toEqual({
              where: [
                {
                  field: model.schema.primaryKey.name,
                  operator: suffix,
                  value: 1,
                },
              ],
            });
          });

          test('without key', () => {
            expect(() =>
              parseFilters({ model, filters: { $where: { [`_$${suffix}`]: 'jane' } } })
            ).toThrow();
          });
        });
      });

      describe('or filter', () => {
        test('Mono-filter or', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $or: [{ subject_$in: ['maths', 'physics'] }, { teacher: 'Jane Doe' }],
              },
            })
          ).toEqual({
            where: [
              {
                field: null,
                operator: 'or',
                value: [
                  [
                    {
                      field: 'subject',
                      operator: 'in',
                      value: ['maths', 'physics'],
                    },
                  ],
                  [
                    {
                      field: 'teacher',
                      operator: 'eq',
                      value: 'Jane Doe',
                    },
                  ],
                ],
              },
            ],
          });
        });

        test('Multi-filter or', () => {
          expect(
            parseFilters({
              model,
              filters: {
                $or: [
                  { subject_$in: ['maths', 'physics'], grade: 2 },
                  { teacher: 'Jane Doe', grade_$gte: 3 },
                ],
              },
            })
          ).toEqual({
            where: [
              {
                field: null,
                operator: 'or',
                value: [
                  [
                    {
                      field: 'subject',
                      operator: 'in',
                      value: ['maths', 'physics'],
                    },
                    {
                      field: 'grade',
                      operator: 'eq',
                      value: 2,
                    },
                  ],
                  [
                    {
                      field: 'teacher',
                      operator: 'eq',
                      value: 'Jane Doe',
                    },
                    {
                      field: 'grade',
                      operator: 'gte',
                      value: 3,
                    },
                  ],
                ],
              },
            ],
          });
        });
      });
    });

    describe('Mixed filters', () => {
      test('(average >= 8 or honorific = true) and course == last, order ASC by surname', () => {
        expect(
          parseFilters({
            model,
            filters: {
              $or: [{ average_$gte: 8 }, { honorific: true }],
              course: 'last',
              $sort: 'surname:ASC',
            },
          })
        ).toEqual({
          sort: [
            {
              field: 'surname',
              order: 'asc',
            },
          ],
          where: [
            {
              field: null,
              operator: 'or',
              value: [
                [
                  {
                    field: 'average',
                    operator: 'gte',
                    value: 8,
                  },
                ],
                [
                  {
                    field: 'honorific',
                    operator: 'eq',
                    value: true,
                  },
                ],
              ],
            },
            {
              field: 'course',
              operator: 'eq',
              value: 'last',
            },
          ],
        });
      });
      test('(average >= 8 or honorific = true) and course == last, order ASC by surname (with $where)', () => {
        expect(
          parseFilters({
            model,
            filters: {
              $where: {
                $or: [{ average_$gte: 8 }, { honorific: true }],
                course: 'last',
              },
              $sort: 'surname:ASC',
            },
          })
        ).toEqual({
          sort: [
            {
              field: 'surname',
              order: 'asc',
            },
          ],
          where: [
            {
              field: null,
              operator: 'or',
              value: [
                [
                  {
                    field: 'average',
                    operator: 'gte',
                    value: 8,
                  },
                ],
                [
                  {
                    field: 'honorific',
                    operator: 'eq',
                    value: true,
                  },
                ],
              ],
            },
            {
              field: 'course',
              operator: 'eq',
              value: 'last',
            },
          ],
        });
      });
      test('(average >= 8 or honorific = true) and course == last, order ASC by surname (with $where as and)', () => {
        expect(
          parseFilters({
            model,
            filters: {
              $where: [
                {
                  $or: [{ average_$gte: 8 }, { honorific: true }],
                },
                {
                  course: 'last',
                },
              ],
              $sort: 'surname:ASC',
            },
          })
        ).toEqual({
          sort: [
            {
              field: 'surname',
              order: 'asc',
            },
          ],
          where: [
            {
              field: null,
              operator: 'or',
              value: [
                [
                  {
                    field: 'average',
                    operator: 'gte',
                    value: 8,
                  },
                ],
                [
                  {
                    field: 'honorific',
                    operator: 'eq',
                    value: true,
                  },
                ],
              ],
            },
            {
              field: 'course',
              operator: 'eq',
              value: 'last',
            },
          ],
        });
      });

      test('using $key column name', () => {
        expect(
          parseFilters({
            model,
            filters: {
              $name: 'Jane',
            },
          })
        ).toEqual({
          where: [
            {
              field: '$name',
              operator: 'eq',
              value: 'Jane',
            },
          ],
        });
      });
    });
  });
});
