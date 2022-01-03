import React, { useMemo, useEffect, useState } from 'react';
import { keyBy, map } from 'lodash';
import { withLayout } from '@layout/hoc';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest, getPlatformLocalesRequest } from '@users/request';

import { Box } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { listCurriculumRequest } from '../../../request';

function ListCurriculum() {
  const [t] = useTranslateLoader(prefixPN('listCurriculum'));
  const [curriculums, setCurriculums] = useState([]);

  const history = useHistory();

  const load = async () => {
    try {
      const [
        {
          data: { items: _curriculums },
        },
        {
          data: { items: centers },
        },
        { locales },
      ] = await Promise.all([
        listCurriculumRequest({ page: 0, size: 999999 }),
        listCentersRequest({ page: 0, size: 999999 }),
        getPlatformLocalesRequest(),
      ]);

      const localesByCode = keyBy(locales, 'code');
      const centersById = keyBy(centers, 'id');

      setCurriculums(
        map(_curriculums, (curriculum) => ({
          ...curriculum,
          center: centersById[curriculum.center],
          locale: localesByCode[curriculum.locale],
        }))
      );
    } catch (e) {
      console.error('e', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box m={32}>
      {curriculums.map((curriculum) => (
        <Box
          key={curriculum.id}
          style={{ border: '1px solid black' }}
          onClick={() => history.push(`/private/curriculum/${curriculum.id}/step/3`)}
        >
          <Box>{curriculum.center?.name}</Box>
          <Box>{curriculum.name}</Box>
          <Box>{curriculum.locale?.name}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default withLayout(ListCurriculum);
