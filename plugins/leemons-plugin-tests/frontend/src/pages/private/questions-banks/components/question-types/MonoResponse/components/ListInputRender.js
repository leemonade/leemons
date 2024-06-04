import React, { useEffect, useRef } from 'react';
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
  scrollRef,
  responsesSaved,
  ...props
}) {
  const [store, render] = useStore(value);
  const [useButton, setUseButton] = React.useState(!value);

  useEffect(() => {
    const isValueSaved = responsesSaved?.some((response) => response.value === value);
    setUseButton(!isValueSaved);
  }, []);
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

  // Manage scroll and focus
  const answerInputRef = useRef(null);

  useEffect(() => {
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [store.response]);

  useEffect(() => {
    if (scrollRef?.current && answerInputRef.current) {
      const { top } = answerInputRef.current.getBoundingClientRect();
      const containerTop = scrollRef.current.getBoundingClientRect().top;

      scrollRef.current.scrollTop += top - containerTop;
    }
  }, [value, scrollRef]);

  if (withImages) {
    return (
      <ContextContainer>
        <Box
          style={{
            display: useExplanation ? 'block' : 'flex',
            flexDirection: useExplanation ? 'column' : 'row',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <Box
            style={{
              marginBottom: 24,
            }}
          >
            <InputWrapper label={`${t('imageLabel')} *`}>
              <ImagePicker value={store.image} onChange={onChangeImage} />
            </InputWrapper>
          </Box>
          <Stack fullWidth spacing={4}>
            <Box noFlex={useExplanation}>
              <Box style={{ width: useExplanation ? 250 : '100%' }}>
                <TextInput
                  ref={answerInputRef}
                  label={t('caption')}
                  value={store.imageDescription}
                  placeholder={t('captionPlaceholder')}
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
                  placeholder={t('explanationPlaceHolder')}
                  error={store.dirty && !store.explanation ? t('explanationRequired') : null}
                />
              </Box>
            ) : null}
          </Stack>
        </Box>

        {useButton ? (
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
          ref={answerInputRef}
          value={store.response}
          label={`${t('responseLabel')} *`}
          onChange={onChangeResponse}
          placeholder={t('responsePlaceholder')}
          error={store.dirty && !store.response ? t('responseRequired') : null}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && typeof addItem === 'function') {
              add();
            }
          }}
        />
      </Box>
      {useExplanation ? (
        <Box>
          <Textarea
            value={store.explanation}
            label={`${capitalize(t('explanationLabel'))} *`}
            onChange={onChangeExplanation}
            placeholder={t('explanationPlaceHolder')}
            error={store.dirty && !store.explanation ? t('explanationRequired') : null}
          />
        </Box>
      ) : null}
      {useButton ? (
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
  scrollRef: PropTypes.object,
  responsesSaved: PropTypes.array,
};
