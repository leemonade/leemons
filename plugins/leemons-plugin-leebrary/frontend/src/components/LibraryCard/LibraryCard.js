import React, { useState } from 'react';

import { Box } from '@bubbles-ui/components';
import { isNil } from 'lodash';

import { LibraryCardBody } from '../LibraryCardBody';
import { LibraryCardCover } from '../LibraryCardCover';
import { LibraryCardEmbed } from '../LibraryCardEmbed';
import { LibraryCardEmbedSkeleton } from '../LibraryCardEmbed/LibraryCardEmbdedSkeleton';
import { LibraryCardFooter } from '../LibraryCardFooter';
import { LibraryCardSkeleton } from '../LibraryCardSkeleton';

import { LIBRARY_CARD_DEFAULT_PROPS, LIBRARY_CARD_PROP_TYPES } from './LibraryCard.constants';
import { LibraryCardStyles } from './LibraryCard.styles';

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
  autoHeight,
  excludeMetadatas,
  isLoading,
  menuItemsLoading,
  embedded,
  isEmbeddedList,
  category,
  isCreationPreview,
  onPin,
  onUnpin,
  onShowMenu,
  hideCanAccess,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { classes, cx } = LibraryCardStyles(
    { shadow, isCreationPreview, fullHeight, autoHeight },
    { name: 'LibraryCard' }
  );
  if (isLoading) {
    return isEmbeddedList ? <LibraryCardEmbedSkeleton /> : <LibraryCardSkeleton />;
  }
  if (isEmbeddedList) {
    return (
      <Box data-cypress-id={`libraryCard-${asset.id}`} sx={(theme) => ({ width: '100%' })}>
        <LibraryCardEmbed asset={asset} category={category} fullWidth hasActionButton />
      </Box>
    );
  }

  return (
    <Box
      data-cypress-id={`libraryCard-${asset.id}`}
      className={cx(classes.root, props.className)}
      onMouseEnter={() => !isCreationPreview && setIsHovered(true)}
      onMouseLeave={() => !isCreationPreview && setIsHovered(false)}
    >
      <LibraryCardCover
        {...asset}
        deadlineProps={!isNil(deadlineProps) ? deadlineProps : null}
        locale={locale || deadlineProps?.locale}
        direction={variant === 'assigment' ? 'vertical' : null}
        menuItems={menuItems}
        dashboard={dashboard}
        parentHovered={isHovered}
        isNew={isNew}
        role={role}
        badge={badge}
        subject={subject}
        variantIcon={variantIcon}
        onShowMenu={onShowMenu}
        menuItemsLoading={menuItemsLoading}
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
        isCreationPreview={isCreationPreview}
        onPin={onPin}
        onUnpin={onUnpin}
      />
      <LibraryCardFooter
        {...asset}
        variant={variant}
        variantTitle={variantTitle}
        variantIcon={variantIcon}
        action={action}
        onAction={onAction}
        locale={locale}
        autoHeight={autoHeight}
        hideCanAccess={hideCanAccess}
      />
    </Box>
  );
};

LibraryCard.defaultProps = LIBRARY_CARD_DEFAULT_PROPS;
LibraryCard.propTypes = LIBRARY_CARD_PROP_TYPES;
export default LibraryCard;
export { LibraryCard };
