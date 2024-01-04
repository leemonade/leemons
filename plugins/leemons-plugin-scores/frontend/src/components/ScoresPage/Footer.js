import { Stack, TotalLayoutFooterContainer, Button } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert } from '@layout/alert';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import React from 'react';

function onScoresDownload(extension) {
  let timer;

  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('scores::downloaded-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);

    removeAction('scores::download-scores-error', onError);
  };

  addAction('scores::downloaded-intercepted', onClearTimer);
  addAction('scores::download-scores-error', onError);

  fireEvent('scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent('scores::download-scores-error', new Error('timeout'));
  }, 1000);
}

function onCloseEvaluation() {
  let timer;

  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('scores::closed-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error closing evaluation ${e.message}`);

    removeAction('scores::close-evaluation-error', onError);
  };

  addAction('scores::closed-intercepted', onClearTimer);
  addAction('scores::close-evaluation-error', onError);

  fireEvent('scores::close-evaluation');

  timer = setTimeout(() => {
    fireEvent('scores::close-evaluation-error', new Error('timeout'));
  }, 1000);
}

export default function Footer({ scrollRef }) {
  return (
    <TotalLayoutFooterContainer
      scrollRef={scrollRef}
      rightZone={
        <Stack spacing="sm">
          <Button
            variant="link"
            leftIcon={<CloudUploadIcon />}
            onClick={() => onScoresDownload('xlsx')}
          >
            Excel
          </Button>
          <Button
            variant="link"
            leftIcon={<CloudUploadIcon />}
            onClick={() => onScoresDownload('csv')}
          >
            CSV
          </Button>
          <Button onClick={onCloseEvaluation}>Close informe de evaluación</Button>
        </Stack>
      }
    />
  );
}
