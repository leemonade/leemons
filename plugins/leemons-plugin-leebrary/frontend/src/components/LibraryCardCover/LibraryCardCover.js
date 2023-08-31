import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import {
  Badge,
  Box,
  COLORS,
  IconButton,
  ImageLoader,
  Menu,
  Text,
  TextClamp,
  Title,
} from '@bubbles-ui/components';
import { BookmarksIcon, DeleteBinIcon, SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid/';
import { LibraryCardDeadline } from '../LibraryCardDeadline';
import { LibraryCardCoverStyles } from './LibraryCardCover.styles';
import {
  LIBRARY_CARD_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_COVER_PROP_TYPES,
} from './LibraryCardCover.constants';

const LibraryCardCover = ({
  name,
  height,
  cover,
  color,
  blur,
  fileIcon,
  deadlineProps,
  parentHovered,
  menuItems,
  dashboard,
  subject,
  isNew,
  role,
  badge,
  hideDashboardIcons,
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { classes, cx } = LibraryCardCoverStyles(
    { color, height, blur, parentHovered, subjectColor: subject?.color },
    { name: 'LibraryCardCover' }
  );

  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, { iconStyle: { backgroundColor: COLORS.interactive03h } })
        : null,
    [fileIcon]
  );

  useEffect(() => {
    if (!parentHovered && showMenu) {
      setShowMenu(false);
    }
  }, [parentHovered, showMenu]);

  const renderDeadline = () => {
    if (!deadlineProps) return;
    return (
      <Box className={classes.deadline}>
        <LibraryCardDeadline
          {...deadlineProps}
          locale={deadlineProps.locale}
          parentHovered={parentHovered}
          isNew={isNew}
          role={role}
        />
      </Box>
    );
  };

  const renderSubjectAndBadge = () => {
    const components = [];
    if (badge) {
      components.push(
        <Box key={'1'} className={classes.badge}>
          <Badge label={badge} color="stroke" radius="default" closable={false} />
        </Box>
      );
    }
    if (dashboard && subject) {
      components.push(
        <Box key={'2'} className={classes.subject}>
          <Box className={classes.subjectIcon}>
            <ImageLoader forceImage height={12} imageStyles={{ width: 12 }} src={subject.icon} />
          </Box>
          <TextClamp lines={1}>
            <Text color="primary" role="productive" size="xs">
              {subject.name}
            </Text>
          </TextClamp>
        </Box>
      );
    }

    if (!components?.length) {
      return null;
    }

    return components;
    // if (badge) return badgeBox;
  };

  const preventPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const iconRow = (
    <Box className={classes.iconRow}>
      {!isEmpty(menuItems) && (
        <Box style={{ flex: 1 }}>
          <Menu
            opened={showMenu && parentHovered}
            onOpen={() => setShowMenu(true)}
            onClose={() => setShowMenu(false)}
            items={menuItems.map((item) => ({
              ...item,
              className: cx(classes.menuItem, item.className),
            }))}
            position="bottom-start"
            withinPortal={true}
            control={
              <IconButton
                icon={
                  <SettingMenuVerticalIcon width={16} height={16} className={classes.menuIcon} />
                }
                variant={'transparent'}
                size="xs"
                onClick={preventPropagation}
              />
            }
          />
        </Box>
      )}
      {dashboard && !hideDashboardIcons && (
        <>
          <IconButton
            icon={<DeleteBinIcon width={16} height={16} className={classes.menuIcon} />}
            variant={'transparent'}
            size="xs"
          />
          <IconButton
            icon={<BookmarksIcon width={16} height={16} className={classes.menuIcon} />}
            variant={'transparent'}
            size="xs"
          />
        </>
      )}
    </Box>
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.blurryBox}>
        <Box>
          <Box className={classes.color} />
          {iconRow}
        </Box>
        <Box className={classes.titleWrapper}>
          {renderSubjectAndBadge()}
          <TextClamp lines={4}>
            <Title order={5} className={classes.title}>
              {name}
            </Title>
          </TextClamp>
        </Box>
      </Box>
      {renderDeadline()}
      {cover ? (
        <ImageLoader src={cover} height={height} width={'100%'} forceImage />
      ) : (
        <Box className={classes.fileIcon}>{icon}</Box>
      )}
    </Box>
  );
};

LibraryCardCover.defaultProps = LIBRARY_CARD_COVER_DEFAULT_PROPS;
LibraryCardCover.propTypes = LIBRARY_CARD_COVER_PROP_TYPES;

export { LibraryCardCover };
