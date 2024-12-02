import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useNyaLocalizations } from '@assignables/widgets/dashboard/nya/hooks';
import { Button, ContextContainer } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useSession } from '@users/session';
import { capitalize } from 'lodash';

import EmptyState from '@dashboard/components/WelcomeWidget/components/EmptyState/EmptyState';
import useCompleteWelcomeMutation from '@dashboard/request/hooks/mutations/useCompleteWelcomeMutation';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';

export default function Welcome() {
  const localizations = useNyaLocalizations();

  const { data: hasCompletedWelcome, isLoading } = useWelcome();
  const { mutate: completeWelcome } = useCompleteWelcomeMutation();

  const session = useSession();
  const userName = session?.name;

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
      title={localizations?.nya?.emptyState?.greetingWelcome?.replace(
        '{{name}}',
        capitalize(userName)
      )}
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
