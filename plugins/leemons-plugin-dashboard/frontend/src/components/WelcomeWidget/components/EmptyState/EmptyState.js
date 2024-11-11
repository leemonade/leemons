import { useIsTeacher } from '@academic-portfolio/hooks';
import prefixPN from '@assignables/helpers/prefixPN';
import { Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { WelcomeCard } from './WelcomeCard';

export function EmptyState() {
  const isTeacher = useIsTeacher();
  // const isTeacher = false;
  const [t] = useTranslateLoader(
    prefixPN(`need_your_attention.welcome.${isTeacher ? 'teacher' : 'student'}`)
  );
  const [linksT] = useTranslateLoader(prefixPN('need_your_attention.links'));

  if (isTeacher) {
    return (
      <Stack justifyContent="center" fullWidth spacing={6}>
        <WelcomeCard
          title={t('helpCenter.title')}
          description={t('helpCenter.description')}
          linkTo={linksT('academy')}
          cover={'/public/dashboard/help_center.png'}
        />
        <WelcomeCard
          title={t('leebrary.title')}
          description={t('leebrary.description')}
          linkTo={linksT('library')}
          cover={'/public/dashboard/leebrary_resources.png'}
        />
        <WelcomeCard
          title={t('comunica.title')}
          description={t('comunica.description')}
          cover={'/public/dashboard/say_hello_chat.png'}
        />
      </Stack>
    );
  }

  return (
    <Stack justifyContent="center" fullWidth spacing={6}>
      <WelcomeCard
        title={t('helpCenter.title')}
        description={t('helpCenter.description')}
        linkTo={'/private/users/detail'}
        cover={'/public/dashboard/complete_profile.png'}
      />
      <WelcomeCard
        title={t('comunica.title')}
        description={t('comunica.description')}
        cover={'/public/dashboard/say_hello_chat.png'}
      />
    </Stack>
  );
}

export default EmptyState;
