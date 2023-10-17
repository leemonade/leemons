import React from 'react';
import PropTypes from 'prop-types';
import { Box, Title, Button } from '@bubbles-ui/components';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { Link } from 'react-router-dom';
import { useNyaStyles } from '../hooks';

export default function Header({ titleLabel, linkLabel, count, linkTo }) {
  const { classes } = useNyaStyles();

  return (
    <Box className={classes.sectionHeader}>
      <Title className={classes.sectionTitle}>
        {titleLabel} {count !== null && `(${count})`}
      </Title>
      <Link to={linkTo}>
        <Button variant="link">{linkLabel}</Button>
      </Link>
    </Box>
  );
}

Header.propTypes = {
  titleLabel: PropTypes.string,
  linkLabel: PropTypes.string,
  count: PropTypes.number,
};
