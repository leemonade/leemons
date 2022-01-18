const _ = require('lodash');

const groupOperators = {
  and: '&&',
  or: '||',
};

const conditionOperators = {
  gte: '>=',
  lte: '<=',
  gt: '>',
  lt: '<',
  eq: '==',
  neq: '!=',
};

class RuleProcess {
  constructor(rule, ruleConditions, grade, classes, notes, subjectCredits, userAgentClasses) {
    this.logs = true;
    this.rule = rule;
    this.ruleConditions = ruleConditions;
    this.grade = grade;
    this.classes = classes;
    this.notes = notes;
    this.subjectCredits = subjectCredits;
    this.userAgentClasses = userAgentClasses;
  }

  // ES: Comprueba si todos los campos pasados en el constructor estan bien configurados como para poder procesar las reglas
  // EN: Checks if all the fields passed in the constructor are configured properly to be able to process the rules
  checkIfAllDataIsProvided() {
    if (!this.rule) throw new Error('Rule is not provided');
    if (!this.ruleConditions) throw new Error('Rule conditions are not provided');
    if (!this.grade) throw new Error('Grade is not provided');
    if (!this.classes) throw new Error('Classes are not provided');
    if (!this.notes) throw new Error('Notes are not provided');
    if (!this.subjectCredits) throw new Error('Subject credits are not provided');
    if (!this.userAgentClasses) throw new Error('User agent classes are not provided');
    if (!this.grade.minScaleToPromote) throw new Error('Min scale to promote is not provided');
  }

  // ES: Prepara varibales preprocesadas para comodidad del codigo
  // EN: Prepares variables preprocessed for convenience of the code
  prepareDataForProcess() {
    // ES: Comprueba que la scala para aprobar existe
    // EN: Checks that the scale to pass exists
    this.scaleByIds = _.keyBy(this.grade.scales, 'id');
    if (!this.scaleByIds[this.grade.minScaleToPromote])
      throw new Error('Min scale to promote is not valid');

    // ES: Almacenamos el valor a superar para aprobar
    // EN: Store the value to surpass to pass
    this.minNoteToPromote = this.scaleByIds[this.grade.minScaleToPromote].number;

    // ES: Montamos un objeto con todas las asignaturas y sus valores recorriendonos todas las clases
    // EN: We build an object with all the subjects and their values by traversing all the classes
    this.userAgentSubjects = [];
    this.courseSubjectsByCourseId = {};
    this.knowledgeCourseSubjectsByKnowledgeCourseId = {};
    this.subjectTypesCourseSubjectsBySubjectTypeCourseId = {};
    this.knowledgeSubjectsByKnowledgeId = {};
    this.subjectTypesSubjectsBySubjectTypeId = {};
    this.subjectByIds = {};
    const subjectCreditsBySubject = _.keyBy(this.subjectCredits, 'subject');
    const userAgentClassesByClass = _.keyBy(this.userAgentClasses, 'class');
    _.forEach(this.classes, (_class) => {
      if (userAgentClassesByClass[_class.id]) {
        this.userAgentSubjects.push(_class.subject);
      }

      if (!this.subjectByIds[_class.subject]) {
        this.subjectByIds[_class.subject] = {
          id: _class.subject,
          program: _class.program,
          subjectType: _class.subjectType,
          credits: subjectCreditsBySubject[_class.subject]?.credits,
          groups: [],
          courses: [],
          knowledges: [],
          substages: [],
        };

        if (!this.subjectTypesSubjectsBySubjectTypeId[_class.subjectType])
          this.subjectTypesSubjectsBySubjectTypeId[_class.subjectType] = [];
        this.subjectTypesSubjectsBySubjectTypeId[_class.subjectType].push(_class.subject);

        // ES: Si no encontramos los creditos que van en la asignatura devolvemos error por que no vamos a poder procesar las condiciones
        // EN: If we do not find the credits that go in the subject return error because we cannot process the conditions
        if (_.isNil(this.subjectByIds[_class.subject].credits))
          throw new Error('Subject credits are not valid');
      }
      if (_class.groups) this.subjectByIds[_class.subject].groups.push(_class.groups);
      if (_class.courses) {
        this.subjectByIds[_class.subject].courses.push(_class.courses);
        if (!this.courseSubjectsByCourseId[_class.courses])
          this.courseSubjectsByCourseId[_class.courses] = [];
        this.courseSubjectsByCourseId[_class.courses].push(_class.subject);

        const subjectTypeCourseId = `${_class.subjectType}|${_class.courses}`;

        if (!this.subjectTypesCourseSubjectsBySubjectTypeCourseId[subjectTypeCourseId])
          this.subjectTypesCourseSubjectsBySubjectTypeCourseId[subjectTypeCourseId] = [];
        this.subjectTypesCourseSubjectsBySubjectTypeCourseId[subjectTypeCourseId].push(
          _class.subject
        );
      }

      if (_class.knowledges) {
        this.subjectByIds[_class.subject].knowledges.push(_class.knowledges);
        if (!this.knowledgeSubjectsByKnowledgeId[_class.knowledges])
          this.knowledgeSubjectsByKnowledgeId[_class.knowledges] = [];
        this.knowledgeSubjectsByKnowledgeId[_class.knowledges].push(_class.subject);

        if (_class.courses) {
          const knowledgeCourseId = `${_class.knowledges}|${_class.courses}`;
          if (!this.knowledgeCourseSubjectsByKnowledgeCourseId[knowledgeCourseId])
            this.knowledgeCourseSubjectsByKnowledgeCourseId[knowledgeCourseId] = [];
          this.knowledgeCourseSubjectsByKnowledgeCourseId[knowledgeCourseId].push(_class.subject);
        }
      }
      if (_class.substages) this.subjectByIds[_class.subject].substages.push(_class.substages);
    });
  }

