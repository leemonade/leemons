import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Paper, TextInput } from '@bubbles-ui/components';
import { useStore } from '@common';
import { TextEditorInput } from '@bubbles-ui/editors';
import ImagePicker from '@leebrary/components/ImagePicker';

// eslint-disable-next-line import/prefer-default-export
export function ListInputRender({ t, withImages, useExplanation, addItem, value, ...props }) {
  const [store, render] = useStore(value || { useButton: true });

  function emit() {
    console.log('Hola mandamos onChange');
    props.onChange({
      ...value,
      image: store.image,
      imageDescription: store.imageDescription,
      response: store.response,
      explanation: store.explanation,
    });
  }

  function emitIfCan() {
    if (withImages) {
      console.log('aaa', store.image);
      if (store.image) {
        console.log('Emitimos');
        emit();
      }
    } else if (useExplanation) {
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

  function onChangeImage(e) {
    console.log(e);
    store.image = e;
    emitIfCan();
    render();
  }

  function add() {
    store.dirty = true;
    if (withImages) {
      if (store.image) {
        addItem();
        store.dirty = false;
        store.image = null;
        store.imageDescription = null;
      }
    } else if (
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

  const Container = store.useButton ? Paper : Box;

  if (withImages) {
    return (
      <Box>
        <Container fullWidth>
          <ContextContainer>
            <Box>
              <ImagePicker value={store.image} onChange={onChangeImage} />
            </Box>
          </ContextContainer>
        </Container>

        {store.useButton ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
            <Button onClick={add}>{t('addResponse')}</Button>
          </Box>
        ) : null}
      </Box>
    );
  }

  return (
    <Box>
      <Container fullWidth>
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
      </Container>

      {store.useButton ? (
        <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <Button onClick={add}>{t('addResponse')}</Button>
        </Box>
      ) : null}
    </Box>
  );
}

ListInputRender.propTypes = {
  t: PropTypes.func.isRequired,
  useExplanation: PropTypes.bool,
  withImages: PropTypes.bool,
  onChange: PropTypes.func,
  addItem: PropTypes.func,
  value: PropTypes.any,
};
