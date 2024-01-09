async function getProgramsNames({ programsIds }) {
  const url = 'v1/academic-portfolio/programs/publicInfo';

  return leemons.api(url, {
    method: 'POST',
    body: { ids: JSON.stringify(programsIds) },
  });
}

export default getProgramsNames;
