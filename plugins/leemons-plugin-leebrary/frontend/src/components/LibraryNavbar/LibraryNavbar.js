import React, { useCallback, useMemo, useState } from 'react';
import { isFunction } from 'lodash';
import {
  Box,
  Button,
  Divider,
  DropdownButton,
  FileUpload,
  IconButton,
  Paper,
  ScrollArea,
  SimpleBar,
  Stack,
  Text,
} from '@bubbles-ui/components';
import { PluginKimIcon, PluginLeebraryIcon } from '@bubbles-ui/icons/solid';
import {
  BookPagesIcon,
  CloudUploadIcon,
  ManWomanIcon,
  RemoveIcon,
} from '@bubbles-ui/icons/outline';
import { LibraryNavbarItem as NavbarItem } from './LibraryNavbarItem';
import { LibraryNavbarStyles } from './LibraryNavbar.styles';
import { LIBRARY_NAVBAR_DEFAULT_PROPS, LIBRARY_NAVBAR_PROP_TYPES } from './LibraryNavbar.constants';

const LibraryNavbar = ({
  labels,
  categories,
  selectedCategory,
  subjects,
  showSharedsWithMe,
  onNavShared,
  onNav,
  onNavSubject,
  onFile,
  onNew,
  useNewCreateButton = true,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [subjectsOpened, setSubjectsOpened] = useState(true);

  const onFileHandler = (e) => {
    isFunction(onFile) && onFile(e);
    setShowUpload(false);
    setTimeout(() => {
      setShowUpload(true);
      setIsExpanded(false);
    }, 100);
  };

  const onNewHandler = (category) => {
    isFunction(onNew) && onNew(category);
    setShowUpload(false);
    setTimeout(() => {
      setShowUpload(true);
      setIsExpanded(false);
    }, 100);
  };

  const onNavHandler = (category) => {
    isFunction(onNav) && onNav(category);
  };

  const quickAccessSelected = useMemo(
    () => !selectedCategory || selectedCategory === '' || selectedCategory < 1,
    [selectedCategory]
  );

  const renderNavbarItems = useCallback(
    (callback, onlyCreatable = false, ignoreSelected = false) => {
      if (onlyCreatable && useNewCreateButton) {
        return categories
          .filter((item) => item.creatable === true)
          .map((category) => ({
            icon: category.icon,
            label: category.name,
            onClick: () => {
              callback(category);
            },
          }));
      }

      const result = [
        ...categories
          .filter((item) => (onlyCreatable ? item.creatable === true : true))
          .map((category) => (
            <NavbarItem
              key={category.id}
              icon={category.icon}
              label={category.name}
              loading={loading}
              selected={
                !ignoreSelected &&
                (category.id === selectedCategory || category.key === selectedCategory)
              }
              onClick={() => callback(category)}
            />
          )),
      ];

      if (subjects && subjects.length) {
        result.push(
          <NavbarItem
            key={'student-subjects'}
            icon={<BookPagesIcon />}
            label={labels.subjects}
            loading={loading}
            selected={false}
            canOpen
            opened={subjectsOpened}
            onClick={() => {
              setSubjectsOpened(!subjectsOpened);
            }}
          >
            <ScrollArea style={{ height: 300, maxWidth: '100%' }}>
              {subjects.map((subject) => {
                return (
                  <Box
                    onClick={() => onNavSubject(subject)}
                    sx={(theme) => ({
                      display: 'flex',
                      flexDirection: 'row',
                      gap: theme.spacing[2],
                      alignItems: 'center',
                      padding: `${theme.spacing[2]}px ${theme.spacing[4]}px`,
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === subject.id && theme.colors.mainWhite,
                      '&:hover': {
                        backgroundColor:
                          selectedCategory !== subject.id && theme.colors.interactive03,
                      },
                    })}
                  >
                    <Box
                      sx={() => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 24,
                        minHeight: 24,
                        maxWidth: 24,
                        maxHeight: 24,
                        borderRadius: '50%',
                        backgroundColor: subject?.color,
                        backgroundImage: 'url(' + subject?.image + ')',
                        backgroundSize: 'cover',
                      })}
                    />
                    <Text>{subject.name}</Text>
                  </Box>
                );
              })}
            </ScrollArea>
          </NavbarItem>
        );
      }
      return result;
    },
    [categories, selectedCategory, loading, subjectsOpened, subjects, showSharedsWithMe]
  );

  const { classes, cx } = LibraryNavbarStyles({ isExpanded }, { name: 'LibraryNavbar' });
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <PluginLeebraryIcon height={24} width={24} />
        <Text className={classes.title}>{labels.title}</Text>
      </Box>
      <SimpleBar className={classes.navItems}>
        <Stack direction={'column'} fullWidth>
          {useNewCreateButton ? (
            <Box sx={(theme) => ({ padding: theme.spacing[2] })}>
              <DropdownButton
                sx={() => ({ width: '100%' })}
                children={labels.uploadButton}
                data={renderNavbarItems(onNewHandler, true, true)}
              />
            </Box>
          ) : null}
          <NavbarItem
            icon={<PluginKimIcon />}
            label={labels.quickAccess}
            onClick={() => onNavHandler(null)}
            selected={quickAccessSelected}
          />
          {showSharedsWithMe ? (
            <NavbarItem
              key={'shared-with-me'}
              icon={<ManWomanIcon />}
              label={labels.sharedWithMe}
              loading={loading}
              selected={selectedCategory === 'shared-with-me'}
              onClick={() => onNavShared('shared-with-me')}
            />
          ) : null}

          <Divider style={{ marginBlock: 8, marginInline: 10 }} />
          {renderNavbarItems(onNavHandler)}
        </Stack>
        {!useNewCreateButton ? (
          <Paper
            className={classes.navbarBottom}
            shadow={!isExpanded ? 'none' : 'level03'}
            padding={0}
          >
            <Box className={classes.uploadButton}>
              <Button
                size={'sm'}
                fullWidth
                rightIcon={<CloudUploadIcon />}
                onClick={() => setIsExpanded(true)}
              >
                {labels.uploadButton}
              </Button>
            </Box>

            <Stack direction={'column'} className={classes.navbarTopSubWrapper} fullWidth>
              <Stack
                direction={'column'}
                alignItems={'center'}
                spacing={2}
                className={classes.fileUploadWrapper}
                skipFlex
              >
                {isExpanded && (
                  <Stack spacing={1} alignItems={'center'} fullWidth>
                    <Box style={{ flex: 1 }}>
                      <Text transform="uppercase" className={classes.sectionTitle}>
                        {labels.createNewTitle}
                      </Text>
                    </Box>
                    <Box>
                      <IconButton icon={<RemoveIcon />} onClick={() => setIsExpanded(false)} />
                    </Box>
                  </Stack>
                )}
              </Stack>

              <Stack
                direction={'column'}
                alignItems={'start'}
                className={classes.navbarTopList}
                skipFlex
              >
                {renderNavbarItems(onNewHandler, true, true)}
                <Text transform="uppercase" className={classes.sectionTitle}>
                  {labels.uploadTitle}
                </Text>
                {showUpload && (
                  <Box className={classes.fileUpload}>
                    <FileUpload
                      icon={<CloudUploadIcon height={32} width={32} />}
                      title={labels.fileUploadTitle}
                      subtitle={labels.fileUploadSubtitle}
                      hideUploadButton
                      single
                      onChange={onFileHandler}
                    />
                  </Box>
                )}
              </Stack>
            </Stack>
          </Paper>
        ) : null}
      </SimpleBar>
    </Box>
  );
};

LibraryNavbar.defaultProps = LIBRARY_NAVBAR_DEFAULT_PROPS;
LibraryNavbar.propTypes = LIBRARY_NAVBAR_PROP_TYPES;

export { LibraryNavbar };
