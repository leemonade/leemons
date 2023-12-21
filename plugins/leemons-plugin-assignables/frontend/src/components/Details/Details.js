import React from 'react';
import { useParams } from 'react-router-dom';
import {
  LoadingOverlay,
  Text,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  Stack,
} from '@bubbles-ui/components';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';
import ActivityHeader from '../ActivityHeader';

export default function Details() {
  const { id } = useParams();

  const { data: instance, isLoading, isError } = useInstances({ id });

  const [t] = useTranslateLoader(prefixPN('studentsList'));

  if (instance) {
    return (
      <TotalLayoutContainer
        Header={
          <ActivityHeader
            action={t('title')}
            instance={instance}
            showClass
            showDeadline
            showEvaluationType
            showRole
            showTime
            //
            showCloseButtons
            allowEditDeadline
          />
        }
      >
        <Stack justifyContent="center">
          <TotalLayoutStepContainer stepName={t('title')}>
            <TaskOngoingList instance={instance} />
            <UsersList instance={instance} />
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    );
  }

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (isError) {
    // TRANSLATE: Error message when an error occurs while fetching assignable instance
    return <Text>An error ocurred</Text>;
  }
}
