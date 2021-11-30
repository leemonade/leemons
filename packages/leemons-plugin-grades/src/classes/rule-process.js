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
    let toEval;

    // --- PROGRAM ---
    if (condition.source === 'program') {
      // ES: Si la condicion es creditos por programa tenemos que coger todas las notas de las asignaturas cursadas por el alumno en el programa ver cuales a aprobado y sumar sus creditos
      // EN: If the condition is credits by program we have to take all the notes of the subjects taken by the student in the program to see which ones passed and add their credits
      if (condition.data === 'cpp') {
        toEval = `${this.getUserCreditsInProgram()} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      }
      // ES: Si la condicion es creditos por curso tenemos que coger los creditos que suma el alumno para cada curso y comprobar si cada uno de los cursos cumple la condicion
      // EN: If the condition is credits by course we have to take the credits that the student adds to each course and check if each one of the courses satisfies the condition
      else if (condition.data === 'cpc') {
        const userCredits = this.getUserCreditsInCourses();
        toEval = '';
        let index = 0;
        _.forIn(userCredits, (courseCredits) => {
          toEval += `${index > 0 ? ' && ' : ''}${courseCredits} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
          index++;
        });
      } else if (condition.data === 'gpa') {
        toEval = `${this.getUserGPAInProgram()} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      }
    }
    // --- COURSE ---
    else if (condition.source === 'course') {
      // ES: Si la condicion es creditos por curso tenemos que coger los creditos que suma el alumno para ese curso y comprobar si cumple la condicion
      // EN: If the condition is credits by course we have to take the credits that the student adds to the course and check if it satisfies the condition
      if (condition.data === 'cpc') {
        const userCredits = this.getUserCreditsInCourses();
        if (userCredits[condition.sourceIds[0]]) {
          toEval += `${userCredits[condition.sourceIds[0]]} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
        } else {
          toEval = 'false';
        }
      } else if (condition.data === 'gpa') {
        const coursesGPA = this.getUserGPAInCourses();
        toEval = `${coursesGPA[condition.sourceIds[0]]} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      }
    }
    // --- SUBJECT TYPE && KNOWLEDGE ---
    else if (condition.source === 'subject-type' || condition.source === 'knowledge') {
      if (condition.data === 'cpp') {
        const func = {
          'subject-type': this.getUserCreditsInSubjectTypes,
          knowledge: this.getUserCreditsInKnowledges,
        };
        const userCredits = func[condition.source]();
        if (userCredits[condition.sourceIds[0]]) {
          toEval += `${userCredits[condition.sourceIds[0]]} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
        }
      } else if (condition.data === 'cpc') {
        const func = {
          'subject-type': this.getUserCreditsInSubjectTypesForCourse,
          knowledge: this.getUserCreditsInKnowledgesForCourse,
        };
        const userCredits = func[condition.source]();
        toEval = '';
        let index = 0;
        _.forIn(userCredits, (courseCredits) => {
          toEval += `${index > 0 ? ' && ' : ''}${courseCredits} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
          index++;
        });
      } else if (condition.data === 'gpa') {
        const func = {
          'subject-type': this.getUserGPAInSubjectTypes,
          knowledge: this.getUserGPAInKnowledges,
        };
        const gpas = func[condition.source]();
        toEval = `${gpas[condition.sourceIds[0]]} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      } else if (condition.data === 'cbcg') {
        const func = {
          'subject-type': this.getUserCreditsInSubjectTypeByCourses,
          knowledge: this.getUserCreditsInKnowledgeByCourses,
        };
        const credits = func[condition.source](condition.sourceIds[0], condition.dataTargets);
        toEval = `${credits} ${conditionOperators[condition.operator]} ${this.getConditionTarget(
          condition
        )}`;
      }
    }
    // --- SUBJECT ---
    else if (condition.source === 'subject') {
      if (condition.data === 'grade') {
        if (!_.isNil(this.notes[condition.sourceIds[0]])) {
          toEval += `${this.getSubjectCreditsIfPromote(condition.sourceIds[0])} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
        } else {
          toEval = 'false';
        }
      } else if (condition.data === 'enrolled') {
        toEval = this.userAgentSubjects.indexOf(condition.sourceIds[0]) >= 0 ? 'true' : 'false';
      }
    }
    // --- SUBJECT GROUP ---
    else if (condition.source === 'subject-group') {
      if (condition.data === 'gpa') {
        toEval += `${this.getUserGPABySubjectIds(condition.sourceIds)} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      } else if (condition.data === 'credits') {
        toEval += `${this.getUserCreditsBySubjectIds(condition.sourceIds)} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      }
    }

    if (toEval) {
      // eslint-disable-next-line no-eval
      const result = eval(toEval);
      if (this.logs) console.log(`C ${lines}: Eval (${toEval}) -> ${result}`);
      return result;
    }

    return false;
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
