import React from 'react';
import PropTypes from 'prop-types';
import { compact, isString, uniq } from 'lodash';
import {
  Box,
  Tabs,
  Text,
  Stack,
  TabPanel,
  LoadingOverlay,
  ContextContainer,
} from '@bubbles-ui/components';
import useUserDetails from '@users/hooks/useUserDetails';
import useUserEnrollments from '@academic-portfolio/hooks/useUserEnrollments';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useUserAgentsInfo } from '@users/hooks';
import { USER_DETAIL_VIEWS } from '@users/components/UserDetail';
import { SubjectWithClassroomDisplay } from './components/SubjectWithClassroomDisplay';

function filterUserAgentIds(userAgents, sysProfileFilter) {
  return userAgents
    .filter((userAgent) =>
      sysProfileFilter ? userAgent?.profile?.sysName === sysProfileFilter : true
    )
    .map((userAgent) => userAgent.id);
}

function getTeacherFullname(teacherId, teachers) {
  const item = teachers.find((teacher) => teacher.id === teacherId);
  const parts = compact([item?.user?.surnames, item?.user?.name]);

  if (parts.length > 1) {
    return parts.join(', ');
  }

  return parts.length === 1 ? parts[0] : '';
}

function getTeachersIds(enrollments = []) {
  const teacherIds = enrollments.flatMap((enrollment) =>
    (enrollment.subjects ?? []).flatMap((subject) =>
      (subject.classes ?? []).flatMap((classroom) =>
        (classroom.teachers ?? []).map((teacher) => teacher?.teacher)
      )
    )
  );
  return compact(uniq(teacherIds));
}

function EnrollUserSummary({
  userId,
  center,
  contactUserAgentId,
  sysProfileFilter,
  viewMode,
  isMyProfile,
}) {
  const [t] = useTranslateLoader(prefixPN('subject_page'));
  const [tCommon] = useTranslateLoader(prefixPN('common'));

  const enableUserDetails = !!userId;
  const { data: userDetails, isLoading: userDetailsLoading } = useUserDetails({
    userId,
    enabled: enableUserDetails,
  });

  const enableEnrollments = !!center?.id && !!userDetails?.userAgents?.length;
  const { data: enrollments, isLoading: enrollmentsLoading } = useUserEnrollments({
    centerId: center?.id,
    userAgentIds: filterUserAgentIds(userDetails?.userAgents ?? [], sysProfileFilter),
    contactUserAgentId: isString(contactUserAgentId) ? contactUserAgentId : undefined,
    enabled: enableEnrollments,
  });

  const enableTeachersInfo = enrollments?.length > 0;
  const { data: teachers, isLoading: teachersInfoLoading } = useUserAgentsInfo(
    getTeachersIds(enrollments),
    { enabled: enableTeachersInfo }
  );

  if (
    userDetailsLoading ||
    (enableEnrollments && enrollmentsLoading) ||
    (enableTeachersInfo && teachersInfoLoading)
  ) {
    return <LoadingOverlay visible />;
  }

  const isStudent = viewMode === USER_DETAIL_VIEWS.STUDENT;
  const isTeacher = viewMode === USER_DETAIL_VIEWS.TEACHER;

  const isTeacherSelfProfileView = isTeacher && isMyProfile;

  // If the user is a student and the contactUserAgentId is the same as the userAgentId, we don't show the enrollments
  if (
    isStudent &&
    contactUserAgentId &&
    userDetails?.userAgents?.map((userAgent) => userAgent.id).includes(contactUserAgentId)
  ) {
    return null;
  }

  if (!enrollments?.length) {
    return null;
  }

  return (
    <ContextContainer title={isTeacher ? tCommon('classes') : tCommon('enrollments')}>
      <Tabs>
        {enrollments?.map((program) => (
          <TabPanel key={program.id} label={program.name}>
            <Stack direction="column" spacing={4} fullWidth>
              <Stack
                justifyContent="space-between"
                sx={(theme) => ({ marginTop: theme?.other?.global?.spacing?.gap?.lg })}
              >
                <Stack spacing={2}>
                  <Text strong color="primary">
                    {t('subjects.subject')}
                  </Text>
                  <Text>{t('subjects.group')}</Text>
                </Stack>
                {!isStudent && !isTeacherSelfProfileView && (
                  <Text strong color="primary">
                    {t('subjects.teacher')}
                  </Text>
                )}
              </Stack>
              {program.subjects.map((subject) => (
                <Stack key={subject.id} justifyContent="space-between">
                  <SubjectWithClassroomDisplay
                    subject={subject}
                    classroom={subject.classes[0]}
                    course={subject.classes[0].courses}
                  />
                  <Box>
                    {!isStudent && !isTeacherSelfProfileView && (
                      <Text>
                        {getTeacherFullname(subject.classes[0]?.teachers[0]?.teacher, teachers)}
                      </Text>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </TabPanel>
        ))}
      </Tabs>
    </ContextContainer>
  );
}

EnrollUserSummary.propTypes = {
  userId: PropTypes.string,
  center: PropTypes.string,
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.string,
  contactUserAgentId: PropTypes.string,
  isMyProfile: PropTypes.bool,
};

export { EnrollUserSummary };
