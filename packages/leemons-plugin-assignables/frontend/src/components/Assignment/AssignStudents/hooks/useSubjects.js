import { useState, useEffect } from 'react';
import { getSubjectDetails } from '@academic-portfolio/request/subjects';

export default function useSubjects(task) {
  const [data, setData] = useState([]);
  const { subjects } = task;

  useEffect(async () => {
    if (!subjects?.length) {
      return;
    }

    const s = await Promise.all(subjects.map(({ subject }) => getSubjectDetails(subject)));
    setData(
      s.map(({ data: subjectData }) => ({
        label: subjectData.name,
        value: subjectData.id,
      }))
    );
  }, [subjects]);

  return data;
}
