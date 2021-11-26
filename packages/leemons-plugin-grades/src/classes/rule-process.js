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
        if (userCredits[condition.sourceId]) {
          toEval += `${userCredits[condition.sourceId]} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
        } else {
          toEval = 'false';
        }
      } else if (condition.data === 'gpa') {
        const coursesGPA = this.getUserGPAInCourses();
        toEval = `${coursesGPA[condition.sourceId]} ${
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
        if (userCredits[condition.sourceId]) {
          toEval += `${userCredits[condition.sourceId]} ${
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
        toEval = `${gpas[condition.sourceId]} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      }
    }
    // --- SUBJECT ---
    else if (condition.source === 'subject') {
      if (condition.data === 'grade') {
        if (!_.isNil(this.notes[condition.sourceId])) {
          toEval += `${this.getSubjectCreditsIfPromote(condition.sourceId)} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
        } else {
          toEval = 'false';
        }
      } else if (condition.data === 'enrolled') {
        toEval = this.userAgentSubjects.indexOf(condition.sourceId) >= 0 ? 'true' : 'false';
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

  getUserCreditsInSubjectTypesForCourse() {
    const data = {};
    _.forIn(this.subjectTypesCourseSubjectsBySubjectTypeCourseId, (subjects, key) => {
      if (!data[key]) data[key] = 0;
      _.forEach(subjects, (subjectId) => {
        data[key] += this.getSubjectCreditsIfPromote(subjectId);
      });
    });
    return data;
  }

  getUserCreditsInSubjectTypes() {
    const subjectTypes = {};
    _.forIn(this.subjectTypesSubjectsBySubjectTypeId, (subjects, subjectTypeId) => {
      if (!subjectTypes[subjectTypeId]) subjectTypes[subjectTypeId] = 0;
      _.forEach(subjects, (subjectId) => {
        subjectTypes[subjectTypeId] += this.getSubjectCreditsIfPromote(subjectId);
      });
    });
    return subjectTypes;
  }

  getUserCreditsInKnowledgesForCourse() {
    const data = {};
    _.forIn(this.knowledgeCourseSubjectsByKnowledgeCourseId, (subjects, key) => {
      if (!data[key]) data[key] = 0;
      _.forEach(subjects, (subjectId) => {
        data[key] += this.getSubjectCreditsIfPromote(subjectId);
      });
    });
    return data;
  }

  getUserCreditsInKnowledges() {
    const knowledges = {};
    _.forIn(this.knowledgeSubjectsByKnowledgeId, (subjects, knowledgeId) => {
      if (!knowledges[knowledgeId]) knowledges[knowledgeId] = 0;
      _.forEach(subjects, (subjectId) => {
        knowledges[knowledgeId] += this.getSubjectCreditsIfPromote(subjectId);
      });
    });
    return knowledges;
  }

  getUserCreditsInCourses() {
    const courses = {};
    _.forIn(this.courseSubjectsByCourseId, (subjects, courseId) => {
      if (!courses[courseId]) courses[courseId] = 0;
      _.forEach(subjects, (subjectId) => {
        courses[courseId] += this.getSubjectCreditsIfPromote(subjectId);
      });
    });
    return courses;
  }

  getUserGPAInCourses() {
    const courses = {};
    _.forIn(this.courseSubjectsByCourseId, (subjects, courseId) => {
      let total = 0;
      _.forEach(subjects, (subjectId) => {
        total += this.getSubjectNote(subjectId);
      });
      courses[courseId] = total / subjects.length;
    });
    return courses;
  }

  getUserGPAInSubjectTypes() {
    const data = {};
    _.forIn(this.subjectTypesSubjectsBySubjectTypeId, (subjects, id) => {
      let total = 0;
      _.forEach(subjects, (subjectId) => {
        total += this.getSubjectNote(subjectId);
      });
      data[id] = total / subjects.length;
    });
    return data;
  }

  getUserGPAInKnowledges() {
    const data = {};
    _.forIn(this.knowledgeSubjectsByKnowledgeId, (subjects, id) => {
      let total = 0;
      _.forEach(subjects, (subjectId) => {
        total += this.getSubjectNote(subjectId);
      });
      data[id] = total / subjects.length;
    });
    return data;
  }

  getSubjectCreditsIfPromote(subjectId) {
    const note = this.notes[subjectId] || -1;
    if (note >= this.minNoteToPromote) {
      return this.subjectByIds[subjectId].credits;
    }
    return 0;
  }

  getSubjectNote(subjectId) {
    return this.notes[subjectId] || 0;
  }

  getUserCreditsInProgram() {
    let credits = 0;
    _.forIn(this.subjectByIds, (subject) => {
      credits += this.getSubjectCreditsIfPromote(subject.id);
    });
    return credits;
  }

  getUserGPAInProgram() {
    let total = 0;
    let totalSubjects = 0;
    _.forIn(this.subjectByIds, (subject) => {
      total += this.getSubjectNote(subject.id);
      totalSubjects++;
    });
    return total / totalSubjects;
  }

  process() {
    this.checkIfAllDataIsProvided();
    this.prepareDataForProcess();
    return this.processGroup(this.ruleConditions.tree, '-');
  }
}

module.exports = { RuleProcess };
