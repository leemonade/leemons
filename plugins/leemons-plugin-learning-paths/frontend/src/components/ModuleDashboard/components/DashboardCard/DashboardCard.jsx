import React from 'react';

import { useIsTeacher, useClassesSubjects } from '@academic-portfolio/hooks';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { Box } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import PropTypes from 'prop-types';

import { getOngoingInfo } from '../../helpers/getOngoingInfo';

import { useDashboardCardStyles } from './DashboardCard.styles';
import { DashboardCardBody } from './components/DashboardCardBody';
import { DashboardCardCover } from './components/DashboardCardCover';
import { DashboardCardFooter } from './components/DashboardCardFooter';

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
  introductionLink,
  emptyIcon,
  fileType,
  asset: assignmentAsset,
}) => {
  const isTeacher = useIsTeacher();
  const { classes } = useDashboardCardStyles();
  if (introductionCard && introductionLink) {
    return (
      !!statement && (
        <Box className={classes.root}>
          <DashboardCardCover
            cover={cover}
            asset={assignmentAsset}
            assetNumber={assetNumber}
            statement={statement}
            emptyIcon={emptyIcon}
            fileType={fileType}
            introductionCard={introductionCard}
          />
          <Box className={classes.content}>
            <DashboardCardBody statement={statement} assetNumber={assetNumber} />
            <DashboardCardFooter
              localizations={localizations}
              introductionLink={introductionLink}
              preview={preview}
            />
          </Box>
        </Box>
      )
    );
  }
  const { assignable } = activity ?? {};
  const { asset, role, roleDetails } = assignable ?? {};
  const preparedAsset = prepareAsset(asset);
  const evaluationData = getOngoingInfo({ instance: activity });
  const rolesLocalizations = useRolesLocalizations([role]);
  const subjects = useClassesSubjects(activity?.classes);

  const score = React.useMemo(() => {
    if (isTeacher) {
      return null;
    }
    if (!activity?.requiresScoring) {
      return null;
    }

    const grades = assignation.grades.filter((grade) => grade.type === 'main');
    const sum = grades.reduce((s, grade) => grade.grade + s, 0);
    return sum / grades.length;
  }, [assignation?.grades, activity?.requiresScoring]);

  return (
    <Box className={classes.root}>
      <DashboardCardCover
        asset={preparedAsset}
        introductionCard={false}
        assetNumber={assetNumber}
        assignation={assignation}
        score={activity?.requiresScoring && score}
        program={activity?.subjects?.[0]?.program}
        isCalificable={activity?.requiresScoring}
        instance={activity}
        evaluationInfo={evaluationData}
        fileType={activity?.assignable?.role}
        subjects={subjects}
      />
      <Box className={classes.content}>
        <DashboardCardBody activity={activity} subjects={subjects} />
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
  introductionLink: PropTypes.string,
  emptyIcon: PropTypes.string,
  fileType: PropTypes.string,
  moduleColor: PropTypes.string,
};
