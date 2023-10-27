import React, { useState } from 'react';
import { isNil } from 'lodash';
import { Box } from '@bubbles-ui/components';
import { LibraryCardSkeleton } from '../LibraryCardSkeleton';
import { LibraryCardCover } from '../LibraryCardCover';
import { LibraryCardFooter } from '../LibraryCardFooter';
import { LibraryCardStyles } from './LibraryCard.styles';
import { LIBRARY_CARD_DEFAULT_PROPS, LIBRARY_CARD_PROP_TYPES } from './LibraryCard.constants';
import { LibraryCardBody } from '../LibraryCardBody';

const LibraryCard = ({
  asset,
  assigment,
  variant,
  variantTitle,
  variantIcon,
  deadlineProps,
  action,
  onAction,
  locale,
  menuItems,
  dashboard,
  isNew,
  role,
  badge,
  shadow,
  subject,
  fullHeight,
  excludeMetadatas,
  isLoading,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { classes, cx } = LibraryCardStyles({ shadow, fullHeight }, { name: 'LibraryCard' });

  if (isLoading) {
    return <LibraryCardSkeleton />;
  }

  return (
    <Box
      className={cx(classes.root, props.className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LibraryCardCover
        {...asset}
        deadlineProps={!isNil(deadlineProps) ? deadlineProps : null}
        locale={locale || deadlineProps?.locale}
        direction={variant === 'assigment' ? 'vertical' : null}
        parentHovered={isHovered}
        menuItems={menuItems}
        dashboard={dashboard}
        isNew={isNew}
        role={role}
        badge={badge}
        subject={subject}
      />
      <LibraryCardBody
        {...asset}
        metadata={(Array.isArray(asset.metadata) ? asset.metadata : []).filter(
          (item) => !excludeMetadatas.map((e) => e.toLowerCase()).includes(item.label.toLowerCase())
        )}
        locale={locale}
        variant={variant}
        assigment={assigment}
        fullHeight={fullHeight}
        role={role}
        subject={subject}
      />
      <LibraryCardFooter
        {...asset}
        variant={variant}
        variantTitle={variantTitle}
        variantIcon={variantIcon}
        action={action}
        onAction={onAction}
        locale={locale}
      />
    </Box>
  );
};

LibraryCard.defaultProps = LIBRARY_CARD_DEFAULT_PROPS;
LibraryCard.propTypes = LIBRARY_CARD_PROP_TYPES;
export default LibraryCard;
export { LibraryCard };
