interface XAPIVerbDefinition {
  id: string;
  display: {
    'en-US': string;
  };
}

export class XAPIVerbs {
  public readonly INITIALIZED: XAPIVerbDefinition;
  public readonly TERMINATED: XAPIVerbDefinition;
  public readonly SUSPENDED: XAPIVerbDefinition;
  public readonly RESUMED: XAPIVerbDefinition;
  public readonly PASSED: XAPIVerbDefinition;
  public readonly FAILED: XAPIVerbDefinition;
  public readonly SCORED: XAPIVerbDefinition;
  public readonly COMPLETED: XAPIVerbDefinition;
  public readonly RESPONDED: XAPIVerbDefinition;
  public readonly COMMENTED: XAPIVerbDefinition;
  public readonly VOIDED: XAPIVerbDefinition;
  public readonly PROGRESSED: XAPIVerbDefinition;
  public readonly ANSWERED: XAPIVerbDefinition;

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

  static readonly INITIALIZED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/initialized',
    display: {
      'en-US': 'initialized',
    },
  };

  static readonly TERMINATED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/terminated',
    display: {
      'en-US': 'terminated',
    },
  };

  static readonly SUSPENDED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/suspended',
    display: {
      'en-US': 'suspended',
    },
  };

  static readonly RESUMED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/resumed',
    display: {
      'en-US': 'resumed',
    },
  };

  static readonly PASSED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/passed',
    display: {
      'en-US': 'passed',
    },
  };

  static readonly FAILED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/failed',
    display: {
      'en-US': 'failed',
    },
  };

  static readonly SCORED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/scored',
    display: {
      'en-US': 'scored',
    },
  };

  static readonly COMPLETED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/completed',
    display: {
      'en-US': 'completed',
    },
  };

  static readonly RESPONDED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/responded',
    display: {
      'en-US': 'responded',
    },
  };

  static readonly COMMENTED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/commented',
    display: {
      'en-US': 'commented',
    },
  };

  static readonly VOIDED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/voided',
    display: {
      'en-US': 'voided',
    },
  };

  static readonly PROGRESSED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/progressed',
    display: {
      'en-US': 'progressed',
    },
  };

  static readonly ANSWERED: XAPIVerbDefinition = {
    id: 'https://adlnet.gov/expapi/verbs/answered',
    display: {
      'en-US': 'answered',
    },
  };
}
