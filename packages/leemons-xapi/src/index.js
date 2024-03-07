class XAPIVerbs {
  constructor() {
    this.INITIALIZED = XAPIVerbs.INITIALIZED;
    this.TERMINATED = XAPIVerbs.TERMINATED;
    this.SUSPENDED = XAPIVerbs.SUSPENDED;
    this.RESUMED = XAPIVerbs.RESUMED;
    this.PASSED = XAPIVerbs.PASSED;
    this.FAILED = XAPIVerbs.FAILED;
    this.SCORED = XAPIVerbs.SCORED;
    this.COMPLETED = XAPIVerbs.COMPLETED;
    this.RESPONDED = XAPIVerbs.RESPONDED;
    this.COMMENTED = XAPIVerbs.COMMENTED;
    this.VOIDED = XAPIVerbs.VOIDED;
    this.PROGRESSED = XAPIVerbs.PROGRESSED;
    this.ANSWERED = XAPIVerbs.ANSWERED;
  }

  static INITIALIZED = {
    id: 'https://adlnet.gov/expapi/verbs/initialized',
    display: {
      'en-US': 'initialized',
    },
  };

  static TERMINATED = {
    id: 'https://adlnet.gov/expapi/verbs/terminated',
    display: {
      'en-US': 'terminated',
    },
  };

  static SUSPENDED = {
    id: 'https://adlnet.gov/expapi/verbs/suspended',
    display: {
      'en-US': 'suspended',
    },
  };

  static RESUMED = {
    id: 'https://adlnet.gov/expapi/verbs/resumed',
    display: {
      'en-US': 'resumed',
    },
  };

  static PASSED = {
    id: 'https://adlnet.gov/expapi/verbs/passed',
    display: {
      'en-US': 'passed',
    },
  };

  static FAILED = {
    id: 'https://adlnet.gov/expapi/verbs/failed',
    display: {
      'en-US': 'failed',
    },
  };

  static SCORED = {
    id: 'https://adlnet.gov/expapi/verbs/scored',
    display: {
      'en-US': 'scored',
    },
  };

  static COMPLETED = {
    id: 'https://adlnet.gov/expapi/verbs/completed',
    display: {
      'en-US': 'completed',
    },
  };

  static RESPONDED = {
    id: 'https://adlnet.gov/expapi/verbs/responded',
    display: {
      'en-US': 'responded',
    },
  };

  static COMMENTED = {
    id: 'https://adlnet.gov/expapi/verbs/commented',
    display: {
      'en-US': 'commented',
    },
  };

  static VOIDED = {
    id: 'https://adlnet.gov/expapi/verbs/voided',
    display: {
      'en-US': 'voided',
    },
  };

  static PROGRESSED = {
    id: 'https://adlnet.gov/expapi/verbs/progressed',
    display: {
      'en-US': 'progressed',
    },
  };

  static ANSWERED = {
    id: 'https://adlnet.gov/expapi/verbs/answered',
    display: {
      'en-US': 'answered',
    },
  };
}

module.exports = {
  XAPIVerbs,
};

// Test
