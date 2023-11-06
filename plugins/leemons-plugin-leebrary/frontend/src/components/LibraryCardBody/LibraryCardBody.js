/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { Box, Badge, Text, TextClamp, AvatarSubject } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { useSubjects, useSubjectDetails } from '@academic-portfolio/hooks';
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
  ...props
}) => {
  const { classes } = LibraryCardBodyStyles({ fullHeight }, { name: 'LibraryCardBody' });
  const [isFav, setIsFav] = useState(false);

  const isDraft = typeof published === 'boolean' && published === false;
  const title = props.name ? props.name : null;
  const isMultipleSubjects = isArray(subjects) && subjects.length > 1;
  const handleIsFav = () => {
    setIsFav(!isFav);
  };
  // const preparedSubjects = useSubjects([
  //   'lrn:local:leebrary:local:auto-deployment-id:AssetsSubjects:6544e1113cc4177922b791f7',
  // ]);
  const oneSubject = subjects?.length > 0 && subjects[0]._id;
  // console.log('oneSubject', oneSubject);
  const { data } = useSubjectDetails(oneSubject, { enabled: subjects?.length > 0 });
  // console.log('data', data);
  // console.log('subjects', subjects);
  // console.log('preparedSubjects', preparedSubjects);
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
        {isMultipleSubjects && (
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
              <Text color="primary" role="productive" size="xs">
                {'Multi asignatura'}
              </Text>
            </TextClamp>
          </Box>
        )}
        {!isMultipleSubjects && subject && (
          <Box className={classes.subject}>
            <Box className={classes.subjectIcon}>
              <AvatarSubject
                // color={subject.color}
                // icon={subject.icon}
                // altText={subject.name}
                size="md"
              />
            </Box>
            <Box>
              <TextClamp lines={programName ? 1 : 0}>
                <Text color="muted" role="productive" size="xs" className={classes.subjectName}>
                  {subject.name}
                </Text>
              </TextClamp>
              {programName && (
                <TextClamp lines={1}>
                  <Text className={classes.programName}>{programName}</Text>
                </TextClamp>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
LibraryCardBody.defaultProps = LIBRARY_CARD_BODY_DEFAULT_PROPS;
LibraryCardBody.propTypes = LIBRARY_CARD_BODY_PROP_TYPES;
export { LibraryCardBody };
