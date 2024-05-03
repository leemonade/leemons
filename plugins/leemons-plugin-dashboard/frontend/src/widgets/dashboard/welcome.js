import React, { useEffect } from 'react';

import { Button, ContextContainer } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

import EmptyState from '@dashboard/components/WelcomeWidget/components/EmptyState/EmptyState';
import { useNyaLocalizations } from '@assignables/widgets/dashboard/nya/hooks';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import useCompleteWelcomeMutation from '@dashboard/request/hooks/mutations/useCompleteWelcomeMutation';

export default function Welcome() {
  const localizations = useNyaLocalizations();

  const { data: hasCompletedWelcome, isLoading } = useWelcome();
  const { mutate: completeWelcome } = useCompleteWelcomeMutation();

  useEffect(
    () =>
      // On unmount
      () => {
        if (!hasCompletedWelcome) {
          completeWelcome();
        }
      },
    []
  );

  if (hasCompletedWelcome || isLoading) {
    return null;
  }

  return (
    <ContextContainer
      title={localizations?.nya?.emptyState?.title}
      titleRightZone={
        <Link to={'/private/assignables/ongoing'}>
          <Button variant="link" rightIcon={<ChevRightIcon />}>
            {localizations?.nya?.seeAllActivities}
          </Button>
        </Link>
      }
    >
      <EmptyState />
    </ContextContainer>
  );
}
