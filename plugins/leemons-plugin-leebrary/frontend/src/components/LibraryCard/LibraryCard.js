import React, { useState, useMemo } from 'react';
import { isNil } from 'lodash';
import { Box, FileIcon } from '@bubbles-ui/components';
import {
  AssetBookmarkIcon,
  AssetPathIcon,
  AssetTaskIcon,
  PluginCurriculumIcon,
} from '@bubbles-ui/icons/solid';
import { LibraryCardCover } from '../LibraryCardCover';
import { LibraryCardContent } from '../LibraryCardContent';
import { LibraryCardFooter } from '../LibraryCardFooter';
import { LibraryCardStyles } from './LibraryCard.styles';
import { LIBRARY_CARD_DEFAULT_PROPS, LIBRARY_CARD_PROP_TYPES } from './LibraryCard.constants';

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
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { classes, cx } = LibraryCardStyles({ shadow, fullHeight }, { name: 'LibraryCard' });
  const variantIconComponent = useMemo(() => {
    if (!variantIcon) return null;
    return React.cloneElement(variantIcon, {
      style: {
        position: 'relative',
        fontSize: 64,
        width: 55,
        height: 55,
        color: '#B9BEC4',
      },
    });
  }, [variantIcon]);

  return (
    <Box
      className={cx(classes.root, props.className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LibraryCardCover
        {...asset}
        fileIcon={
          {
            bookmark: (
              <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                <AssetBookmarkIcon />
              </Box>
            ),
            path: (
              <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                <AssetPathIcon />
              </Box>
            ),
            task: (
              <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                <AssetTaskIcon />
              </Box>
            ),
            curriculum: (
              <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                <PluginCurriculumIcon />
              </Box>
            ),
          }[variant] ||
          variantIconComponent || (
            <FileIcon
              size={64}
              fileExtension={asset.fileExtension}
              fileType={asset.fileType || variant}
              color={'#B9BEC4'}
              hideExtension
            />
          )
        }
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
      <LibraryCardContent
        {...asset}
        metadata={(Array.isArray(asset.metadata) ? asset.metadata : []).filter(
          (item) => !excludeMetadatas.map((e) => e.toLowerCase()).includes(item.label.toLowerCase())
        )}
        locale={locale}
        variant={variant}
        assigment={assigment}
        fullHeight={fullHeight}
        role={role}
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

export { LibraryCard };
