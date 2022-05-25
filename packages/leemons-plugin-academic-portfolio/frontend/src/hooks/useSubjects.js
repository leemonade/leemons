import { useState, useEffect } from 'react';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { getSubjectDetails, getSubjectCredits } from '../request/subjects';

export default function useSubjects(subjectsIds) {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const subjectsData = await Promise.all(
      subjectsIds.map(async (subject) => {
        const result = await getSubjectDetails(subject);
        const subjectData = result.data;
        const creditsResult = await getSubjectCredits({
          program: subjectData.program,
          subject: subjectData.id,
        });

        const creditsData = creditsResult.subjectCredits;

        return {
          id: subjectData.id,
          name: subjectData.name,
          program: subjectData.program,
          course: subjectData.course,
          icon: prepareAsset(subjectData?.icon)?.cover,
          image: prepareAsset(subjectData?.image)?.cover,
          internalId: creditsData.internalId,
        };
      })
    );

    setData(subjectsData);
  }, [subjectsIds]);

  return data;
}
