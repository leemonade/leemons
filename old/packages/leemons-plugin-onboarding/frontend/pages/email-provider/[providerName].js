import { useEffect } from 'react';
import OnboarderForm from '@emails/onboarder-form';

export default function EmailProvider() {
  async function checkProvider() {
    /* Estaba usando el next router
    try {
      const { providers } = await leemons.api('emails/providers');
      const index = _.findIndex(providers, Router.router.query);
      if (index < 0) {
        Router.push('/onboarding/email-provider');
      }
    } catch (err) {
      console.error('En el error', err);
    }

     */
  }

  useEffect(() => {
    checkProvider();
  }, []);

  return (
    <>
      <OnboarderForm />
    </>
  );
}
