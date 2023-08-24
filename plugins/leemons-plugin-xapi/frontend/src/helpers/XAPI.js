import { Verbs } from './Verbs';
import addStatement from '../request/addStatement';

export class XAPI {
  static VERBS = Verbs;

  static addLearningStatement = function (statement) {
    return addStatement({ ...statement, type: 'learning' });
  };

  static addLogStatement = function (statement) {
    return addStatement({ ...statement, type: 'log' });
  };
}
