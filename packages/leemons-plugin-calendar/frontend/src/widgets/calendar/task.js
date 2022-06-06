import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { get, map } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { listKanbanColumnsRequest } from '@calendar/request';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { DeleteBinIcon, EditorListBulletsIcon, PluginKanbanIcon } from '@bubbles-ui/icons/solid';
import { AddCircleIcon, PluginRedactorIcon, TagsIcon } from '@bubbles-ui/icons/outline';
import {
  ActionButton,
  Box,
  Button,
  Checkbox,
  Col,
  ContextContainer,
  Grid,
  InputWrapper,
  LoadingOverlay,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import { useLocale, useStore } from '@common';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import CardWrapper from '@leebrary/components/CardWrapper';

const { classByIdsRequest } = require('@academic-portfolio/request');

export default function Task({ event, form, classes, disabled, allProps }) {
  const locale = useLocale();
  const { classCalendars } = allProps;
  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  const [store, render] = useStore();

  const [t] = useTranslateLoader(prefixPN('task_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');
  const [columns, setColumns] = useState([]);
  const [columnsT, setColumnsT] = useState([]);

  const getKanbanColumns = async () => {
    const { columns: _columns } = await listKanbanColumnsRequest();
    setColumns(_.orderBy(_columns, ['order'], ['asc']));
  };

  const getTranslationColumns = async () => {
    const keys = _.map(columns, 'nameKey');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    setColumnsT(items);
  };

  const getColumnName = (name) => tKeys(name, columnsT);

  const columnsData = useMemo(() => {
    if (columns) {
      return map(columns, (column) => ({
        label: getColumnName(column.nameKey),
        value: column.id,
      }));
    }
    return null;
  }, [columns, columnsT]);

  useEffect(() => {
    if (event) {
      if (_.isObject(event.data)) {
        _.forIn(event.data, (value, key) => {
          form.setValue(key, value);
        });
      }
    }
    getKanbanColumns();
  }, []);

  async function loadInstance() {
    store.instance = await getAssignableInstance({ id: store.instanceId });
    store.classes = await classByIdsRequest(store.instance.classes);
    console.log(store.instance, store.classes);
    render();
  }

  useEffect(() => {
    if (allProps.defaultValues?.data?.instanceId) {
      store.instanceId = allProps.defaultValues.data.instanceId;
      loadInstance();
    }
  }, [allProps.defaultValues]);

  useEffect(() => {
    getTranslationColumns();
  }, [columns]);

  const addSubTask = () => {
    let subtask = form.getValues('subtask');
    if (!subtask) subtask = [];
    subtask.push({
      checked: false,
      title: '',
    });
    form.setValue('subtask', subtask);
  };

  const onInputCheckboxChange = (e, index) => {
    const subtask = form.getValues('subtask');
    subtask[index].title = e;
    form.setValue('subtask', subtask);
  };

  const onCheckedChange = (e, index) => {
    const subtask = form.getValues('subtask');
    subtask[index].checked = e;
    form.setValue('subtask', subtask);
    if (allProps.readOnly) {
      allProps.onSubmit(allProps.form.getValues(), { closeOnSend: false });
    }
  };
  const removeSubtask = (index) => {
    const subtask = form.getValues('subtask');
    subtask.splice(index, 1);
    form.setValue('subtask', subtask);
  };

  const subtask = form.watch('subtask');
  const formClasses = form.watch('classes');

  if (store.instanceId) {
    if (store.instance) {
      return (
        <CardWrapper
          onClick={() => {
            console.log('Holaaaaa');
          }}
          item={{ original: store.instance.assignable.asset }}
          category={`assignables.${store.instance.assignable.role}`}
          variant={store.instance.assignable.role}
          locale={locale}
          single
        />
      );
    }
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer>
      {!disabled || (disabled && form.getValues('description')) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <PluginRedactorIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    size="xs"
                    disabled={disabled}
                    readOnly={disabled}
                    label={t('description')}
                    error={get(errors, 'description')}
                    {...field}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
      ) : null}

      {!disabled || (disabled && subtask && subtask.length) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <EditorListBulletsIcon />
            </Col>
            <Col span={90}>
              <InputWrapper label={t('subtaskLabel')}>
                <Controller
                  name="subtask"
                  control={control}
                  render={({ field }) =>
                    field.value
                      ? field.value.map((item, index) => (
                          <Grid key={index} align="center" columns={100}>
                            <Col span={15}>
                              <Checkbox
                                // disabled={disabled}
                                checked={item.checked}
                                onChange={(e) => onCheckedChange(e, index)}
                              />
                            </Col>
                            <Col span={disabled ? 85 : 65}>
                              <TextInput
                                size="xs"
                                readOnly={disabled}
                                disabled={disabled}
                                value={item.title}
                                onChange={(e) => onInputCheckboxChange(e, index)}
                              />
                            </Col>
                            {!disabled ? (
                              <Col span={20}>
                                <ActionButton
                                  icon={<DeleteBinIcon />}
                                  onClick={() => removeSubtask(index)}
                                />
                              </Col>
                            ) : null}
                          </Grid>
                        ))
                      : null
                  }
                />
                {!disabled ? (
                  <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                    <Button
                      variant="light"
                      size="xs"
                      leftIcon={<AddCircleIcon />}
                      onClick={addSubTask}
                    >
                      {t('add_subtask')}
                    </Button>
                  </Box>
                ) : null}
              </InputWrapper>
            </Col>
          </Grid>
        </Box>
      ) : null}

      {classCalendars &&
      classCalendars.length &&
      (!disabled || (disabled && formClasses && formClasses.length)) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <TagsIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="classes"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    size="xs"
                    readOnly={disabled}
                    disabled={disabled}
                    data={classCalendars}
                    label={t('tags')}
                    error={get(errors, 'classes')}
                    {...field}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
      ) : null}

      {columnsData && (!disabled || (disabled && form.getValues('column'))) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <PluginKanbanIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="column"
                control={control}
                rules={{
                  required: tCommon('required'),
                }}
                render={({ field }) => (
                  <Select
                    size="xs"
                    label={t('column')}
                    disabled={disabled}
                    readOnly={disabled}
                    data={columnsData}
                    {...field}
                    required={!disabled}
                    error={get(errors, 'column')}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
      ) : null}
    </ContextContainer>
  );
}

Task.propTypes = {
  isEditing: PropTypes.bool,
  event: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  allFormData: PropTypes.object,
  tCommon: PropTypes.func,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  allProps: PropTypes.object,
};
