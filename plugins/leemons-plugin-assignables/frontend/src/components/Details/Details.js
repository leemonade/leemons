import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';

import {
  Text,
  Stack,
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  Box,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import ActivityHeader from '../ActivityHeader';

import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';

import prefixPN from '@assignables/helpers/prefixPN';
import useInstances from '@assignables/requests/hooks/queries/useInstances';

export default function Details() {
  const { id } = useParams();
  const scrollRef = useRef();

  const { data: instance, isLoading, isError } = useInstances({ id });

  const [t] = useTranslateLoader(prefixPN('studentsList'));

  if (instance) {
    return (
      <TotalLayoutContainer
        scrollRef={scrollRef}
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
            showDeleteButton
            allowEditDeadline
          />
        }
      >
        <Stack
          justifyContent="center"
          fullWidth
          fullHeight
          style={{
            backgroundColor: '#f8f9fb',
            overflow: 'auto',
            position: 'relative',
          }}
          ref={scrollRef}
        >
          <TotalLayoutStepContainer>
            <Stack fullWidth fullHeight direction="column">
              <Box
                noFlex
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: 30,
                }}
              >
                <TaskOngoingList instance={instance} />
                <UsersList instance={instance} />
              </Box>
            </Stack>
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
