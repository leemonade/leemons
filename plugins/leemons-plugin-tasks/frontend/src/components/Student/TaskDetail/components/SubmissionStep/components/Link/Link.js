import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ContextContainer,
  Loader,
  TextInput,
  useDebouncedValue,
  useTheme,
} from '@bubbles-ui/components';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { RemoveCircleIcon, CheckCircleIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';

function useUpdateSubmission({ assignation, value, updateSubmissionState }) {
  const isFirstRender = useRef(true);
  const { mutateAsync } = useStudentAssignationMutation();

  const [valueToSave] = useDebouncedValue(value, 500, { leading: false });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateSubmissionState.setLoading();

    if (value) {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch (_) {
        updateSubmissionState.setFailed();

        return;
      }
    }

    mutateAsync({
      instance: assignation.instance.id,
      student: assignation.user,
      metadata: {
        ...assignation.metadata,
        submission: valueToSave ?? null,
      },
    })
      .then(valueToSave ? updateSubmissionState.setSuccess : updateSubmissionState.setEmpty)
      .catch(updateSubmissionState.setFailed);
  }, [valueToSave]);
}

function useSubmissionState(initialValue) {
  const [state, setValue] = useState(initialValue);

  return {
    state,
    setLoading: () => setValue('loading'),
    setFailed: () => setValue('failed'),
    setSuccess: () => setValue('success'),
    setEmpty: () => setValue('empty'),
  };
}

function RenderState({ state }) {
  const theme = useTheme();

  if (state === 'loading') {
    return (
      <Box sx={{ width: 45, height: 40, marginLeft: 20, marginTop: 5 }}>
        <Loader />
      </Box>
    );
  }
  if (state === 'failed') {
    return <RemoveCircleIcon color={theme.other.core.color.danger['500']} width={24} height={20} />;
  }
  if (state === 'success') {
    return <CheckCircleIcon color={theme.other.core.color.success['500']} width={24} height={20} />;
  }
  if (state === 'empty') {
    return null;
  }
}

function Link({ assignation, preview }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.submission_link'));
  const [value, setValue] = useState(assignation?.metadata?.submission || '');
  const { state, ...updateSubmissionState } = useSubmissionState(value ? 'success' : 'empty');

  useUpdateSubmission({ assignation, value, updateSubmissionState });

  return (
    <Box>
      <ContextContainer title={t('title')}>
        <Box sx={{ maxWidth: 220 }}>
          <TextInput
            label={t('label')}
            placeholder={t('placeholder')}
            value={value}
            onChange={setValue}
            disabled={preview}
            rightSection={<RenderState state={state} size={16} />}
          />
        </Box>
      </ContextContainer>
    </Box>
  );
}

Link.propTypes = {
  assignation: PropTypes.object.isRequired,
  preview: PropTypes.bool,
};

export default Link;
