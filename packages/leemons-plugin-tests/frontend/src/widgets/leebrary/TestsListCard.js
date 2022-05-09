import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { EditIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import { useHistory } from 'react-router-dom';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const TestsListCard = ({ asset, selected, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { classes } = ListCardStyles({ selected });

  const history = useHistory();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      items.push({
        icon: <ViewOnIcon />,
        children: t('view'),
        onClick: (e) => {
          e.stopPropagation();
          history.push(`/private/tests/detail/${asset.id}`);
        },
      });
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/${asset.id}`);
          },
        });
      }
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="tests"
      className={classes.root}
    />
  );
};

TestsListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
};

export default TestsListCard;
