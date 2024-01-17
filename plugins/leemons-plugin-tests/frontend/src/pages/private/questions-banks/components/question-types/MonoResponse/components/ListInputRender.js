import React from 'react';
import PropTypes from 'prop-types';
import {
  InputWrapper,
  Box,
  Button,
  ContextContainer,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import ImagePicker from '@leebrary/components/ImagePicker';
import { capitalize } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function ListInputRender({
  t,
  withImages,
  useExplanation,
  addItem,
  value,
  onCancel,
  ...props
}) {
  const [store, render] = useStore(value || { useButton: true });

  function emit() {
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
      if (store.image) {
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
    store.image = e;
    emitIfCan();
    render();
  }

  function onChangeImageDescription(e) {
    store.imageDescription = e;
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
        store.explanation = null;
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

  // const Container = store.useButton ? Paper : Box;

  if (withImages) {
    return (
      <ContextContainer>
        <Box>
          <InputWrapper label={`${t('imageLabel')} *`}>
            <ImagePicker value={store.image} onChange={onChangeImage} />
          </InputWrapper>
        </Box>
        <Stack fullWidth spacing={4}>
          <Box noFlex={useExplanation}>
            <Box style={{ width: useExplanation ? 250 : '100%' }}>
              <TextInput
                label={t('caption')}
                value={store.imageDescription}
                onChange={onChangeImageDescription}
              />
            </Box>
          </Box>
          {useExplanation ? (
            <Box>
              <TextInput
                value={store.explanation}
                label={`${capitalize(t('explanationLabel'))} *`}
                onChange={onChangeExplanation}
                error={store.dirty && !store.explanation ? t('explanationRequired') : null}
              />
            </Box>
          ) : null}
        </Stack>
        {store.useButton ? (
          <Stack justifyContent="end" spacing={4}>
            <Button variant="link" onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button variant="outline" onClick={add}>
              {t('saveResponse')}
            </Button>
          </Stack>
        ) : null}
      </ContextContainer>
    );
  }

  return (
    <ContextContainer>
      <Box>
        <TextInput
          value={store.response}
          label={`${t('responseLabel')} *`}
          onChange={onChangeResponse}
          error={store.dirty && !store.response ? t('responseRequired') : null}
        />
      </Box>
      {useExplanation ? (
        <Box>
          <Textarea
            value={store.explanation}
            label={`${capitalize(t('explanationLabel'))} *`}
            onChange={onChangeExplanation}
            error={store.dirty && !store.explanation ? t('explanationRequired') : null}
          />
        </Box>
      ) : null}
      {store.useButton ? (
        <Stack justifyContent="end" spacing={4}>
          <Button variant="link" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button variant="outline" onClick={add}>
            {t('saveResponse')}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

ListInputRender.propTypes = {
  t: PropTypes.func.isRequired,
  useExplanation: PropTypes.bool,
  withImages: PropTypes.bool,
  onChange: PropTypes.func,
  addItem: PropTypes.func,
  value: PropTypes.any,
  onCancel: PropTypes.func,
};
