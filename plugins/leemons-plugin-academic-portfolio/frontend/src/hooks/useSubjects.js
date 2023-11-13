import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { getSubjectDetails, getSubjectsCredits } from '../request/subjects';

export default function useSubjects(subjectsIds, { ...options }) {
  const { data, isLoading } = useQuery(
    ['subjects', subjectsIds],
    async () => {
      if (!subjectsIds?.length) {
        return [];
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

      return subjectsData.map((subjectData) => ({
        id: subjectData.id,
        name: subjectData.name,
        program: subjectData.program,
        course: subjectData.course,
        icon: prepareAsset(subjectData?.icon)?.cover,
        image: prepareAsset(subjectData?.image)?.cover,
        internalId: creditsData.find((credit) => credit.subject === subjectData.id)
          ?.compiledInternalId,
      }));
    },
    { ...options }
  );

  return {
    data,
    isLoading,
  };
}
