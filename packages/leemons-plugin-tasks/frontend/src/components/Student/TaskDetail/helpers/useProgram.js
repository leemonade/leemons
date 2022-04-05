import { useApi } from '@common';
import { detailProgramRequest } from '@academic-portfolio/request';

export default function useProgram(programId) {
  const [program] = useApi(detailProgramRequest, programId);

  return program?.program;
}
