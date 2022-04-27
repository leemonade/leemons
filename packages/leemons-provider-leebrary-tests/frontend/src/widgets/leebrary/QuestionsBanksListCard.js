import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const QuestionsBanksListCard = ({ asset, selected, ...props }) => {
  const menuItems = [];
  const { classes } = ListCardStyles({ selected });

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="task"
      className={classes.root}
    />
  );
};

QuestionsBanksListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
};

export default QuestionsBanksListCard;