  processGroup(group, lines) {
    const values = _.map(group.conditions, (condition) =>
      this.processCondition(condition, `${lines}-`)
    );

    if (values.length) {
      const toEval = values.join(` ${groupOperators[group.operator]} `);
      // eslint-disable-next-line no-eval
      const result = eval(toEval);
      if (this.logs) console.log(`G ${lines}: Eval (${toEval}) -> ${result}`);
      return result;
    }

    return true;
  }

  processCondition(condition, lines) {
    if (condition.group) return this.processGroup(condition.group, `${lines}-`);
    return this.calculeCondition(condition, lines);
  }

  calculeCondition(condition, lines) {
    const skFunctions = {
      'subject-type': {
        cpp: this.getUserCreditsInSubjectTypes.bind(this),
        cpc: this.getUserCreditsInSubjectTypesForCourse.bind(this),
        gpa: this.getUserGPAInSubjectTypes.bind(this),
        cbcg: this.getUserCreditsInSubjectTypeByCourses.bind(this),
      },
      knowledge: {
        cpp: this.getUserCreditsInKnowledges.bind(this),
        cpc: this.getUserCreditsInKnowledgesForCourse.bind(this),
        gpa: this.getUserGPAInKnowledges.bind(this),
        cbcg: this.getUserCreditsInKnowledgeByCourses.bind(this),
      },
    };

    const toEval = {
      autoResult: null,
      from: [],
      target: this.getConditionTarget(condition),
      operator: condition.operator,
    };

    // --- PROGRAM ---
    if (condition.source === 'program') {
      // ES: Si la condicion es creditos por programa tenemos que coger todas las notas de las asignaturas cursadas por el alumno en el programa ver cuales a aprobado y sumar sus creditos
      // EN: If the condition is credits by program we have to take all the notes of the subjects taken by the student in the program to see which ones passed and add their credits
      if (condition.data === 'cpp') {
        toEval.from.push(this.getUserCreditsInProgram());
      }
      // ES: Si la condicion es creditos por curso tenemos que coger los creditos que suma el alumno para cada curso y comprobar si cada uno de los cursos cumple la condicion
      // EN: If the condition is credits by course we have to take the credits that the student adds to each course and check if each one of the courses satisfies the condition
      else if (condition.data === 'cpc') {
        const userCredits = this.getUserCreditsInCourses();
        _.forIn(userCredits, (courseCredits) => {
          toEval.from.push(courseCredits);
        });
      } else if (condition.data === 'gpa') {
        toEval.from.push(this.getUserGPAInProgram());
      }
    }
    // --- COURSE ---
    else if (condition.source === 'course') {
      // ES: Si la condicion es creditos por curso tenemos que coger los creditos que suma el alumno para ese curso y comprobar si cumple la condicion
      // EN: If the condition is credits by course we have to take the credits that the student adds to the course and check if it satisfies the condition
      if (condition.data === 'cpc') {
        const userCredits = this.getUserCreditsInCourses();
        if (!_.isNil(userCredits[condition.sourceIds[0]])) {
          toEval.from.push(userCredits[condition.sourceIds[0]]);
        }
      } else if (condition.data === 'gpa') {
        const coursesGPA = this.getUserGPAInCourses();
        toEval.from.push(coursesGPA[condition.sourceIds[0]]);
      }
    }
    // --- SUBJECT TYPE && KNOWLEDGE ---
    else if (condition.source === 'subject-type' || condition.source === 'knowledge') {
      if (condition.data === 'cpp') {
        const userCredits = skFunctions[condition.source][condition.data]();
        if (!_.isNil(userCredits[condition.sourceIds[0]])) {
          toEval.from.push(userCredits[condition.sourceIds[0]]);
        }
      } else if (condition.data === 'cpc') {
        const userCredits = skFunctions[condition.source][condition.data]();
        _.forIn(userCredits, (courseCredits) => {
          toEval.from.push(courseCredits);
        });
      } else if (condition.data === 'gpa') {
        const gpas = skFunctions[condition.source][condition.data]();
        toEval.from.push(gpas[condition.sourceIds[0]]);
      } else if (condition.data === 'cbcg') {
        const credits = skFunctions[condition.source][condition.data](
          condition.sourceIds[0],
          condition.dataTargets
        );
        toEval.from.push(credits);
      }
    }
    // --- SUBJECT ---
    else if (condition.source === 'subject') {
      if (condition.data === 'grade') {
        if (!_.isNil(this.notes[condition.sourceIds[0]])) {
          toEval.from.push(this.getSubjectCreditsIfPromote(condition.sourceIds[0]));
        }
      } else if (condition.data === 'enrolled') {
        toEval.autoResult = this.userAgentSubjects.indexOf(condition.sourceIds[0]) >= 0;
      }
    }
    // --- SUBJECT GROUP ---
    else if (condition.source === 'subject-group') {
      if (condition.data === 'gpa') {
        toEval.from.push(this.getUserGPABySubjectIds(condition.sourceIds));
      } else if (condition.data === 'credits') {
        toEval.from.push(this.getUserCreditsBySubjectIds(condition.sourceIds));
      }
    }

    try {
      // eslint-disable-next-line no-eval
      const response = RuleProcess.evalFromConfig(toEval);
      if (this.logs)
        console.log(
          `C ${lines}: Eval (${response.eval}) -> ${response.result} | ${condition.source} -> ${condition.data} -> ${condition.operator}`
        );
      return response.result;
    } catch (e) {
      console.error(`Error on process eval: ${toEval} for condition: `, condition);
      throw new Error('Error on eval rules');
    }
  }

