import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ContextContainer } from '@bubbles-ui/components';

import useMyScoresViewTitle from './hooks/useMyScoresViewTitle';
import MyScoresFilters from './components/MyScoresFilters/MyScoresFilters';
import SubjectsScoreList from './components/SubjectsScoreList/SubjectsScoreList';

export default function MyScores({ filters }) {
  const [localFilters, setFilters] = useState({});
  const title = useMyScoresViewTitle(filters);

  return (
    <ContextContainer title={title}>
      <MyScoresFilters filters={filters} onChange={setFilters} />
      <SubjectsScoreList {...filters} {...localFilters} />
    </ContextContainer>
  );
}

MyScores.propTypes = {
  filters: PropTypes.shape({
    program: PropTypes.string.isRequired,
    course: PropTypes.string,
    subject: PropTypes.string,
    period: PropTypes.object,
  }).isRequired,
};
