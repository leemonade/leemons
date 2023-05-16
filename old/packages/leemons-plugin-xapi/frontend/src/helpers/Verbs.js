class Verbs {
  constructor() {
    this.INITIALIZED = Verbs.INITIALIZED;
    this.TERMINATED = Verbs.TERMINATED;
    this.SUSPENDED = Verbs.SUSPENDED;
    this.RESUMED = Verbs.RESUMED;
    this.PASSED = Verbs.PASSED;
    this.FAILED = Verbs.FAILED;
    this.SCORED = Verbs.SCORED;
    this.COMPLETED = Verbs.COMPLETED;
    this.RESPONDED = Verbs.RESPONDED;
    this.COMMENTED = Verbs.COMMENTED;
    this.VOIDED = Verbs.VOIDED;
    this.PROGRESSED = Verbs.PROGRESSED;
    this.ANSWERED = Verbs.ANSWERED;
  }

  static INITIALIZED = {
    id: 'http://adlnet.gov/expapi/verbs/initialized',
    display: {
      'en-US': 'initialized',
    },
  };

  static TERMINATED = {
    id: 'http://adlnet.gov/expapi/verbs/terminated',
    display: {
      'en-US': 'terminated',
    },
  };

  static SUSPENDED = {
    id: 'http://adlnet.gov/expapi/verbs/suspended',
    display: {
      'en-US': 'suspended',
    },
  };

  static RESUMED = {
    id: 'http://adlnet.gov/expapi/verbs/resumed',
    display: {
      'en-US': 'resumed',
    },
  };

  static PASSED = {
    id: 'http://adlnet.gov/expapi/verbs/passed',
    display: {
      'en-US': 'passed',
    },
  };

  static FAILED = {
    id: 'http://adlnet.gov/expapi/verbs/failed',
    display: {
      'en-US': 'failed',
    },
  };

  static SCORED = {
    id: 'http://adlnet.gov/expapi/verbs/scored',
    display: {
      'en-US': 'scored',
    },
  };

  static COMPLETED = {
    id: 'http://adlnet.gov/expapi/verbs/completed',
    display: {
      'en-US': 'completed',
    },
  };

  static RESPONDED = {
    id: 'http://adlnet.gov/expapi/verbs/responded',
    display: {
      'en-US': 'responded',
    },
  };

  static COMMENTED = {
    id: 'http://adlnet.gov/expapi/verbs/commented',
    display: {
      'en-US': 'commented',
    },
  };

  static VOIDED = {
    id: 'http://adlnet.gov/expapi/verbs/voided',
    display: {
      'en-US': 'voided',
    },
  };

  static PROGRESSED = {
    id: 'http://adlnet.gov/expapi/verbs/progressed',
    display: {
      'en-US': 'progressed',
    },
  };

  static ANSWERED = {
    id: 'http://adlnet.gov/expapi/verbs/answered',
    display: {
      'en-US': 'answered',
    },
  };
}

module.exports = { Verbs };
