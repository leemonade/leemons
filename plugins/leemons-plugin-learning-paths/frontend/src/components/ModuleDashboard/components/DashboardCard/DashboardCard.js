import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import prepareAsset, { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { useDashboardCardStyles } from './DashboardCard.styles';
import { DashboardCardCover } from './components/DashboardCardCover';
import { DashboardCardBody } from './components/DashboardCardBody';
import { DashboardCardFooter } from './components/DashboardCardFooter';
import { getOngoingInfo } from '../../helpers/getOngoingInfo';

const DashboardCard = ({
  activity,
  assignation,
  isBlocked,
  localizations,
  preview,
  assetNumber,
  introductionCard,
  statement,
  cover,
  buttonLink,
  emptyIcon,
  fileType,
  moduleColor,
}) => {
  const isTeacher = useIsTeacher();
  const { classes } = useDashboardCardStyles();
  if (introductionCard) {
    return (
      <Box className={classes.root}>
        <DashboardCardCover
          cover={getFileUrl(cover)}
          assetNumber={assetNumber}
          statement={statement}
          emptyIcon={emptyIcon}
          fileType={fileType}
        />
        <Box className={classes.content}>
          <DashboardCardBody statement={statement} assetNumber={assetNumber} />
          <DashboardCardFooter localizations={localizations} buttonLink={buttonLink} />
        </Box>
      </Box>
    );
  }
  const { assignable } = activity;
  const { asset, role, roleDetails } = assignable;
  const preparedAsset = prepareAsset(asset);
  const evaluationData = getOngoingInfo({ instance: activity });

  const rolesLocalizations = useRolesLocalizations([role]);

  const score = React.useMemo(() => {
    if (isTeacher) {
      return null;
    }
    if (!activity.requiresScoring) {
      return null;
    }

    const grades = assignation.grades.filter((grade) => grade.type === 'main');
    const sum = grades.reduce((s, grade) => grade.grade + s, 0);
    return sum / grades.length;
  }, [assignation?.grades, activity.requiresScoring]);

  return (
    <Box className={classes.root}>
      <DashboardCardCover
        asset={preparedAsset}
        assetNumber={assetNumber}
        assignation={assignation}
        score={activity.requiresScoring && score}
        program={activity?.subjects?.[0]?.program}
        isCalificable={activity.requiresScoring}
        instance={activity}
        moduleColor={moduleColor}
        evaluationInfo={evaluationData}
      />
      <Box className={classes.content}>
        <DashboardCardBody activity={activity} />
        <DashboardCardFooter
          isBlocked={isBlocked}
          activity={activity}
          assignation={assignation}
          localizations={localizations}
          preview={preview}
          role={role}
          roleDetails={roleDetails}
          rolesLocalizations={rolesLocalizations}
          evaluationInfo={evaluationData}
        />
      </Box>
    </Box>
  );
};

export default DashboardCard;
export { DashboardCard };

DashboardCard.propTypes = {
  activity: PropTypes.object,
  assignation: PropTypes.object,
  isBlocked: PropTypes.bool,
  preview: PropTypes.bool,
  localizations: PropTypes.object,
  assetNumber: PropTypes.number || PropTypes.string,
  introductionCard: PropTypes.bool,
  statement: PropTypes.string,
  cover: PropTypes.object,
  buttonLink: PropTypes.string,
  emptyIcon: PropTypes.string,
  fileType: PropTypes.string,
  moduleColor: PropTypes.string,
};
