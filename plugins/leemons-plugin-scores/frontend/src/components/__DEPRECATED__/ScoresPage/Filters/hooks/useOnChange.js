import React from 'react';

export default function useOnChange(selectedClass, selectedPeriod, onChange) {
  React.useEffect(() => {
    if (selectedClass && selectedPeriod.isComplete) {
      onChange({
        period: selectedPeriod,
        program: selectedClass?.program,
        subject: selectedClass?.subject?.id,
        group: selectedClass?.groups?.id,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
        class: selectedClass,
        isCustom: selectedPeriod.isCustom,
      });
    }
  }, [JSON.stringify(selectedClass), JSON.stringify(selectedPeriod)]);
}
