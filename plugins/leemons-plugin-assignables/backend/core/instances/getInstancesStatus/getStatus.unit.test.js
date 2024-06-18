const { it, expect } = require('@jest/globals');
const { getStatus } = require('./getStatusForStudent');

let studentData;
let instanceData;

beforeEach(() => {
  studentData = {
    timestamps: {
      start: '2022-01-01',
      end: '2022-01-31',
    },
    grades: [
      {
        id: 'grade1',
        assignation: 'Math',
        subject: 'Math',
        type: 'Test',
        grade: 90,
        gradedBy: 'Teacher',
        feedback: 'Good job',
        visibleToStudent: true,
      },
    ],
  };

  instanceData = {
    alwaysAvailable: false,
    dates: {
      start: '2022-01-01',
      deadline: '2022-01-31',
      closed: '2022-02-01',
    },
  };
});

it('Should return the correct status based on student and instance data', () => {
  // Arrange
  const expectedValueEvaluated = 'evaluated';
  const expectedValueLate = 'late';
  const expectedValueSubmitted = 'submitted';
  const expectedValueClosed = 'closed';
  const expectedValueStarted = 'started';
  const expectedValueOpened = 'opened';
  const expectedValueAssigned = 'assigned';

  // Act
  const responseEvaluated = getStatus(studentData, instanceData);
  const responseLate = getStatus(
    { ...studentData, timestamps: { ...studentData.timestamps, end: '2022-02-01' }, grades: [] },
    instanceData
  );
  const responseSubmitted = getStatus({ ...studentData, grades: [] }, instanceData);
  const responseClosed = getStatus(
    { ...studentData, timestamps: { ...studentData.timestamps, end: undefined }, grades: [] },
    instanceData
  );
  const responseStarted = getStatus(
    { ...studentData, timestamps: { ...studentData.timestamps, end: undefined } },
    { ...instanceData, dates: { ...instanceData.dates, deadline: undefined } }
  );
  const responseOpened = getStatus(
    { ...studentData, timestamps: { ...studentData.timestamps, end: undefined, start: undefined } },
    { ...instanceData, dates: { ...instanceData.dates, deadline: undefined } }
  );
  const responseAssigned = getStatus(
    { ...studentData, timestamps: { ...studentData.timestamps, end: undefined, start: undefined } },
    { ...instanceData, dates: { ...instanceData.dates, deadline: undefined, start: undefined } }
  );

  // Assert
  expect(responseEvaluated).toBe(expectedValueEvaluated);
  expect(responseLate).toBe(expectedValueLate);
  expect(responseSubmitted).toBe(expectedValueSubmitted);
  expect(responseClosed).toBe(expectedValueClosed);
  expect(responseStarted).toBe(expectedValueStarted);
  expect(responseOpened).toBe(expectedValueOpened);
  expect(responseAssigned).toBe(expectedValueAssigned);
});
