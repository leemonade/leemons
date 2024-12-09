import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  Alert,
  Box,
  ContextContainer,
  InputWrapper,
  Select,
  Switch,
  TextInput,
  Text,
  Title,
  RadioGroup,
  createStyles,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Button,
} from '@bubbles-ui/components';
import { ChevLeftIcon, DeleteBinIcon, SynchronizeArrowsIcon } from '@bubbles-ui/icons/outline';
import { map } from 'lodash';
import propTypes from 'prop-types';

import RulesByQuestionType from './RulesByQuestionType';

const RulesConfigStyles = createStyles((theme, { isDrawer }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.xlg, // 24
    zIndex: 0,
    paddingBottom: isDrawer ? 60 : 10,
  },
  listElements: {
    listStyleType: 'disc',
    marginLeft: theme.spacing.md,
    paddingTop: 12,
  },
  radioGroupContainer: {
    marginLeft: -12,
  },
  counterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 8,
  },
  selectedCounter: {
    color: theme.other.chip.content.color.default,
    backgroundColor: theme.other.core.color.neutral['100'],
    borderRadius: 4,
    display: 'block',
    width: 'fit-content',
    padding: 10,
    ...theme.other.global.content.typo.heading.xsm,
    marginTop: 24,
    marginBottom: 8,
  },
  advancedSettings: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 42,
    gap: 12,
  },
  advancedInputs: {
    width: 'fit-content',
  },
  advancedInputsChildren: {
    width: 'fit-content',
    paddingLeft: 48,
  },
  buttons: {
    display: 'flex',
    paddingTop: 12,
  },
}));

const useOnChange = (form, onChangeRules) => {
  const checkIfIsFunction = typeof onChangeRules === 'function';
  const values = useWatch({ control: form.control, disabled: !checkIfIsFunction });

  useEffect(() => {
    const { questions, ...filters } = values;

    if (checkIfIsFunction) {
      onChangeRules({ filters });
    }
  }, [values]);
};

