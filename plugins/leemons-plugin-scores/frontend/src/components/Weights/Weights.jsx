import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ContextContainer } from '@bubbles-ui/components';
import { SelectSubjectAndCourse } from '@academic-portfolio/components/SelectSubjectAndCourse';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { SubjectsWeightingTable } from './components/SubjectsWeightingTable';

export default function Weights({ program }) {
  const [t] = useTranslateLoader(prefixPN('weighting'));

  const [filters, setFilters] = useState({});
  return (
    <ContextContainer title={t('subjectsAndGroups')}>
      <SelectSubjectAndCourse program={program} onChange={setFilters} />
      <SubjectsWeightingTable filters={filters} program={program} />
    </ContextContainer>
  );
}

Weights.propTypes = {
  program: PropTypes.string.isRequired,
};
