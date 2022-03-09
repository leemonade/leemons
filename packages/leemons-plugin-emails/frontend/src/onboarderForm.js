import { useRouter } from 'next/router';
import React from 'react';
import loadable from '@loadable/component';

function dynamicImport(component) {
  return loadable(() =>
    import(/* webpackInclude: /(emails-amazon-ses.+)\.js/ */ `@leemons/plugins${component}.js`)
  );
}

export default function OnboarderForm() {
  const router = useRouter();

  let Component = () => <></>;

  if (router.query.providerName === 'emails-amazon-ses') {
    Component = dynamicImport('/emails-amazon-ses/onboarder-form');
  }

  async function onSubmit(config) {
    await leemons.api('emails/add-provider', {
      method: 'POST',
      body: {
        providerName: router.query.providerName,
        config,
      },
    });
  }

  async function onTest(config) {
    const data = await leemons.api('emails/send-test', {
      method: 'POST',
      body: {
        providerName: router.query.providerName,
        config,
      },
    });
    console.log(data);
  }

  return (
    <>
      <Component onSubmit={onSubmit} onTest={onTest} />
    </>
  );
}
