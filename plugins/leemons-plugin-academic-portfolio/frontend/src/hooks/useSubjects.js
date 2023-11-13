import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { getSubjectDetails, getSubjectsCredits } from '../request/subjects';

const fetchSubjectsData = async (subjectsIds) => {
  if (!subjectsIds?.length) {
    return [];
  }
  const subjectsResult = await getSubjectDetails(subjectsIds);
  return subjectsResult.data;
};

const fetchSubjectsCredits = async (subjectsData) => {
  const creditsResult = await getSubjectsCredits(
    _.map(subjectsData, (subject) => ({
      subject: subject.id,
      program: subject.program,
    }))
  );
  return creditsResult.subjectsCredits;
};

const mapSubjectsData = (subjectsData, creditsData) =>
  subjectsData.map((subjectData) => ({
    id: subjectData.id,
    name: subjectData.name,
    color: subjectData.color,
    program: subjectData.program,
    course: subjectData.course,
    icon: prepareAsset(subjectData?.icon)?.cover,
    image: prepareAsset(subjectData?.image)?.cover,
    internalId: creditsData.find((credit) => credit.subject === subjectData.id)?.compiledInternalId,
  }));

export default function useSubjects(subjectsIds, options) {
  const { data, isLoading } = useQuery(
    ['subjects', subjectsIds],
    async () => {
      const subjectsData = await fetchSubjectsData(subjectsIds);
      const creditsData = await fetchSubjectsCredits(subjectsData);
      return mapSubjectsData(subjectsData, creditsData);
    },
    { ...options }
  );

  return {
    data,
    isLoading,
  };
}
