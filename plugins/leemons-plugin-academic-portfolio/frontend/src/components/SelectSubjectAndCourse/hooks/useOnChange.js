import { useEffect } from 'react';

import { noop } from 'lodash';
import { useWatch } from 'react-hook-form';

export default function useOnChange({ onChange = noop, control }) {
  const [subject, course] = useWatch({ name: ['subject', 'course'], control });

  useEffect(() => {
    onChange({ subject, course });
  }, [subject, course, onChange]);
}
