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
  constructor(rule, ruleConditions, grade, classes, notes, subjectCredits, mode = 'rule') {
    this.logs = true;
    this.rule = rule;
    this.ruleConditions = ruleConditions;
    this.grade = grade;
    this.classes = classes;
    this.notes = notes;
    this.subjectCredits = subjectCredits;
    this.mode = mode;
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
    this.courseSubjectsByCourseId = {};
    this.subjectByIds = {};
    const subjectCreditsBySubject = _.keyBy(this.subjectCredits, 'subject');
    _.forEach(this.classes, (_class) => {
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
      }
      if (_class.knowledges) this.subjectByIds[_class.subject].knowledges.push(_class.knowledges);
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

    if (condition.source === 'program') {
      // ES: Si la condicion es creditos por programa tenemos que coger todas las notas de las asignaturas cursadas por el alumno en el programa ver cuales a aprobado y sumar sus creditos
      // EN: If the condition is credits by program we have to take all the notes of the subjects taken by the student in the program to see which ones passed and add their credits
      if (condition.data === 'cpp') {
        toEval = `${this.getUserCreditsInProgram()} ${
          conditionOperators[condition.operator]
        } ${this.getConditionTarget(condition)}`;
      } else if (condition.data === 'cpc') {
        const userCredits = this.getUserCreditsInCourses();
        toEval = '';
        let index = 0;
        _.forIn(userCredits, (courseCredits) => {
          toEval += `${index > 0 ? ' && ' : ''}${courseCredits} ${
            conditionOperators[condition.operator]
          } ${this.getConditionTarget(condition)}`;
          index++;
        });
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

  getSubjectCreditsIfPromote(subjectId) {
    const note = this.notes[subjectId] || -1;
    if (note >= this.minNoteToPromote) {
      return this.subjectByIds[subjectId].credits;
    }
    return 0;
  }

  getUserCreditsInProgram() {
    let credits = 0;
    _.forIn(this.subjectByIds, (subject) => {
      credits += this.getSubjectCreditsIfPromote(subject.id);
    });
    return credits;
  }

  process() {
    this.checkIfAllDataIsProvided();
    this.prepareDataForProcess();
    return this.processGroup(this.ruleConditions.tree, '-');
  }
}

module.exports = { RuleProcess };
