import React from 'react';
import { useWatch } from 'react-hook-form';

export default function useSelectedClass({ classes, control, classID }) {
  const selectedClass = useWatch({
    control,
    name: 'class',
    defaultValue: null,
  });

  const selectedClassId = classID || selectedClass;

  return React.useMemo(() => {
    if (!selectedClassId || !classes?.length) {
      return null;
    }

    return classes.find((klass) => klass.id === selectedClassId);
  }, [selectedClassId, classes]);
}
