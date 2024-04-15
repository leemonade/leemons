import { useEffect, useRef } from 'react';

import { useSearchParams } from '@common';

export default function useUpdateEditingClass({
  isLoading,
  sessionClasses,
  editingClass,
  setEditingClass,
}) {
  const queryParams = useSearchParams();
  const lastClassId = useRef(null);

  useEffect(() => {
    const classId = queryParams.get('class');
    if (isLoading || lastClassId.current === classId) {
      return;
    }

    if (queryParams.has('class') && classId !== editingClass?.id) {
      const klass = sessionClasses?.find(({ id }) => id === classId);
      if (klass) {
        lastClassId.current = classId;
        setEditingClass(klass.original);
      }
    } else if (classId === editingClass?.id) {
      lastClassId.current = classId;
    }
  }, [queryParams, sessionClasses, isLoading, setEditingClass, editingClass?.id]);
}
