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

  // TODO cambiar esto en backend
  const contentAssetsKeys = [
    'bookmarks',
    'media-files',
    'assignables.scorm',
    'assignables.content-creator',
  ];

  const renderNavbarItems = useCallback(
    ({ callback, typeOfAsset, onlyCreatable = false, ignoreSelected = false }) => {
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
          .filter((item) => {
            if (typeOfAsset === 'contentAssets') return contentAssetsKeys.includes(item.key);
            if (typeOfAsset === 'activities') return !contentAssetsKeys.includes(item.key);
            return true;
          })
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

      if (subjects?.length > 0) {
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
              {subjects.map((subject) => (
                <Box
                  key={JSON.stringify(subject)}
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
              ))}
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
      <ScrollArea className={classes.navItems}>
        <Stack direction={'column'} fullWidth>
          {useNewCreateButton ? (
            <Box sx={(theme) => ({ padding: theme.spacing[2] })}>
              <DropdownButton
                sx={() => ({ width: '100%' })}
                data={renderNavbarItems({
                  callback: onNewHandler,
                  onlyCreatable: true,
                  ignoreSelected: true,
                })}
              >
                {labels.uploadButton}
              </DropdownButton>
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
          {renderNavbarItems({ callback: onNavHandler, typeOfAsset: 'contentAssets' })}
          <Divider style={{ marginBlock: 8, marginInline: 10 }} />
          {renderNavbarItems({ callback: onNavHandler, typeOfAsset: 'activities' })}
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
                {renderNavbarItems({
                  callback: onNewHandler,
                  onlyCreatable: true,
                  ignoreSelected: true,
                })}
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
      </ScrollArea>
    </Box>
  );
};

LibraryNavbar.defaultProps = LIBRARY_NAVBAR_DEFAULT_PROPS;
LibraryNavbar.propTypes = LIBRARY_NAVBAR_PROP_TYPES;

export { LibraryNavbar };


/*
TODO
- El backend debería tener una prop de assetType, refiriendose a si es actividad o solo contenido
- Buscar iconos en el backend de cada plugin para ver el nombre, el icono está en la carpeta public del frontend de cada plugin
  icon y activeIcon apuntan al mismo sitio, normal.
*/
