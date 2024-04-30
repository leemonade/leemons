import React from 'react';
import PropTypes from 'prop-types';
import { compact, noop } from 'lodash';
import { AvatarSubject, Text, Stack } from '@bubbles-ui/components';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';

function getIconUrl(subject, classroom) {
  const fileId =
    classroom?.icon?.cover?.id ??
    subject?.icon?.cover?.id ??
    classroom?.icon?.cover ??
    subject?.icon?.cover;

  if (!fileId) return undefined;

  return getFileUrl(fileId);
}

function getClassroomName(classroom, course, t = noop) {
  const parts = [(course?.name ?? '').replace('undefined 1', '').trim()];
  const groupTranslation = t('subjects.group') ?? 'Group';
  if (classroom?.groups?.length) {
    parts.push(groupTranslation, classroom.groups[0]);
  } else if (classroom?.classWithoutGroupId) {
    parts.push(groupTranslation, classroom.classWithoutGroupId);
  }
  return compact(parts).join(' ');
}

function SubjectWithClassroomDisplay({ subject, course, classroom }) {
  const [t] = useTranslateLoader(prefixPN('subject_page'));
  return (
    <Stack alignItems="center" spacing={2}>
      <AvatarSubject
        color={classroom?.color ?? subject?.color}
        size={'md'}
        icon={getIconUrl(subject, classroom)}
      />
      <Text strong color="primary">
        {subject.name ?? ''}
      </Text>
      <Text>{getClassroomName(classroom, course, t)}</Text>
    </Stack>
  );
}

SubjectWithClassroomDisplay.propTypes = {
  subject: PropTypes.object.isRequired,
  classroom: PropTypes.object.isRequired,
  course: PropTypes.object,
};

export { SubjectWithClassroomDisplay };
