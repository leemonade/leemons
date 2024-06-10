import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ContextContainer,
  Stack,
  InputWrapper,
  TextInput,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import ImagePicker from '@leebrary/components/ImagePicker';
import { noop } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function ListInputRender({
  t,
  withImages,
  addItem,
  value,
  responsesSaved,
  onCancel = noop,
  ...props
}) {
  const [store, render] = useStore(value);
  const [useButton, setUseButton] = React.useState(!value);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const isValueSaved = responsesSaved?.some((response) => response.value === value);
    setUseButton(!isValueSaved);
  }, []);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
    } else if (store.response) {
      emit();
    }
  }

  function onChangeResponse(e) {
    store.response = e;
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
      }
    } else if (store.response) {
      addItem();
      store.dirty = false;
      store.response = null;
    }
    render();
  }

  if (withImages) {
    return (
      <Box>
        <ContextContainer>
          <Stack fullWidth spacing={4}>
            <Box>
              <InputWrapper label={`${t('imageLabel')} *`}>
                <ImagePicker value={store.image} onChange={onChangeImage} />
              </InputWrapper>
            </Box>
            <Box>
              <TextInput
                label={t('caption')}
                value={store.imageDescription}
                onChange={onChangeImageDescription}
              />
            </Box>
          </Stack>
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
      </Box>
    );
  }

  return (
    <Box>
      <ContextContainer>
        <Box>
          <TextInput
            value={store.response}
            label={t('responseLabel')}
            onChange={onChangeResponse}
            error={store.dirty && !store.response ? t('responseRequired') : null}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && useButton) {
                add();
              }
            }}
          />
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
  onCancel: PropTypes.func,
  responsesSaved: PropTypes.array,
};
