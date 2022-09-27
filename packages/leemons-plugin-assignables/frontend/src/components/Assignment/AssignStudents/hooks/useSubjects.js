import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { getSubjectDetails } from '@academic-portfolio/request/subjects';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';

export default function useSubjects(task) {
  const [data, setData] = useState([]);

  const { data: classes } = useSessionClasses({}, { enabled: !task?.subjects?.length });

  const subjects = useMemo(() => {
    if (task?.subjects) {
      return task?.subjects;
    }

    return (
      classes?.map((klass) => ({
        program: klass.program,
        subject: klass.subject.id,
      })) || []
    );
  }, [task?.subjects, classes]);

  useEffect(() => {
    (async () => {
      if (!subjects?.length) {
        return;
      }

      const subjectsData = (await getSubjectDetails(_.map(subjects, 'subject')))?.data;

      setData(
        subjectsData.map((subject) => ({
          label: subject.name,
          value: subject.id,
        }))
      );
    })();
  }, [subjects]);

  return data;
}
