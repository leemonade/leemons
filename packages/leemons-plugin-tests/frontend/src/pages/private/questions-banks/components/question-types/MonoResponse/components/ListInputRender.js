import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Paper, TextInput } from '@bubbles-ui/components';
import { useStore } from '@common';
import { TextEditorInput } from '@bubbles-ui/editors';

// eslint-disable-next-line import/prefer-default-export
export function ListInputRender({ t, useExplanation, addItem, ...props }) {
  const [store, render] = useStore();

  function emit() {
    props.onChange({
      response: store.response,
      explanation: store.explanation,
    });
  }

  function emitIfCan() {
    if (useExplanation) {
      if (store.explanation && store.response) {
        emit();
      }
    } else if (store.response) {
      emit();
    }
  }

  function onChangeResponse(e) {
    store.response = e;
    emitIfCan();
    render();
  }

  function onChangeExplanation(e) {
    store.explanation = e;
    emitIfCan();
    render();
  }

  function add() {
    store.dirty = true;
    if (
      (useExplanation && store.explanation && store.response) ||
      (!useExplanation && store.response)
    ) {
      addItem();
      store.dirty = false;
      store.response = null;
      store.explanation = null;
    }
    render();
  }

  return (
    <Box>
      <Paper fullWidth>
        <ContextContainer>
          <Box>
            <TextInput
              value={store.response}
              label={t('responseLabel')}
              onChange={onChangeResponse}
              error={store.dirty && !store.response ? t('responseRequired') : null}
            />
          </Box>
          {useExplanation ? (
            <Box>
              <TextEditorInput
                value={store.explanation}
                label={t('explanationLabel')}
                onChange={onChangeExplanation}
                error={store.dirty && !store.explanation ? t('explanationRequired') : null}
              />
            </Box>
          ) : null}
        </ContextContainer>
      </Paper>

      <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
        <Button onClick={add}>{t('addResponse')}</Button>
      </Box>
    </Box>
  );
}

ListInputRender.propTypes = {
  t: PropTypes.func.isRequired,
  useExplanation: PropTypes.bool,
  onChange: PropTypes.func,
  addItem: PropTypes.func,
};
