import { useEffect, useMemo, useRef, useState } from 'react';

import {
  InputWrapper,
  Box,
  Button,
  ContextContainer,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

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
  const choice = useMemo(() => ({ ...value, isCorrect: value?.isCorrect ?? false }), [value]);

  const [answerText, setAnswerText] = useState(choice.text?.text || '');
  const [explanation, setExplanation] = useState(choice.feedback?.text || '');
  const [image, setImage] = useState(choice.image?.cover?.id || choice.image || null);
  const [imageDescription, setImageDescription] = useState(choice.imageDescription || '');
  const [dirty, setDirty] = useState(false);

  const useButton = useRef(
    !responsesSaved?.some((response) => JSON.stringify(response) === JSON.stringify(choice))
  ).current;

  // FUNCTIONS ··············································································|
  function mutateAnswerText(updatedText) {
    setAnswerText(updatedText);
    if (!dirty) setDirty(true);
    if (updatedText) {
      props.onChange({ ...choice, text: { format: 'plain', text: updatedText } });
    }
  }

  function mutateAnswerExplanation(newExplanation) {
    setExplanation(newExplanation);
    if (!dirty) setDirty(true);
    if (newExplanation) {
      props.onChange({ ...choice, feedback: { format: 'plain', text: newExplanation } });
    }
  }

  function mutateAnswerImage(newImage) {
    setImage(newImage);
    if (!dirty) setDirty(true);
    if (newImage) {
      props.onChange({ ...choice, image: newImage });
    }
  }

  function mutateAnswerImageDescription(newImageDescription) {
    setImageDescription(newImageDescription);
    if (!dirty) setDirty(true);
    props.onChange({ ...choice, imageDescription: newImageDescription });
  }

  function reset() {
    if (answerText) {
      setDirty(false);
      setAnswerText('');
    }
  }

  function addNewItem() {
    addItem();
    reset();
  }

  // Manage scroll and focus
  const answerInputRef = useRef(null);

  useEffect(() => {
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [choice.text?.text]);

  useEffect(() => {
    if (scrollRef?.current && answerInputRef.current) {
      const { top } = answerInputRef.current.getBoundingClientRect();
      const containerTop = scrollRef.current.getBoundingClientRect().top;

      // eslint-disable-next-line no-param-reassign
      scrollRef.current.scrollTop += top - containerTop;
    }
  }, [choice, scrollRef]);

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
            <InputWrapper
              label={`${t('imageLabel')} *`}
              error={dirty && !useButton && !image ? t('needImages') : null}
            >
              <ImagePicker value={image} onChange={mutateAnswerImage} />
            </InputWrapper>
          </Box>
          <Stack fullWidth spacing={4}>
            <Box noFlex={useExplanation}>
              <Box style={{ width: useExplanation ? 250 : '100%' }}>
                <TextInput
                  ref={answerInputRef}
                  label={t('caption')}
                  value={imageDescription}
                  placeholder={t('captionPlaceholder')}
                  onChange={mutateAnswerImageDescription}
                />
              </Box>
            </Box>
            {useExplanation ? (
              <Box>
                <TextInput
                  value={explanation}
                  label={`${capitalize(t('explanationLabel'))} *`}
                  onChange={mutateAnswerExplanation}
                  placeholder={t('explanationPlaceHolder')}
                  error={dirty && !explanation ? t('explanationRequired') : null}
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
            <Button variant="outline" onClick={addNewItem}>
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
          value={answerText}
          ref={answerInputRef}
          label={`${t('responseLabel')} *`}
          placeholder={t('responsePlaceholder')}
          error={dirty && !answerText ? t('responseRequired') : null}
          onChange={(textValue) => {
            mutateAnswerText(textValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && typeof addItem === 'function') {
              addNewItem();
            }
          }}
        />
      </Box>
      {useExplanation ? (
        <Box>
          <Textarea
            value={explanation}
            label={`${capitalize(t('explanationLabel'))} *`}
            onChange={mutateAnswerExplanation}
            placeholder={t('explanationPlaceHolder')}
            error={dirty && !explanation ? t('explanationRequired') : null}
          />
        </Box>
      ) : null}
      {useButton ? (
        <Stack justifyContent="end" spacing={4}>
          <Button variant="link" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button variant="outline" onClick={addNewItem}>
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
