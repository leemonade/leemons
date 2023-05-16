import useGrades from './useGrades';

export default function useGrade(evaluation, grade) {
  const grades = useGrades(evaluation);

  return grades?.find((item) => item.id === grade);
}
