/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Box, Badge, Text, TextClamp } from '@bubbles-ui/components';
import { isArray, noop } from 'lodash';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import {
  LIBRARY_CARD_BODY_PROP_TYPES,
  LIBRARY_CARD_BODY_DEFAULT_PROPS,
} from './LibraryCardBody.constants';
import { LibraryCardBodyStyles } from './LibraryCardBody.styles';
import { FavButton } from '../FavButton';

const LibraryCardBody = ({
  description,
  variant,
  fullHeight,
  published,
  subjects,
  providerData,
  program,
  pinned,
  id,
  isCreationPreview,
  onPin = noop,
  onUnpin = noop,
  ...props
}) => {
  const { classes } = LibraryCardBodyStyles({ fullHeight }, { name: 'LibraryCardBody' });
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const [isFav, setIsFav] = useState(pinned);
  const [subjectData, setSubjectData] = useState(null);
  const isDraft = typeof providerData?.published === 'boolean' && providerData?.published === false;
  const title = props.name ? props.name : null;

  const handleIsFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const pinParams = {
      id,
    };
    if (isFav) {
      onUnpin(pinParams);
      setIsFav(false);
    } else {
      onPin(pinParams);
      setIsFav(true);
    }
  };

  useEffect(() => {
    if (isArray(subjects)) {
      let subjectIds;
      if (isArray(subjects) && typeof subjects[0] === 'string') {
        subjectIds = subjects;
      } else {
        subjectIds = subjects.map((s) => s.subject);
      }
      setSubjectData(subjectIds);
    } else if (!isArray(subjects) && subjects?.name) {
      setSubjectData(subjects);
    } else if (subjectData !== null) {
      setSubjectData(null);
    }
  }, [subjects]);

  useEffect(() => {
    if (pinned) {
      setIsFav(true);
    } else {
      setIsFav(false);
    }
  }, [pinned]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        {!isCreationPreview && (
          <Box onClick={handleIsFav}>
            <FavButton isActive={isFav} />
          </Box>
        )}
        {isDraft && (
          <Badge closable={false} size="xs" className={classes.draftBadge}>
            <Text className={classes.draftText}>{t('isDraft').toUpperCase()}</Text>
          </Badge>
        )}
      </Box>
      <Box className={classes.titleContainer}>
        {title && (
          <TextClamp lines={2}>
            <Text className={classes.title}>{title}</Text>
          </TextClamp>
        )}
      </Box>
      <Box>
        {description && (
          <TextClamp lines={2}>
            <Text size="xs" className={classes.description}>
              {description}
            </Text>
          </TextClamp>
        )}
      </Box>
      <Box className={classes.subject}>
        <SubjectItemDisplay subjectsIds={subjectData} programId={program} />
      </Box>
    </Box>
  );
};
LibraryCardBody.defaultProps = LIBRARY_CARD_BODY_DEFAULT_PROPS;
LibraryCardBody.propTypes = LIBRARY_CARD_BODY_PROP_TYPES;
export { LibraryCardBody };
