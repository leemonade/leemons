import React from 'react';

import loadable from '@loadable/component';

function dynamicImport(component) {
  return loadable(() =>
    import(/* webpackInclude: /(emails-aws-ses.+)\.js/ */ `@app/plugins${component}.js`)
  );
}

export default function OnboarderForm() {
  const providerName = 'emails-aws-ses';

  let Component = () => <></>;

  Component = dynamicImport('/emails-aws-ses/onboarder-form');

  async function onSubmit(config) {
    await leemons.api('v1/emails/add-provider', {
      method: 'POST',
      body: {
        providerName,
        config,
      },
    });
  }

  async function onTest(config) {
    const data = await leemons.api('v1/emails/email/send-test', {
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
