import React from 'react';
import { Text } from '@bubbles-ui/components';
import { useProgramDetail } from '@academic-portfolio/hooks';

function getNotebookTitle({ subject, filters, isStudent, programName }) {
  if (isStudent) {
    return (
      <Text strong color="primary" size="md">
        {programName}
      </Text>
    );
  }

  if (!subject) {
    return <Text></Text>;
  }

  const subjectGroupToUse = subject.find((s) => s.groups?.id === filters.group);

  if (!subjectGroupToUse) {
    return <Text></Text>;
  }

  const subjectName = subjectGroupToUse.subject.name;
  const className = subjectGroupToUse.groups?.name;

  if (className) {
    return (
      <Text strong color="primary" size="md">
        {subjectName} - {className}
      </Text>
    );
  }
  return (
    <Text strong color="primary" size="md">
      {subjectName}
    </Text>
  );
}

function getFinalNotebookTitle({ filters, program }) {
  if (!filters?.program || !filters?.course || !program) {
    return <Text></Text>;
  }

  const data = [
    program.name,
    program.courses.find((course) => course.id === filters.course)?.name,
    program.groups.find((group) => group.id === filters.group)?.name,
  ]?.filter(Boolean);

  return (
    <Text strong color="primary" size="md">
      {data.join(' - ')}
    </Text>
  );
}

export function useTitle({ subject, filters, variant, isStudent }) {
  const { data: program } = useProgramDetail(filters?.program, { enabled: !!filters?.program });

  return React.useMemo(() => {
    if (variant === 'notebook') {
      return getNotebookTitle({ subject, filters, isStudent, programName: program?.name });
    }
    if (variant === 'finalNotebook') {
      return getFinalNotebookTitle({ filters, program });
    }

    return null;
  }, [subject, filters, variant, program]);
}

export default useTitle;