const RulesConfig = ({
  t,
  loading,
  configs = [],
  onSave,
  onPrevStep,
  onSend,
  hideButtons,
  onDeleteConfig,
  onUpdateConfig,
  isDrawer = false,
  defaultValues,
  onChangeRules,
}) => {
  const { classes } = RulesConfigStyles({ isDrawer });
  const [hasTextClue, setHasTextClue] = React.useState(false);
  const [hasHideShowClue, setHasHideShowClue] = React.useState(false);
  const [selectedConfig, setSelectedConfig] = React.useState(defaultValues?.configSelected);
  const initialValues = {
    clues: [
      { type: 'note', name: t('clueExtraInfo'), value: 0, canUse: true },
      { type: 'hide-response', name: t('clueHideOption'), value: 0, canUse: true },
    ],
  };
  const form = useForm({ defaultValues: defaultValues ?? initialValues });
  useOnChange(form, onChangeRules);

  const settingsAsPreset = form.watch('settingsAsPreset');
  const settings = form.watch('settings');
  const useAdvancedSettings = form.watch('useAdvancedSettings');
  const canOmitQuestions = form.watch('canOmitQuestions');
  const allowClues = form.watch('allowClues');
  const clues = form.watch('clues');
  const advancedConfigOptions = React.useMemo(
    () => [
      {
        value: 'new',
        label: t('newConfig'),
      },
      {
        value: 'existing',
        label: t('existingConfig'),
        disabled: !configs.length,
      },
    ],
    [t, configs]
  );

  React.useEffect(() => {
    if (settings === 'new') {
      setSelectedConfig(null);
    }
  }, [settings]);

  React.useEffect(() => {
    if (!configs.length) {
      form.setValue('settings', 'new');
    } else if (!configs.some((configElem) => configElem.id === selectedConfig)) {
      setSelectedConfig(null);
      form.setValue('configSelected', null);
    }
  }, [configs]);

  if (!clues) {
    return null;
  }
  const handleConfigChange = (e) => {
    const configSelected = configs.find((c) => c.id === e);
    if (configSelected) {
      const {
        allowClues: _allowClues,
        canOmitQuestions: _canOmitQuestions,
        clues: _clues,
        omit: _omit,
        wrong: _wrong,
      } = configSelected.config;

      form.setValue('allowClues', _allowClues);
      form.setValue('canOmitQuestions', _canOmitQuestions);
      form.setValue('clues', _clues);
      form.setValue('omit', _omit);
      form.setValue('wrong', _wrong);
      form.setValue('configSelected', e);
    }
    setSelectedConfig(e);
  };
  const handleDeleteConfig = (id) => {
    onDeleteConfig(id);
  };
  const handleUpdateConfig = (config) => {
    const selectedConfigtoUpdate = configs.find((c) => c.id === config);
    const formValues = form.getValues();
    onUpdateConfig(selectedConfigtoUpdate.id, selectedConfigtoUpdate.name, formValues);
  };

  return (
    <TotalLayoutStepContainer
      fullWidth={false}
      clean={isDrawer}
      noMargin={false}
      Footer={
        !hideButtons && (
          <TotalLayoutFooterContainer
            fixed
            leftZone={
              <Button
                compact
                variant="outline"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={() => {
                  const values = form.getValues();
                  const { questions: q, ...filters } = values;
                  onSave({
                    filters,
                  });
                  onPrevStep();
                }}
              >
                {t('prev')}
              </Button>
            }
            rightZone={
              <Button
                loading={loading}
                onClick={() => {
                  form.handleSubmit(({ questions: q, ...filters }) => {
                    onSend({
                      filters,
                    });
                  })();
                }}
              >
                {t('assign')}
              </Button>
            }
          />
        )
      }
    >
      <Box className={classes.root}>
        <Title order={4}>{t('executionRules')}</Title>
        <Alert variant="block" severity="warning" title={t('defaultRules.alert')} closeable={false}>
          <Text>{t('defaultRules.title')}</Text>
          <ul className={classes.listElements}>
            <li> {t('defaultRules.canOmit')}</li>
            <li> {t('defaultRules.errorQuestions')}</li>
            <li> {t('defaultRules.canClue')}</li>
          </ul>
        </Alert>
        <Box>
          <Controller
            control={form.control}
            name="useAdvancedSettings"
            shouldUnregister
            render={({ field }) => (
              <Switch checked={field.value} {...field} label={t('allowAdvancedSettings')} />
            )}
          />
          {useAdvancedSettings ? (
            <Box className={classes.advancedSettings}>
              <Box className={classes.radioGroupContainer}>
                <Controller
                  control={form.control}
                  name="settings"
                  shouldUnregister
                  render={({ field }) => <RadioGroup data={advancedConfigOptions} {...field} />}
                />
              </Box>
              {settings === 'new' ? (
                <>
                  <Box className={classes.advancedInputs}>
                    <Controller
                      control={form.control}
                      name="wrong"
                      shouldUnregister
                      render={({ field }) => (
                        <Select
                          data={[
                            { label: t('clueNoImpact'), value: 0 },
                            { label: t('wrongAnswerPercentage', { number: 25 }), value: 25 },
                            { label: t('wrongAnswerPercentage', { number: 50 }), value: 50 },
                            {
                              label: t('wrongAnswerPercentage', { number: 100 }),
                              value: 100,
                            },
                          ]}
                          {...field}
                          label={t('wrongAnswerLabel')}
                          value={field.value ?? 0}
                        />
                      )}
                    />
                  </Box>
                  <InputWrapper
                    description={
                      <Controller
                        control={form.control}
                        name="canOmitQuestions"
                        shouldUnregister
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            {...field}
                            label={t('unansweredDescriptions')}
                          />
                        )}
                      />
                    }
                  >
                    {canOmitQuestions ? (
                      <Box className={classes.advancedInputsChildren}>
                        <Controller
                          control={form.control}
                          name="omit"
                          shouldUnregister
                          render={({ field }) => (
                            <Select
                              description={t('unansweredDescription2')}
                              value={0}
                              data={[
                                { label: t('clueNoImpact'), value: 0 },
                                {
                                  label: t('wrongAnswerPercentage', { number: 25 }),
                                  value: 25,
                                },
                                {
                                  label: t('wrongAnswerPercentage', { number: 50 }),
                                  value: 50,
                                },
                                {
                                  label: t('wrongAnswerPercentage', { number: 100 }),
                                  value: 100,
                                },
                              ]}
                              {...field}
                            />
                          )}
                        />
                      </Box>
                    ) : null}
                  </InputWrapper>
                  <InputWrapper
                    description={
                      <Controller
                        name="allowClues"
                        control={form.control}
                        shouldUnregister
                        render={({ field }) => (
                          <Switch checked={field.value} {...field} label={t('allowClues')} />
                        )}
                      />
                    }
                  >
                    {allowClues ? (
                      <Box className={classes.advancedInputsChildren}>
                        <Box>
                          <Switch
                            checked={hasTextClue}
                            onChange={() => setHasTextClue(!hasTextClue)}
                            label={t('clueExtraInfo')}
                          />
                          {hasTextClue && (
                            <Box style={{ paddingLeft: 42, paddingTop: 12 }}>
                              <Select
                                data={[
                                  { label: t('clueNoImpact'), value: 0 },
                                  { label: t('cluePer', { number: 25 }), value: 25 },
                                  { label: t('cluePer', { number: 50 }), value: 50 },
                                ]}
                                value={clues[0].value} // Asumiendo que este es el Select para el primer elemento
                                onChange={(e) => {
                                  const _clues = form.getValues('clues');
                                  _clues[0].value = e;
                                  form.setValue('clues', _clues);
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                        <Box style={{ paddingTop: 12 }}>
                          <Switch
                            checked={hasHideShowClue}
                            onChange={() => setHasHideShowClue(!hasHideShowClue)}
                            label={t('clueHideOption')}
                          />
                          {hasHideShowClue && (
                            <Box style={{ paddingLeft: 42, paddingTop: 12 }}>
                              <Select
                                data={[
                                  { label: t('clueNoImpact'), value: 0 },
                                  { label: t('cluePer', { number: 25 }), value: 25 },
                                  { label: t('cluePer', { number: 50 }), value: 50 },
                                ]}
                                value={clues[1].value} // Asumiendo que este es el Select para el segundo elemento
                                onChange={(e) => {
                                  const _clues = form.getValues('clues');
                                  _clues[1].value = e;
                                  form.setValue('clues', _clues);
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : null}
                  </InputWrapper>
                  <RulesByQuestionType control={form.control} t={t} />

                  <Box style={{ paddingTop: 12 }}>
                    <Controller
                      control={form.control}
                      name="settingsAsPreset"
                      shouldUnregister
                      render={({ field }) => (
                        <Switch checked={field.value} {...field} label={t('settingsAsPreset')} />
                      )}
                    />
                    {settingsAsPreset ? (
                      <Box className={classes.advancedInputsChildren} style={{ width: 366 }}>
                        <Controller
                          control={form.control}
                          name="presetName"
                          shouldUnregister
                          render={({ field }) => (
                            <TextInput checked={field.value} {...field} label={t('presetName')} />
                          )}
                        />
                      </Box>
                    ) : null}
                  </Box>
                </>
              ) : null}

              {settings === 'existing' ? (
                <ContextContainer>
                  <Box className={classes.advancedInputs}>
                    <Controller
                      control={form.control}
                      name="configSelected"
                      shouldUnregister
                      render={({ field }) => (
                        <Select
                          {...field}
                          data={[
                            ...map(configs, (config) => ({
                              value: config.id,
                              label: config.name,
                            })),
                          ]}
                          label={t('configs')}
                          onChange={(e) => {
                            handleConfigChange(e);
                          }}
                        />
                      )}
                    />
                  </Box>
                  {}
                </ContextContainer>
              ) : null}

              {selectedConfig && (
                <>
                  <Box className={classes.advancedInputs}>
                    <Controller
                      control={form.control}
                      name="wrong"
                      shouldUnregister
                      render={({ field }) => (
                        <Select
                          data={[
                            { label: t('clueNoImpact'), value: 0 },
                            { label: t('wrongAnswerPercentage', { number: 25 }), value: 25 },
                            { label: t('wrongAnswerPercentage', { number: 50 }), value: 50 },
                            {
                              label: t('wrongAnswerPercentage', { number: 100 }),
                              value: 100,
                            },
                          ]}
                          {...field}
                          label={t('wrongAnswerLabel')}
                          value={field.value ?? 0}
                        />
                      )}
                    />
                  </Box>
                  <InputWrapper
                    // label={t('unansweredLabel')}
                    description={
                      <Controller
                        control={form.control}
                        name="canOmitQuestions"
                        shouldUnregister
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            {...field}
                            label={t('unansweredDescriptions')}
                          />
                        )}
                      />
                    }
                  >
                    {canOmitQuestions ? (
                      <Box className={classes.advancedInputsChildren}>
                        <Controller
                          control={form.control}
                          name="omit"
                          shouldUnregister
                          render={({ field }) => (
                            <Select
                              description={t('unansweredDescription2')}
                              value={0}
                              data={[
                                { label: t('clueNoImpact'), value: 0 },
                                {
                                  label: t('wrongAnswerPercentage', { number: 25 }),
                                  value: 25,
                                },
                                {
                                  label: t('wrongAnswerPercentage', { number: 50 }),
                                  value: 50,
                                },
                                {
                                  label: t('wrongAnswerPercentage', { number: 100 }),
                                  value: 100,
                                },
                              ]}
                              {...field}
                            />
                          )}
                        />
                      </Box>
                    ) : null}
                  </InputWrapper>

                  <InputWrapper
                    // label={t('clues')}
                    description={
                      <Controller
                        control={form.control}
                        name="allowClues"
                        shouldUnregister
                        render={({ field }) => (
                          <Switch checked={field.value} {...field} label={t('allowClues')} />
                        )}
                      />
                    }
                  >
                    {allowClues ? (
                      <>
                        <Box className={classes.advancedInputsChildren}>
                          <Box>
                            <Switch
                              checked={hasTextClue}
                              onChange={() => setHasTextClue(!hasTextClue)}
                              label={t('clueExtraInfo')}
                            />
                            {hasTextClue && (
                              <Box style={{ paddingLeft: 42, paddingTop: 12 }}>
                                <Select
                                  data={[
                                    { label: t('clueNoImpact'), value: 0 },
                                    { label: t('cluePer', { number: 25 }), value: 25 },
                                    { label: t('cluePer', { number: 50 }), value: 50 },
                                  ]}
                                  value={clues[0].value} // Asumiendo que este es el Select para el primer elemento
                                  onChange={(e) => {
                                    const _clues = form.getValues('clues');
                                    _clues[0].value = e;
                                    form.setValue('clues', _clues);
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                          <Box style={{ paddingTop: 12 }}>
                            <Switch
                              checked={hasHideShowClue}
                              onChange={() => setHasHideShowClue(!hasHideShowClue)}
                              label={t('clueHideOption')}
                            />
                            {hasHideShowClue && (
                              <Box style={{ paddingLeft: 42, paddingTop: 12 }}>
                                <Select
                                  data={[
                                    { label: t('clueNoImpact'), value: 0 },
                                    { label: t('cluePer', { number: 25 }), value: 25 },
                                    { label: t('cluePer', { number: 50 }), value: 50 },
                                  ]}
                                  value={clues[1].value}
                                  onChange={(e) => {
                                    const _clues = form.getValues('clues');
                                    _clues[1].value = e;
                                    form.setValue('clues', _clues);
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </>
                    ) : null}

                    <Box className={classes.buttons}>
                      <Button
                        variant="link"
                        leftIcon={<DeleteBinIcon width={20} height={20} />}
                        onClick={() => handleDeleteConfig(selectedConfig)}
                      >
                        {t('delete')}
                      </Button>
                      <Button
                        variant="link"
                        leftIcon={<SynchronizeArrowsIcon width={20} height={20} />}
                        onClick={() => handleUpdateConfig(selectedConfig)}
                      >
                        {t('update')}
                      </Button>
                    </Box>
                  </InputWrapper>
                </>
              )}
            </Box>
          ) : null}
        </Box>
      </Box>
    </TotalLayoutStepContainer>
  );
};

RulesConfig.propTypes = {
  t: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  configs: propTypes.array.isRequired,
  onSave: propTypes.func.isRequired,
  onPrevStep: propTypes.func.isRequired,
  onSend: propTypes.func.isRequired,
  hideButtons: propTypes.bool,
  onDeleteConfig: propTypes.func,
  onUpdateConfig: propTypes.func,
  isDrawer: propTypes.bool,
  defaultValues: propTypes.object,
  onChangeRules: propTypes.func,
};

export { RulesConfig };
