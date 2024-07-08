import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Stack, Button, Divider, BaseDrawer, LoadingOverlay } from '@bubbles-ui/components';
import { Name } from './components/Name';
import { Preview } from './components/Preview';
import { Centers } from './components/Centers';
import { FieldType } from './components/FieldType';
import { Permissions } from './components/Permissions';
import { FieldConfig } from './components/FieldConfig';
import { FieldConfigLocale } from './components/FieldConfigLocale';
import { DatasetItemDrawerContext } from './context/DatasetItemDrawerContext';
import { DatasetItemDrawerStyles } from './DatasetItemDrawer.styles';
import {
  DATASET_ITEM_DRAWER_DEFAULT_PROPS,
  DATASET_ITEM_DRAWER_PROP_TYPES,
} from './DatasetItemDrawer.constants';

const DatasetItemDrawer = ({
  loading,
  position,
  opened,
  onClose,
  onSave,
  size,
  defaultValues,
  messages,
  errorMessages,
  selectOptions,
  locales,
  defaultLocale,
  profiles,
  isSaving,
  formWithTheme,
}) => {
  const { classes } = DatasetItemDrawerStyles({});
  const form = useForm({ defaultValues });
  const contextRef = useRef({
    classes,
    gridColumn: 1000,
    colSpans: [250, 375, 375],
    colOptionsSpans: [250, 450],
    translateOptionsModalOpened: {},
  });
  const [, setR] = useState(0);

  const render = React.useCallback(() => {
    setR(new Date().getTime());
  }, [setR]);

  function save() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  React.useEffect(() => {
    contextRef.current.messages = messages;
    contextRef.current.errorMessages = errorMessages;
    contextRef.current.selectOptions = selectOptions;
    contextRef.current.locales = locales;
    contextRef.current.defaultLocale = defaultLocale;
    contextRef.current.profiles = profiles;
    contextRef.current.formWithTheme = formWithTheme;
    if (!contextRef.current.selectedLocale) {
      contextRef.current.selectedLocale = defaultLocale;
    }
    render();
  }, [messages, errorMessages, selectOptions, locales, defaultLocale, profiles, formWithTheme]);

  const contextValue = React.useMemo(
    () => ({
      contextRef: contextRef.current,
      classes,
      form,
      render,
      locales,
    }),
    [classes, form, render, locales]
  );

  return (
    <DatasetItemDrawerContext.Provider value={contextValue}>
      <BaseDrawer position={position} opened={opened} size={size} onClose={onClose} empty>
        {loading ? (
          <LoadingOverlay visible />
        ) : (
          <Stack fullWidth>
            <Box skipFlex className={classes.leftContainer}>
              <Preview />
            </Box>

            <Box skipFlex className={classes.rightContainer}>
              <Box className={classes.rightColContent}>
                {/* Name */}
                <Name />
                {/* Centers */}
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <Centers />
                </Box>
                <Box className={classes.divider}>
                  <Divider />
                </Box>
                {/* Field type/config */}
                <FieldType />
                <FieldConfig />
                <FieldConfigLocale />
                {/* Permissions */}
                <Permissions />
              </Box>
              <Box className={classes.saveSection}>
                <Button loading={isSaving} onClick={save}>
                  {messages.saveButtonLabel}
                </Button>
              </Box>
            </Box>
          </Stack>
        )}
      </BaseDrawer>
    </DatasetItemDrawerContext.Provider>
  );
};

DatasetItemDrawer.defaultProps = DATASET_ITEM_DRAWER_DEFAULT_PROPS;
DatasetItemDrawer.propTypes = DATASET_ITEM_DRAWER_PROP_TYPES;

export { DatasetItemDrawer };
