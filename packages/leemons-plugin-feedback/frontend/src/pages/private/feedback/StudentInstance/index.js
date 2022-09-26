import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityContainer } from '@bubbles-ui/leemons';
import { Box, COLORS, LoadingOverlay, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { addErrorAlert } from '@layout/alert';
import { useLocale, useStore } from '@common';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { getCentersWithToken } from '@users/session';
import { getFeedbackRequest } from '@feedback/request';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { isString } from 'lodash';
import QuestionsCard from '@feedback/pages/private/feedback/StudentInstance/components/QuestionsCard';
import WelcomeCard from './components/WelcomeCards/WelcomeCard';

const StudentInstance = () => {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    showingWelcome: true,
  });

  const locale = useLocale();
  const params = useParams();

  const getUserId = () => {
    if (params.user) return params.user;
    return getCentersWithToken()[0].userAgentId;
  };

  const advanceToQuestions = () => {
    store.showingWelcome = false;
    render();
  };

  const taskHeaderProps = React.useMemo(() => {
    if (store.instance) {
      return {
        title: store.instance.assignable.asset.name,
        image: store.instance.assignable.asset.cover
          ? getFileUrl(
              isString(store.instance.assignable.asset.cover)
                ? store.instance.assignable.asset.cover
                : store.instance.assignable.asset.cover.id
            )
          : null,
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          borderRadius: 0,
          backgroundColor: COLORS.uiBackground02,
        },
      };
    }
    return {};
  }, [store.instance, store.class, store.isFirstStep]);

  const init = async () => {
    try {
      [store.instance, store.assignation] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
      ]);

      store.feedback = (await getFeedbackRequest(store.instance.assignable.id)).feedback;
      store.idLoaded = params.id;
      store.loading = false;

      render();
    } catch (error) {
      addErrorAlert(error);
    }
  };

  useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) {
      init();
    }
  }, [params]);

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box style={{ height: '100vh', backgroundColor: COLORS.ui02 }}>
      <ActivityContainer
        header={taskHeaderProps}
        deadline={
          store.instance.dates.deadline
            ? { label: t('delivery'), locale, deadline: new Date(store.instance.dates.deadline) }
            : null
        }
        collapsed
      >
        <Stack fullWidth justifyContent="center">
          {store.showingWelcome ? (
            <WelcomeCard feedback={store.feedback} t={t} onNext={advanceToQuestions} />
          ) : (
            <QuestionsCard feedback={store.feedback} />
          )}
        </Stack>
      </ActivityContainer>
    </Box>
  );
};

export default StudentInstance;
