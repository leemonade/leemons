import React from 'react';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import loadable from '@loadable/component';
import { prepareAsset } from '../helpers/prepareAsset';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/leebrary/${component}.js`)
  );
}

const CardWrapperStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const CardWrapper = ({
  key,
  item,
  headers,
  selected,
  className,
  variant = 'media',
  category,
  ...props
}) => {
  const asset = prepareAsset(item.original);
  const menuItems = [];
  const { classes } = CardWrapperStyles({ selected });

  let Component = LibraryCard;

  if (category?.listCardComponent && category?.pluginOwner) {
    try {
      Component = dynamicImport(category?.pluginOwner, category?.listCardComponent);
    } catch (e) {
      //
    }
  }

  return !isNil(category) ? (
    <Box key={key} {...props}>
      <Component asset={asset} menuItems={menuItems} variant={variant} className={classes.root} />
    </Box>
  ) : null;
};

CardWrapper.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  category: PropTypes.any,
};

export { CardWrapper };
export default CardWrapper;
