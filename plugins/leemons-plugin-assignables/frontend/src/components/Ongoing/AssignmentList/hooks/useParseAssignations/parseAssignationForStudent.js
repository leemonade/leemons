import { Text } from '@bubbles-ui/components';
import UnreadMessages from '@comunica/components/UnreadMessages';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { parseAssignationForCommonView } from './parseAssignationForCommon';

import prefixPN from '@assignables/helpers/prefixPN';
import useAssignationProgress from '@assignables/hooks/useAssignationProgress';

export function Progress({ assignation, isBlocked }) {
  const { label, color } = useAssignationProgress({ assignation, isBlocked });

  return <Text color={color}>{label}</Text>;
}

Progress.propTypes = {
  assignation: PropTypes.object,
  isBlocked: PropTypes.bool,
};

function isFinished(assignation) {
  const {
    instance,
    timestamps: { end },
  } = assignation;
  const {
    alwaysAvailable,
    dates: { deadline: _deadline, closed },
  } = instance;

  const now = dayjs();
  const deadline = dayjs(_deadline || null);
  const closeDate = dayjs(closed || null);
  const endTimestamp = dayjs(end || null);

  return (
    (alwaysAvailable && closeDate.isValid()) ||
    endTimestamp.isValid() ||
    (deadline.isValid() && !deadline.isAfter(now))
  );
}

function getDashboardURL(assignation) {
  const { instance } = assignation;
  const {
    assignable: { roleDetails },
  } = instance;

  const isEvaluable = instance.requiresScoring || instance.allowFeedback;
  const finished = isFinished(assignation);

  if (!finished || (!isEvaluable && !roleDetails.evaluationDetailUrl)) {
    return roleDetails.studentDetailUrl
      .replace(':id', instance.id)
      .replace(':user', assignation.user);
  }

  return roleDetails.evaluationDetailUrl
    .replace(':id', instance.id)
    .replace(':user', assignation.user);
}

export async function parseAssignationForStudentView(assignation, labels, options) {
  const { instance } = assignation;

  const commonData = await parseAssignationForCommonView(instance, labels, options);

  // const blockingActivitiesById = options.blockingActivities;
  // const blockingActivities = instance.relatedAssignableInstances?.blocking ?? [];

  const rooms = [prefixPN(`instance:${instance.id}:group`)].concat(assignation.chatKeys);
  const isBlocked = false; // blockingActivities.some((id) => !blockingActivitiesById?.[id]?.finished);

  return {
    ...commonData,
    isBlocked,
    progress: <Progress assignation={assignation} isBlocked={isBlocked} />,
    messages: (
      <UnreadMessages
        rooms={instance?.metadata?.createComunicaRooms && !commonData?.parentModule ? rooms : []}
      />
    ),
    dashboardURL: () => getDashboardURL(assignation),
  };
}

export default parseAssignationForStudentView;
