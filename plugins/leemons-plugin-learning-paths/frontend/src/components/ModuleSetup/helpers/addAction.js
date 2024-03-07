import { addAction as _addAction, removeAction } from 'leemons-hooks';

export default function addAction(event, f) {
  _addAction(event, f);

  return () => removeAction(event, f);
}
