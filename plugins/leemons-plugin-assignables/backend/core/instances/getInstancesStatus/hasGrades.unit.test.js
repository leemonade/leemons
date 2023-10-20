const { it, expect } = require('@jest/globals');

const { hasGrades } = require('./hasGrades');
const { getGradeObject } = require('../../../__fixtures__/getGradeObject');

let studentData;

beforeEach(() => {
  studentData = {
    grades: getGradeObject().grades,
  };
});

it('Should return true if student has grades and are visibles to student', () => {
  // Arrange
  const expectedValue = true;

  // Act
  const response = hasGrades(studentData);

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should return true if student has grades and are visibles to student', () => {
  // Arrange
  const expectedValue = false;

  studentData = {
    ...studentData,
    grades: studentData.grades.map((grade) => ({ ...grade, visibleToStudent: false })),
  };

  // Act
  const response = hasGrades(studentData);

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should return false if student has no grades', () => {
  // Arrange
  const expectedValue = false;

  studentData = { grades: [] };

  // Act
  const response = hasGrades(studentData);

  // Assert
  expect(response).toBe(expectedValue);
});
