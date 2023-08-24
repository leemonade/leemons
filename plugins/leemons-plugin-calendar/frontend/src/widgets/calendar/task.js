import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import NYACard from '@assignables/components/NYACard';
import getClassData from '@assignables/helpers/getClassData';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  ActionButton,
  Box,
  Button,
  Checkbox,
  Col,
  ContextContainer,
  Divider,
  Grid,
  ImageLoader,
  InputWrapper,
  LoadingOverlay,
  MultiSelect,
  Select,
  Text,
  TextClamp,
  TextInput,
  Textarea,
} from '@bubbles-ui/components';
import { AddCircleIcon, PluginRedactorIcon, TagsIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, EditorListBulletsIcon, PluginKanbanIcon } from '@bubbles-ui/icons/solid';
import prefixPN from '@calendar/helpers/prefixPN';
import { listKanbanColumnsRequest } from '@calendar/request';
import { useLocale, useStore } from '@common';
import tKeys from '@multilanguage/helpers/tKeys';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import * as _ from 'lodash';
import { get, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { updateEventSubTasksRequest } from '../../request';

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
  const [columns, setColumns] = useState(allProps.parent.store.columns || []);
  const [columnsT, setColumnsT] = useState(allProps.parent.store.columnsT || []);

  // EN: Get the user agents
  // ES: Obtiene los user agents
  const userAgents = useUserAgents();
  // EN: This is valid while only one user agent is used
  // ES: Este es valido mientras solo se use un user agent a la vez
  const userAgent = userAgents[0];

  const getKanbanColumns = async () => {
    if (!allProps.parent.store.columns) {
      const { columns: _columns } = await listKanbanColumnsRequest();
      allProps.parent.store.columns = _columns;
    }
    setColumns(_.orderBy(allProps.parent.store.columns, ['order'], ['asc']));
  };

  const getTranslationColumns = async () => {
    const keys = _.map(columns, 'nameKey');
    if (!allProps.parent.store.columnsT && keys.length) {
      const { items } = await getLocalizationsByArrayOfItems(keys);
      allProps.parent.store.columnsT = items;
      setColumnsT(allProps.parent.store.columnsT);
    }
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
    if (!store.instance.students) {
      store.assignation = await getAssignation({ id: store.instanceId, user: userAgent });
    }
    store.classes = await classByIdsRequest(store.instance.classes);
    store.subjectData = await getClassData(store.instance.classes, {
      multiSubject: t('multiSubject'),
      groupName: store.instance?.metadata?.groupName,
    });
    render();
  }

  useEffect(() => {
    if (allProps.defaultValues?.data?.instanceId && userAgent) {
      store.instanceId = allProps.defaultValues.data.instanceId;
      loadInstance();
    }
  }, [allProps.defaultValues, userAgent]);

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

  const onCheckedChange = async (e, index) => {
    const subtask = form.getValues('subtask');
    subtask[index].checked = e;
    form.setValue('subtask', subtask);
    if (disabled) {
      try {
        allProps.parent.setSaving(true);
        await updateEventSubTasksRequest(allProps.parent.getEventId(), subtask);
        // eslint-disable-next-line no-param-reassign
        allProps.parent.defaultValues.data.subtask = subtask;
        allProps.parent.reloadCalendar();
        allProps.parent.addSuccessAlertUpdate();
      } catch (e) {
        allProps.parent.addErrorAlert(e);
      }
      allProps.parent.setSaving(false);
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
        <Box>
          <Box>
            <NYACard instance={store.assignation || store.instance} showSubject />
          </Box>
          {store.subjectData ? (
            <>
              <Box className={classes.divider}>
                <Divider />
              </Box>

              <InputWrapper label={t('classe')}>
                <Box className={classes.subject}>
                  <Box
                    className={classes.subjectIcon}
                    style={{ backgroundColor: store.subjectData.color }}
                  >
                    <ImageLoader
                      forceImage
                      height={12}
                      imageStyles={{ width: 12 }}
                      src={store.subjectData.icon}
                    />
                  </Box>
                  <TextClamp lines={1}>
                    <Text color="primary" role="productive" size="xs">
                      {store.subjectData.name}
                    </Text>
                  </TextClamp>
                </Box>
              </InputWrapper>
            </>
          ) : null}
        </Box>
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
