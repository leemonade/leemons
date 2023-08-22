import loadable from '@loadable/component';
import React from 'react';

function dynamicImport(component) {
  return loadable(() =>
    import(/* webpackInclude: /(emails-aws-ses.+)\.js/ */ `@leemons/plugins${component}.js`)
  );
}

export default function OnboarderForm() {
  const providerName = 'emails-aws-ses';

  let Component = () => <></>;

  Component = dynamicImport('/emails-aws-ses/onboarder-form');

  async function onSubmit(config) {
    await leemons.api('emails/add-provider', {
      method: 'POST',
      body: {
        providerName,
        config,
      },
    });
  }

  async function onTest(config) {
    const data = await leemons.api('emails/send-test', {
      method: 'POST',
      body: {
        providerName,
        config,
      },
    });
  }

  return (
    <>
      <Component onSubmit={onSubmit} onTest={onTest} />
    </>
  );
}
