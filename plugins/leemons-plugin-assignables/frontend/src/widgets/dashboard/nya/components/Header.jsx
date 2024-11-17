import { Link } from 'react-router-dom';

import { Box, Button, Title } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';

import { useNyaStyles } from '../hooks';

export default function Header({ titleLabel, linkLabel, count, linkTo }) {
  const { classes } = useNyaStyles();

  return (
    <Box className={classes.sectionHeader}>
      <Title className={classes.sectionTitle}>
        {titleLabel} {!!count && `(${count})`}
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
