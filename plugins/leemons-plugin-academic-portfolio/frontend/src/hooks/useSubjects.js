import { useState, useEffect } from 'react';
import _ from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { getSubjectDetails, getSubjectsCredits } from '../request/subjects';

export default function useSubjects(subjectsIds) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (!subjectsIds.length) {
        return;
      }

      const subjectsResult = await getSubjectDetails(subjectsIds);
      const subjectsData = subjectsResult.data;
      const creditsResult = await getSubjectsCredits(
        _.map(subjectsData, (subject) => ({
          subject: subject.id,
          program: subject.program,
        }))
      );
      const creditsData = creditsResult.subjectsCredits;

      const fullData = subjectsData.map((subjectData) => ({
        id: subjectData.id,
        name: subjectData.name,
        program: subjectData.program,
        course: subjectData.course,
        icon: prepareAsset(subjectData?.icon)?.cover,
        image: prepareAsset(subjectData?.image)?.cover,
        internalId: creditsData.find((credit) => credit.subject === subjectData.id)
          ?.compiledInternalId,
      }));

      setData(fullData);
    })();
  }, [subjectsIds]);

  return data;
}
