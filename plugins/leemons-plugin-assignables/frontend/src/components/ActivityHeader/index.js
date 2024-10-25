import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, ImageLoader, TotalLayoutHeader, Stack, Button } from '@bubbles-ui/components';
import { OpenIcon } from '@bubbles-ui/icons/outline';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';

import {
  ACTIVITY_HEADER_PROP_TYPES,
  ACTIVITY_HEADER_DEFAULT_PROPS,
} from './ActivityHeader.constants';
import ActivityTypeDisplay from './components/ActivityTypeDisplay/ActivityTypeDisplay';
import CalificationTypeDisplay from './components/CalificationTypeDisplay/CalificationTypeDisplay';
import { ChatDisplay } from './components/ChatDisplay/ChatDisplay';
import ClassroomDisplay from './components/ClassroomDisplay/ClassroomDisplay';
import DateComponent from './components/Date/Date';
import { MenuItems } from './components/MenuItems';
import StatusBadge from './components/StatusBadge/StatusBadge';
import Timer from './components/Timer/Timer';
import useTotalLayoutStyles from './index.style';

import PrefixPN from '@assignables/helpers/prefixPN';
import useInstances from '@assignables/requests/hooks/queries/useInstances';

export default function ActivityHeader({
  assignation,
  instance,
  action,
  showClass,
  showRole,
  showEvaluationType,
  showStartDate,
  showDeadline,
  showDateTime,
  showTime,
  showCountdown,
  showStatusBadge,
  showCloseButtons,
  showDeleteButton,
  showAssignmentDetailButton,
  allowEditDeadline,
  goToModuleDashboard = false,
  onTimeout = noop,
}) {
  const form = useForm();
  const history = useHistory();
  const [t] = useTranslateLoader(PrefixPN('evaluation'));
  const isTeacher = useIsTeacher();
  /*
    === Activity data ===
  */
  const assignable = instance?.assignable;

  const isModule = !!instance?.metadata?.module;
  const isModuleActivity = !!isModule && instance?.metadata?.module?.type !== 'module';
  const isModulePreview = window?.location?.href?.includes('moduleId');
  const modulePreviewId = window?.location?.href?.split('moduleId=')[1];

  const { data } = useInstances({ id: instance?.metadata?.module?.id, enabled: isModuleActivity });

  /*
    === Asset data ===
  */
  const preparedAsset = prepareAsset(assignable?.asset ?? {});
  const coverUrl = preparedAsset?.cover;
  /*
    === Presentation ===
  */
  const title = useMemo(() => {
    let response = null;

    if (isModuleActivity) {
      response = data?.assignable?.asset?.name;
    }

    if (action) {
      response = action;
    }

    if ((action || showStatusBadge) && response) {
      return (
        <Stack alignItems="center" spacing={4} sx={{ font: 'inherit' }}>
          <span>{response}</span>
          <StatusBadge instance={instance} />
        </Stack>
      );
    }

    return response;
  }, [action, data?.assignable?.asset?.name, isModuleActivity, instance, showStatusBadge]);

  const subtitle = useMemo(() => {
    const response = assignable?.asset?.name;

    if (!title && showStatusBadge) {
      return (
        <Stack alignItems="center" spacing={4} sx={{ font: 'inherit' }}>
          <span>{response}</span>
          <StatusBadge instance={instance} />
        </Stack>
      );
    }

    return response;
  }, [title, assignable?.asset?.name, instance, showStatusBadge]);

  const hasChat = instance?.metadata?.createComunicaRooms;

  const { classes } = useTotalLayoutStyles({}, { name: 'ActivityHeader' });

  const goToAssignmentDetail = () => {
    const url = (
      instance?.assignable?.roleDetails?.dashboardUrl || '/private/assignables/details/:id'
    ).replace(':id', instance.id);
    history.push(url);
  };

  return (
    <FormProvider {...form}>
      <TotalLayoutHeader
        title={title}
        formTitlePlaceholder={subtitle}
        iconLarge
        icon={
          <Box
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <ImageLoader
              src={coverUrl ?? assignable?.roleDetails?.icon}
              width={40}
              height={40}
              imageStyles={{ borderRadius: 4 }}
            />
          </Box>
        }
        direction="row"
        cancelable={false}
      >
        <Box className={classes.root}>
          {goToModuleDashboard && isModulePreview && (
            <Link to={`/private/learning-paths/modules/${modulePreviewId}/view`}>
              <Button variant="outline">{t('goToModuleDashboard')}</Button>
            </Link>
          )}
          <ClassroomDisplay instance={instance} hidden={!showClass} />
          <Box className={classes.activityMetadata}>
            <ActivityTypeDisplay assignable={assignable} hidden={!showRole} />
            <CalificationTypeDisplay instance={instance} hidden={!showEvaluationType} />
            {hasChat && <ChatDisplay instance={instance} />}
            <Timer
              assignation={assignation}
              instance={instance}
              hidden={!showTime && !showCountdown}
              showCountdown={showCountdown}
              onTimeout={onTimeout}
            />
            <DateComponent
              instance={instance}
              showDeadline={showDeadline}
              showStartDate={showStartDate}
              showTime={showDateTime}
              allowEdit={!!allowEditDeadline}
            />
            {showAssignmentDetailButton && (
              <Box className={classes.viewDetailButton}>
                <Button variant="link" rightIcon={<OpenIcon />} onClick={goToAssignmentDetail}>
                  {t('assignationHeaderButton')}
                </Button>
              </Box>
            )}
            {isTeacher && (
              <MenuItems
                instance={instance}
                hideDeleteButton={!showDeleteButton || isModuleActivity}
                hideCloseButtons={!showCloseButtons}
              />
            )}
          </Box>
        </Box>
      </TotalLayoutHeader>
    </FormProvider>
  );
}

ActivityHeader.propTypes = ACTIVITY_HEADER_PROP_TYPES;
ActivityHeader.defaultProps = ACTIVITY_HEADER_DEFAULT_PROPS;
ActivityHeader.displayName = 'ActivityHeader';
