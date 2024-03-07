import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Title } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useNyaStyles } from '../hooks';

export default function Header({ titleLabel, linkLabel, count, linkTo }) {
  const { classes } = useNyaStyles();

  return (
    <Box className={classes.sectionHeader}>
      <Title className={classes.sectionTitle}>
        {titleLabel} {count !== null && `(${count})`}
      </Title>
      <Link to={linkTo}>
        <Button variant="link" rightIcon={<ChevRightIcon />}>
          {linkLabel}
        </Button>
      </Link>
    </Box>
  );
}

Header.propTypes = {
  titleLabel: PropTypes.string,
  linkLabel: PropTypes.string,
  count: PropTypes.number,
};
