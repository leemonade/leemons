import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isFunction, groupBy, isEmpty } from 'lodash';
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
import { getProgramsNamesRequest } from '@leebrary/request';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import { CloudUploadIcon, RemoveIcon } from '@bubbles-ui/icons/outline';

import { LibraryNavbarItem as NavbarItem } from './LibraryNavbarItem';
import { LibraryNavbarStyles } from './LibraryNavbar.styles';
import { LIBRARY_NAVBAR_DEFAULT_PROPS, LIBRARY_NAVBAR_PROP_TYPES } from './LibraryNavbar.constants';

const LibraryNavbar = ({
  labels,
  categories,
  selectedCategory,
  subjects,
  showSharedWithMe,
  onNavShared,
  onNav,
  onNavSubject,
  onFile,
  onNew,
  useNewCreateButton = true,
  loading,
  isStudent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [programsDropdownInfo, setProgramsDropdownInfo] = useState(null);

  const callGetProgramsNames = async () => {
    const response = await getProgramsNamesRequest({
      programsIds: subjects?.map((item) => item.program),
    });

    if (!isEmpty(response?.data)) {
      const programsInfo = {};
      Object.keys(response.data).forEach((programId) => {
        programsInfo[programId] = { name: response.data[programId], dropdownOpen: false };
      });
      setProgramsDropdownInfo(programsInfo);
    }
  };

  useEffect(() => {
    if (subjects?.length) {
      callGetProgramsNames();
    }
  }, [subjects]);

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

  // TODO: this is a temporary fix, categories should bring a property to know if it is a content asset or an activity asset from backend.
  const contentAssetsKeys = [
    'bookmarks',
    'media-files',
    'assignables.scorm',
    'assignables.content-creator',
  ];

  const getSubjectsDropdown = () => {
    const subjectsByProgram = groupBy(subjects, 'program');
    return (
      <>
        {Object.keys(subjectsByProgram).map((programId) => (
          <NavbarItem
            key={'student-subjects'}
            icon={'/public/leebrary/program.svg'}
            label={programsDropdownInfo?.[programId].name}
            loading={loading}
            selected={false}
            canOpen
            opened={programsDropdownInfo?.[programId].dropdownOpen}
            onClick={() => {
              setProgramsDropdownInfo((current) => {
                const updatedPrograms = { ...current };
                updatedPrograms[programId].dropdownOpen = !updatedPrograms[programId].dropdownOpen;
                return updatedPrograms;
              });
            }}
          >
            <ScrollArea style={{ maxWidth: '100%' }}>
              <Box key={`program-${programId}`} style={{ padding: '0 0 0 16px', marginInline: 8 }}>
                {subjectsByProgram[programId].map((subject) => (
                  <Box
                    key={JSON.stringify(subject)}
                    onClick={() => onNavSubject(subject, programId)}
                    sx={(theme) => ({
                      display: 'flex',
                      position: 'relative',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: `8px`,
                      cursor: 'pointer',
                      backgroundColor:
                        selectedCategory === subject.id && theme.other.core.color.primary['200'],
                      '&:hover': {
                        backgroundColor:
                          selectedCategory !== subject.id && theme.other.core.color.primary['100'],
                      },
                      borderLeft: '1px solid #dde1e6',
                    })}
                  >
                    <Box
                      sx={(theme) => ({
                        position: 'absolute',
                        left: '-1px',
                        width: 3,
                        height: '100%',
                        backgroundColor:
                          selectedCategory === subject.id && theme.other.core.color.primary['300'],
                      })}
                    />
                    <SubjectItemDisplay subjectsIds={[subject.id]} />
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </NavbarItem>
        ))}
      </>
    );
  };

  const renderNavbarItems = useCallback(
    ({ callback, typeOfItem, onlyCreatable = false, ignoreSelected = false }) => {
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

      if (typeOfItem !== 'subjects') {
        return [
          ...categories
            .filter((item) => (onlyCreatable ? item.creatable === true : true))
            .filter((item) => {
              if (typeOfItem === 'contentAssets') return contentAssetsKeys.includes(item.key);
              if (typeOfItem === 'activityAssets') return !contentAssetsKeys.includes(item.key);
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
      }

      if (typeOfItem === 'subjects' && subjects?.length > 0) {
        return getSubjectsDropdown();
      }
    },
    [categories, selectedCategory, loading, subjects, showSharedWithMe, programsDropdownInfo]
  );

  const { classes, cx } = LibraryNavbarStyles({ isExpanded }, { name: 'LibraryNavbar' });
  return (
    <Box className={classes.root}>
      <ScrollArea className={classes.navItems}>
        <Stack direction={'column'} fullWidth>
          {useNewCreateButton ? (
            <Box sx={() => ({ padding: 12 })}>
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
            icon={'/public/leebrary/recent.svg'}
            label={labels.recent}
            onClick={() => onNavHandler({ key: 'leebrary-recent' })}
            selected={selectedCategory === 'leebrary-recent'}
          />
          <NavbarItem
            icon={'/public/leebrary/favorite.svg'}
            label={labels.quickAccess}
            onClick={() => onNavHandler(null)}
            selected={selectedCategory === 'pins'}
          />
          {showSharedWithMe ? (
            <NavbarItem
              icon={'/public/leebrary/shared-with-me.svg'}
              label={labels.sharedWithMe}
              loading={loading}
              selected={selectedCategory === 'leebrary-shared'}
              onClick={() => onNavShared('leebrary-shared')}
            />
          ) : null}

          <Divider style={{ marginBlock: 24, marginInline: 10 }} />
          {renderNavbarItems({ callback: onNavHandler, typeOfItem: 'contentAssets' })}
          <Divider style={{ marginBlock: 24, marginInline: 10 }} />
          {renderNavbarItems({ callback: onNavHandler, typeOfItem: 'activityAssets' })}
          {isStudent && (
            <>
              <Divider style={{ marginBlock: 24, marginInline: 10 }} />
              {renderNavbarItems({ callback: onNavHandler, typeOfItem: 'subjects' })}
            </>
          )}
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
