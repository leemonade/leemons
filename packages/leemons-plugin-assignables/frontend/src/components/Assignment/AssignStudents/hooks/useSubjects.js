import { useState, useEffect } from 'react';
import _ from 'lodash';
import { getSubjectDetails } from '@academic-portfolio/request/subjects';

export default function useSubjects(task) {
  const [data, setData] = useState([]);
  const { subjects } = task;

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
