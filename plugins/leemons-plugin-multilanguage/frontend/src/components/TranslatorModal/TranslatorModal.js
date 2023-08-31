import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Group,
  IconError,
  IconSuccess,
  IconWarning,
  Stack,
  ContextContainer,
  Button,
  Text,
  Drawer,
} from '@bubbles-ui/components';
import { isString, isFunction } from 'lodash';
import { TranslatorModalStyles } from './TranslatorModal.styles';

export const TRANSLATOR_MODAL_DEFAULT_PROPS = {
  labels: { title: '', trigger: '', help: '', close: '', save: '', cancel: '' },
  error: false,
  warning: false,
  alert: null,
  editMode: true,
};

export const TRANSLATOR_MODAL_PROP_TYPES = {
  labels: PropTypes.shape({
    title: PropTypes.string,
    trigger: PropTypes.string,
    help: PropTypes.string,
    close: PropTypes.string,
    save: PropTypes.string,
    cancel: PropTypes.string,
  }),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  warning: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  closeOnSave: PropTypes.bool,
  editMode: PropTypes.bool,
  alert: PropTypes.element,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onBeforeSave: PropTypes.func,
};

const TranslatorModal = ({
  children,
  labels,
  error,
  warning,
  alert,
  editMode,
  onSave,
  onBeforeSave,
  onClose,
  onCancel,
  closeOnSave,
}) => {
  const { classes, cx } = TranslatorModalStyles({});
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  // ···········································································
  // HANDLERS

  const handleClose = () => {
    setOpened(false);
    if (isFunction(onClose)) onClose();
  };

  const handleOnCancel = () => {
    setOpened(false);
    if (isFunction(onCancel)) onCancel();
  };

  const handleOnSave = async () => {
    if (isFunction(onBeforeSave)) {
      setLoading(true);
      const result = await onBeforeSave();
      setLoading(false);
      if (result && isFunction(onSave)) {
        onSave();
        if (closeOnSave) setOpened(false);
      }
    } else if (isFunction(onSave)) {
      onSave();
      if (closeOnSave) setOpened(false);
    }
  };

  return (
    <Box>
      <Stack alignItems="baseline" spacing={4}>
        {isString(labels.trigger) && labels.trigger !== '' && (
          <Stack alignItems="center">
            <Button variant="link" onClick={() => setOpened(true)}>
              {labels.trigger}
            </Button>

            {error ? <IconError /> : warning ? <IconWarning /> : <IconSuccess />}
          </Stack>
        )}
        {isString(labels.help) && labels.help !== '' && (
          <Text role="productive" size="xs">
            {labels.help}
          </Text>
        )}
      </Stack>

      {alert}

      <Drawer opened={opened} onClose={handleClose} size={715} close={labels.close} noOverlay>
        <ContextContainer title={labels.title} description={labels.description} divided>
          {children}
          {/* ACTION BUTTONS */}
          {editMode && (
            <Stack fullWidth justifyContent="space-between">
              <Button compact variant="light" onClick={handleOnCancel}>
                {labels.cancel}
              </Button>
              <Button onClick={handleOnSave} loading={loading}>
                {labels.save}
              </Button>
            </Stack>
          )}
        </ContextContainer>
      </Drawer>
    </Box>
  );
};

TranslatorModal.defaultProps = TRANSLATOR_MODAL_DEFAULT_PROPS;
TranslatorModal.propTypes = TRANSLATOR_MODAL_PROP_TYPES;

export { TranslatorModal };