  static evalFromConfig(config) {
    const response = {
      result: false,
      eval: '',
    };

    const addEvalString = (from) => {
      response.eval += `${response.eval ? ' && ' : ''}${from} ${
        conditionOperators[config.operator]
      } ${config.target}`;
    };

    if (config.autoResult !== null) {
      response.result = !!config.autoResult;
      response.eval = response.result ? 'true' : 'false';
    } else if (config.from.length > 0) {
      let done = true;
      _.forEach(config.from, (from) => {
        addEvalString(from);
        switch (config.operator) {
          case 'gte':
            if (from < config.target) done = false;
            break;
          case 'lte':
            if (from > config.target) done = false;
            break;
          case 'gt':
            if (from < config.target) done = false;
            break;
          case 'lt':
            if (from > config.target) done = false;
            break;
          case 'eq':
            if (from !== config.target) done = false;
            break;
          case 'neq':
            if (from === config.target) done = false;
            break;
          default:
            done = false;
            break;
        }
      });
      response.result = done;
    }
    return response;
  }

  getConditionTarget(condition) {
    if (condition.targetGradeScale) {
      if (!this.scaleByIds[condition.targetGradeScale])
        throw new Error('Target grade scale is not valid');
      return this.scaleByIds[condition.targetGradeScale].number;
    }
    return condition.target;
  }

