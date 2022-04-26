import React from 'react';
import loadable from '@loadable/component';

function dynamicImport(component) {
  return loadable(() =>
    import(/* webpackInclude: /(emails-amazon-ses.+)\.js/ */ `@leemons/plugins${component}.js`)
  );
}

export default function OnboarderForm() {
  const providerName = 'emails-amazon-ses';

  let Component = () => <></>;

  Component = dynamicImport('/emails-amazon-ses/onboarder-form');

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
    console.log(data);
  }

  return (
    <>
      <Component onSubmit={onSubmit} onTest={onTest} />
    </>
  );
}
