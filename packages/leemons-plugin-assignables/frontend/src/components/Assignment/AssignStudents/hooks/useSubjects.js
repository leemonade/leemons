import { useState, useEffect } from 'react';
import _ from 'lodash';
import { getSubjectDetails } from '@academic-portfolio/request/subjects';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';

export default function useSubjects(task) {
  const [data, setData] = useState([]);
  let { subjects } = task;

  const { data: classes } = useSessionClasses({}, { enabled: !subjects?.length });
  if (!subjects?.length) {
    subjects =
      classes?.map((klass) => ({
        program: klass.program,
        subject: klass.subject.id,
      })) || [];
  }

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