  // -- CREDITS --

  getUserCreditsBySubjectIds(subjectIds) {
    let total = 0;
    _.forEach(subjectIds, (subjectId) => {
      total += this.getSubjectCreditsIfPromote(subjectId);
    });
    return total;
  }

  getUserCreditsInData(data) {
    const result = {};
    _.forIn(data, (subjects, key) => {
      result[key] = this.getUserCreditsBySubjectIds(subjects);
    });
    return result;
  }

  getUserCreditsInSubjectTypesForCourse() {
    return this.getUserCreditsInData(this.subjectTypesCourseSubjectsBySubjectTypeCourseId);
  }

  getUserCreditsInSubjectTypes() {
    return this.getUserCreditsInData(this.subjectTypesSubjectsBySubjectTypeId);
  }

  getUserCreditsInKnowledgesForCourse() {
    return this.getUserCreditsInData(this.knowledgeCourseSubjectsByKnowledgeCourseId);
  }

  getUserCreditsInKnowledges() {
    return this.getUserCreditsInData(this.knowledgeSubjectsByKnowledgeId);
  }

  getUserCreditsInCourses() {
    return this.getUserCreditsInData(this.courseSubjectsByCourseId);
  }

  getUserCreditsInProgram() {
    let credits = 0;
    _.forIn(this.subjectByIds, (subject) => {
      credits += this.getSubjectCreditsIfPromote(subject.id);
    });
    return credits;
  }

  getUserCreditsInSubjectTypeOrKnowledgeByCourses(data, targetId, courseIds) {
    let credits = 0;
    const alreadyAddedSubjects = [];
    _.forIn(data, (subjects, key) => {
      const keySplitted = key.split('|');
      if (keySplitted[0] === targetId && courseIds.indexOf(keySplitted[1]) >= 0) {
        _.forEach(subjects, (subjectId) => {
          if (alreadyAddedSubjects.indexOf(subjectId) < 0) {
            credits += this.getSubjectCreditsIfPromote(subjectId);
            alreadyAddedSubjects.push(subjectId);
          }
        });
      }
    });
    return credits;
  }

  getUserCreditsInSubjectTypeByCourses(subjectTypeId, courseIds) {
    return this.getUserCreditsInSubjectTypeOrKnowledgeByCourses(
      this.subjectTypesCourseSubjectsBySubjectTypeCourseId,
      subjectTypeId,
      courseIds
    );
  }

  getUserCreditsInKnowledgeByCourses(knowledgeId, courseIds) {
    return this.getUserCreditsInSubjectTypeOrKnowledgeByCourses(
      this.knowledgeCourseSubjectsByKnowledgeCourseId,
      knowledgeId,
      courseIds
    );
  }

  getSubjectCreditsIfPromote(subjectId) {
    const note = this.notes[subjectId] || -1;
    if (note !== -1 && note >= this.minNoteToPromote) {
      return this.subjectByIds[subjectId].credits;
    }
    return 0;
  }

  // -- GPA (Media) --

  getUserGPABySubjectIds(subjectIds) {
    let total = 0;
    _.forEach(subjectIds, (subjectId) => {
      total += this.getSubjectNote(subjectId);
    });
    return total / subjectIds.length;
  }

  getUserGPAByData(data) {
    const result = {};
    _.forIn(data, (subjects, id) => {
      result[id] = this.getUserGPABySubjectIds(subjects);
    });
    return result;
  }

  getUserGPAInCourses() {
    return this.getUserGPAByData(this.courseSubjectsByCourseId);
  }

  getUserGPAInSubjectTypes() {
    return this.getUserGPAByData(this.subjectTypesSubjectsBySubjectTypeId);
  }

  getUserGPAInKnowledges() {
    return this.getUserGPAByData(this.knowledgeSubjectsByKnowledgeId);
  }

  getUserGPAInProgram() {
    return this.getUserGPABySubjectIds(_.keys(this.subjectByIds));
  }

  getSubjectNote(subjectId) {
    return this.notes[subjectId] || 0;
  }

  process() {
    this.checkIfAllDataIsProvided();
    this.prepareDataForProcess();
    return this.processGroup(this.ruleConditions.tree, '-');
  }
}

module.exports = { RuleProcess };
