import React, { useCallback, useEffect, useState } from 'react';

import { SubjectItemDisplay } from '@academic-portfolio/components';
import { getProgramsPublicInfoRequest } from '@academic-portfolio/request';
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
import { DownloadIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { SESSIONS_CATEGORY_KEYS } from '@leemons/sessions';
import { groupBy, isEmpty, cloneDeep, noop, capitalize } from 'lodash';

import { LIBRARY_NAVBAR_DEFAULT_PROPS, LIBRARY_NAVBAR_PROP_TYPES } from './LibraryNavbar.constants';
import { LibraryNavbarStyles } from './LibraryNavbar.styles';
import { LibraryNavbarItem as NavbarItem } from './LibraryNavbarItem';

const LibraryNavbar = ({
  labels,
  categories,
  selectedCategory,
  subjects,
  showSharedWithMe,
  onNavShared,
  onNav = noop,
  onNavSubject,
  onFile = noop,
  onNew = noop,
  useNewCreateButton = true,
  loading,
  isStudent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [programsDropdownInfo, setProgramsDropdownInfo] = useState(null);

  const getProgramsInfo = async () => {
    const response = await getProgramsPublicInfoRequest(subjects?.map((item) => item.program));

    if (!isEmpty(response?.programs)) {
      const programsInfo = {};

      response.programs.forEach(({ id, name }) => {
        programsInfo[id] = {
          name,
          dropdownOpen: false,
        };
      });
      setProgramsDropdownInfo(programsInfo);
    }
  };

  useEffect(() => {
    if (subjects?.length) {
      getProgramsInfo();
    }
  }, [subjects]);

  const onFileHandler = (e) => {
    onFile(e);
    setShowUpload(false);
    setTimeout(() => {
      setShowUpload(true);
      setIsExpanded(false);
    }, 100);
  };

  const onNewHandler = (category) => {
    onNew(category);
    setShowUpload(false);
    setTimeout(() => {
      setShowUpload(true);
      setIsExpanded(false);
    }, 100);
  };

  const onNavHandler = (category) => {
    onNav(category);
  };

  // This is a temporary fix, categories should bring a property to know if it is a content asset or an activity asset from backend.
  const contentAssetsKeys = [
    'bookmarks',
    'media-files',
    'assignables.scorm',
    'assignables.content-creator',
    SESSIONS_CATEGORY_KEYS.RECORDING,
  ];

  const getSubjectsDropdown = useCallback(() => {
    const subjectsByProgram = groupBy(subjects, 'program');
    return (
      <>
        {Object.keys(subjectsByProgram).map((programId) => {
          const isProgramSelected = subjectsByProgram[programId].some(
            (subject) => subject.id === selectedCategory
          );
          return (
            <NavbarItem
              key={'student-subjects'}
              icon={'/public/leebrary/program.svg'}
              label={programsDropdownInfo?.[programId].name}
              loading={loading}
              selected={isProgramSelected && !programsDropdownInfo?.[programId].dropdownOpen}
              canOpen
              opened={programsDropdownInfo?.[programId].dropdownOpen}
              onClick={() => {
                setProgramsDropdownInfo((current) => {
                  const updatedPrograms = cloneDeep(current);
                  updatedPrograms[programId].dropdownOpen =
                    !updatedPrograms[programId].dropdownOpen;
                  return updatedPrograms;
                });
              }}
            >
              <ScrollArea style={{ maxWidth: '100%' }}>
                <Box
                  key={`program-${programId}`}
                  style={{ padding: '0 0 0 16px', marginInline: 8 }}
                >
                  {subjectsByProgram[programId].map((subject) => (
                    <Box
                      key={subject.id}
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
                            selectedCategory !== subject.id &&
                            theme.other.core.color.primary['100'],
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
                            selectedCategory === subject.id &&
                            theme.other.core.color.primary['300'],
                        })}
                      />
                      <SubjectItemDisplay subjectsIds={[subject.id]} />
                    </Box>
                  ))}
                </Box>
              </ScrollArea>
            </NavbarItem>
          );
        })}
      </>
    );
  }, [programsDropdownInfo, selectedCategory, subjects, loading]);

  const renderNavbarItems = useCallback(
    ({ callback, typeOfItem, onlyCreatable = false, ignoreSelected = false }) => {
      if (onlyCreatable && useNewCreateButton) {
        return categories
          .filter((item) => item.creatable === true)
          .map((category) => ({
            icon: category.icon,
            label: capitalize(category.singularName ?? category.name),
            onClick: () => {
              callback(category);
            },
          }));
      }

      if (typeOfItem !== 'subjects') {
        const itemsToShow = [
          ...categories
            .filter((item) => (onlyCreatable ? item.creatable === true : true))
            .filter((item) => {
              if (typeOfItem === 'contentAssets') return contentAssetsKeys.includes(item.key);
              if (typeOfItem === 'activityAssets') return !contentAssetsKeys.includes(item.key);
              return true;
            }),
        ];
        if (!itemsToShow?.length) return null;
        return (
          <>
            <Divider style={{ marginBlock: 24, marginInline: 10 }} />
            {itemsToShow.map((category) => (
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
            ))}
          </>
        );
      }

      if (typeOfItem === 'subjects' && subjects?.length > 0) {
        return (
          <>
            <Divider style={{ marginBlock: 24, marginInline: 10 }} />
            {getSubjectsDropdown()}
          </>
        );
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
            loading={loading}
          />
          <NavbarItem
            icon={'/public/leebrary/favorite.svg'}
            label={labels.quickAccess}
            onClick={() => onNavHandler(null)}
            selected={selectedCategory === 'pins'}
            loading={loading}
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

          {/* Content Assets */}
          {renderNavbarItems({ callback: onNavHandler, typeOfItem: 'contentAssets' })}

          {/* Activity Assets */}
          {renderNavbarItems({ callback: onNavHandler, typeOfItem: 'activityAssets' })}

          {/* Program & subjects sections */}
          {isStudent && (
            <>{renderNavbarItems({ callback: onNavHandler, typeOfItem: 'subjects' })}</>
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
                rightIcon={<DownloadIcon />}
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
                      icon={<DownloadIcon height={32} width={32} />}
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
