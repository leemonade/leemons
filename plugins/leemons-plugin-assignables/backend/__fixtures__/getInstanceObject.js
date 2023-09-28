function getInstanceObject() {
  return {
    id: 'test-id',
    deploymentID: 'test-deploymentID',
    assignable: 'test-assignable',
    alwaysAvailable: true,
    dates: ['2022-01-01', '2022-01-02'],
    duration: '10 minutes',
    gradable: false,
    requiresScoring: false,
    allowFeedback: false,
    showResults: true,
    showCorrectAnswers: true,
    sendMail: false,
    messageToAssignees: 'Test message',
    curriculum: {},
    metadata: {
      evaluationType: 'auto',
      questions: [
        '1cda7d46-142f-437e-8cbe-1697cb329997',
        '2b66c20a-b817-4ee1-941e-8c66b3a7ae3d',
        '5258ea9b-d14b-44b4-87bf-07a772feea56',
        '9df548fd-df93-46e0-a37a-0f9d05fe9853',
        'd74500b7-d29c-4b9a-9a0f-b4cbeee9dba7',
        'f7eb4aa9-fc91-461c-af96-78e1f83b8b9b',
      ],
      filters: {
        wrong: 0,
        canOmitQuestions: true,
        allowClues: true,
        omit: 0,
        clues: [
          { type: 'note', name: 'Información extra', value: 0, canUse: true },
          { type: 'hide-response', name: 'Ocultar/Mostrar opción', value: 0, canUse: true },
        ],
        useAllQuestions: true,
      },
    },
    relatedAssignableInstances: {
      before: [],
      after: [],
      blocking: [{ id: '4f5336c5-f31e-4c13-ae0b-eb2de4feca4e', required: true }],
    },
    event: 'test-event',
    addNewClassStudents: false,
  };
}

module.exports = { getInstanceObject };
