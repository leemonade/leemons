import React, { useEffect, useRef } from 'react';
import { Box } from '@bubbles-ui/components';
import { getPublicFileUrl } from '@leebrary/helpers/prepareAsset';

function sendMessageToPlayer({ source, origin }, msg) {
  source.postMessage(
    {
      scope: 'scorm',
      caller: 'parent',
      ...msg,
    },
    origin
  );
}

function onMessageHandler({ scormPackage, state }) {
  return ({ msg, ...event }) => {
    if (msg.event === 'loaded') {
      sendMessageToPlayer(event, {
        scormPackage,
        launchUrl: getPublicFileUrl(scormPackage.file.id, scormPackage.launchUrl),
        state,
        event: 'initialData',
      });
    }
  };
}
export function ScormRender({ marginTop, scormPackage, state }) {
  const buttonBarHeight = 61;

  useEffect(() => {
    const onMessage = onMessageHandler({ scormPackage, state });

    const handler = ({ data: msg, source, origin }) => {
      if (msg?.scope === 'scorm' && msg?.caller === 'player') {
        onMessage({ msg, source, origin });
      }
    };
    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [scormPackage, state]);

  return (
    <Box sx={{ height: `calc(100vh - ${marginTop}px - ${buttonBarHeight}px)` }}>
      <iframe
        title="scorm"
        src={`${leemons.apiUrl}/api/scorm/public/index.html`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        scrolling="no"
        frameBorder={0}
      />
    </Box>
  );
}

export default ScormRender;
