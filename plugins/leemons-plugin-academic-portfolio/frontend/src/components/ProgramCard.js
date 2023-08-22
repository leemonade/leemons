import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Title } from '@bubbles-ui/components';

function ProgramCard({ program, onClick = () => {} }) {
  return (
    <Paper fullWidth onClick={() => onClick(program)}>
      <Title order={4}>{program.name}</Title>
    </Paper>
  );
}

ProgramCard.propTypes = {
  program: PropTypes.object,
  onClick: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ProgramCard };
