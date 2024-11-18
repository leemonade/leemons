import { useState, useEffect } from 'react';

import { AvatarSubject, Box, Text, TextClamp } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray } from 'lodash';

import { getMultiSubjectData } from '../../helpers/getMultiSubjectData';
import { useProgramDetail, useSubjects } from '../../hooks';

import {
  SUBJECTITEMSDISPLAY_DEFAULT_PROPS,
  SUBJECTITEMSDISPLAY_PROP_TYPES,
} from './SubjectItemDisplay.constants';
import { SubjectItemDisplayStyles } from './SubjectItemDisplay.styles';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

const SubjectItemDisplay = ({ subjectsIds, programId, avatarCustomSize }) => {
  const [t] = useTranslateLoader(prefixPN('userClassesSwiperWidget'));
  const [subjectData, setSubjectData] = useState(null);
  const [programName, setProgramName] = useState(null);
  const { classes } = SubjectItemDisplayStyles({}, { name: 'SubjectItemDisplay' });
  const labelsMultiSubject = {
    subjectName: t('multiSubject'),
    groupName: t('multiSubject'),
    name: t('multiSubject'),
  };
  const preparedSubject = useSubjects(subjectsIds, {
    enabled: Array.isArray(subjectsIds) && subjectsIds?.length === 1,
  });
  const { data: programData } = useProgramDetail(programId, {
    enabled: typeof programId === 'string' && programId?.length > 1 && programId.includes('lrn:'),
  });

  const isMultiSubjectCase = isArray(subjectsIds) && subjectsIds.length > 1;

  useEffect(() => {
    if (isMultiSubjectCase) {
      const isMultisubject = getMultiSubjectData(labelsMultiSubject);
      setSubjectData(isMultisubject);
    } else if (
      isArray(subjectsIds) &&
      subjectsIds.length === 1 &&
      typeof subjectsIds[0] === 'string'
    ) {
      setSubjectData(preparedSubject?.data?.[0]);
    } else if (subjectData !== null) {
      setSubjectData(null);
    }
    if (!isArray(subjectsIds) && subjectsIds?.name)
      setSubjectData({
        color: subjectsIds.color,
        icon: subjectsIds.icon,
        name: subjectsIds.name,
      });
  }, [isMultiSubjectCase, preparedSubject.data, subjectsIds]);
  useEffect(() => {
    if (!programId) {
      setProgramName(null);
    } else if (programData) {
      setProgramName(programData?.name);
    } else if (typeof programId === 'string' && !programId.includes('lrn:')) {
      setProgramName(programId);
    }
  }, [programData]);
  return (
    <Box className={classes.root}>
      {subjectData && (
        <AvatarSubject
          color={subjectData?.color || 'aquamarine'}
          size={!avatarCustomSize && 'md'}
          isMultiSubject={isMultiSubjectCase}
          icon={subjectData?.icon}
          customSize={avatarCustomSize}
          name={subjectData?.name ?? subjectData?.fullName}
        />
      )}
      <Box className={classes.textWrapper}>
        <TextClamp lines={1}>
          <Text color="muted" role="productive" size="xs">
            {subjectData?.name ?? subjectData?.fullName}
          </Text>
        </TextClamp>
        <TextClamp lines={1}>
          <Text className={classes.programName}>{programName}</Text>
        </TextClamp>
      </Box>
    </Box>
  );
};
SubjectItemDisplay.propTypes = SUBJECTITEMSDISPLAY_PROP_TYPES;
SubjectItemDisplay.defaultProps = SUBJECTITEMSDISPLAY_DEFAULT_PROPS;
SubjectItemDisplay.displayName = 'SubjectItemDisplay';

export default SubjectItemDisplay;
export { SubjectItemDisplay };
