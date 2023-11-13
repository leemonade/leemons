/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Box, Badge, Text, TextClamp, AvatarSubject } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { useSubjects } from '@academic-portfolio/hooks';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import {
  LIBRARY_CARD_BODY_PROP_TYPES,
  LIBRARY_CARD_BODY_DEFAULT_PROPS,
} from './LibraryCardBody.constants';
import { LibraryCardBodyStyles } from './LibraryCardBody.styles';
import { FavButton } from '../FavButton';

const LibraryCardBody = ({
  tagline,
  description,
  tags,
  programName,
  metadata,
  locale,
  variant,
  assigment,
  icon,
  url,
  truncated,
  fullHeight,
  role,
  published,
  subject,
  subjects,
  original,
  providerData,
  ...props
}) => {
  const { classes } = LibraryCardBodyStyles({ fullHeight }, { name: 'LibraryCardBody' });
  const [isFav, setIsFav] = useState(false);
  const [subjectData, setSubjectData] = useState(null);

  const isDraft = typeof providerData?.published === 'boolean' && providerData?.published === false;
  const title = props.name ? props.name : null;

  const handleIsFav = () => {
    setIsFav(!isFav);
  };

  useEffect(() => {
    const subjectIds = isArray(subjects) && subjects.map((s) => s.subject);
    setSubjectData(subjectIds);
  }, [subjects]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box onClick={handleIsFav}>
          <FavButton isActive={isFav} />
        </Box>
        {isDraft && (
          <Badge closable={false} size="xs" className={classes.draftBadge}>
            <Text className={classes.draftText}>{'BORRADOR'}</Text>
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
      <Box className={classes.subjectsContainer}>
        {/* MULTIASIGNATURASº */}
        {/* {isMultipleSubjects && (
          <Box className={classes.subject}>
            <Box className={classes.subjectIcon}>
              <AvatarSubject
                color={'#A2A9B0'}
                // icon={subject.icon}
                // altText={subject.name}
                size="md"
              />
            </Box>
            <TextClamp lines={1}>
              <Text color="primary" role="productive" size="xs" className={classes.subjectName}>
                {'Multiasignatura'}
              </Text>
            </TextClamp>
          </Box>
        )} */}
        {/* {!isMultipleSubjects && isArray(subjects) && (
          <Box className={classes.subject}>
            <Box className={classes.subjectIcon}>
              <AvatarSubject
                color={'darkturquoise'}
                // icon={preparedSubject[0]?.icon}
                // altText={preparedSubject[0]?.name}
                size="md"
              />
            </Box>
            <Box>
              <TextClamp lines={originalProgramName ? 1 : 0}>
                <Text color="muted" role="productive" size="xs" className={classes.subjectName}>
                  {preparedSubject[0]?.name}
                </Text>
              </TextClamp>
              <TextClamp lines={1}>
                <Text className={classes.programName}>
                  {!!originalProgramName && originalProgramName}
                </Text>
              </TextClamp>
            </Box>
          </Box>
        )} */}
        <Box className={classes.subject}>
          <SubjectItemDisplay subjectsIds={subjectData} />
        </Box>
      </Box>
    </Box>
  );
};
LibraryCardBody.defaultProps = LIBRARY_CARD_BODY_DEFAULT_PROPS;
LibraryCardBody.propTypes = LIBRARY_CARD_BODY_PROP_TYPES;
export { LibraryCardBody };
