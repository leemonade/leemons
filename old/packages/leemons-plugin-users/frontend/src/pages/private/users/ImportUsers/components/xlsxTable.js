/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import {
  Alert,
  Box,
  Button,
  Select,
  Table,
  Tooltip,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { AlertWarningTriangleIcon } from '@bubbles-ui/icons/solid';
import { ajv as Ajv, EMAIL_REGEX, transformErrorsFromAjv } from '@bubbles-ui/leemons';
import { useLocale, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { addUsersBulkRequest } from '../../../../../request';

const datasetArraySplitKey = '|';

const ajv = new Ajv({
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: 'auto',
  unknownFormats: 'ignore',
});

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

function getValue(locale, value) {
  if (value) {
    if (_.isDate(value)) {
      return value.toLocaleDateString(locale, dateOptions);
    }
    if (_.isObject(value)) {
      return value.text;
    }
    return value.toString();
  }
  return value;
}

function getValueErrorMessage({ value, t, tForm, headerValue, generalDataset }) {
  if (headerValue?.startsWith('dataset-common')) {
    const key = headerValue.split('.')[1];
    const property = generalDataset.jsonSchema.properties[key];
    if (property) {
      const isRequired = generalDataset.jsonSchema.required.indexOf(key) !== -1;
      const schema = {
        type: 'object',
        additionalProperties: false,
        required: isRequired ? [key] : [],
        properties: {},
      };
      let isArray = false;
      if (property.type === 'array') {
        isArray = true;
        schema.properties[key] = {
          type: 'array',
          items: property.items,
        };
      } else {
        schema.properties[key] = property;
      }
      const validate = ajv.compile(schema);
      const isValid = validate({
        [key]: value ? (isArray ? value.split(datasetArraySplitKey) : value) : value,
      });
      if (!isValid) {
        return transformErrorsFromAjv(validate.errors, tForm)[0].message;
      }
    }
  } else if (headerValue === 'email') {
    if (value) {
      let val = value;
      if (_.isObject(value)) {
        val = value.text;
      }
      if (!val.match(EMAIL_REGEX)) {
        return t('emailInvalid');
      }
    } else {
      return t('emailRequired');
    }
  } else if (headerValue === 'birthdate') {
    if (value) {
      if (!(Object.prototype.toString.call(value) === '[object Date]' || Number.isFinite(value))) {
        return t('birthdateInvalid');
      }
    } else {
      return t('birthdateRequired');
    }
  } else if (headerValue === 'gender') {
    if (value) {
      if (!['male', 'female'].includes(value)) {
        return t('genderInvalid');
      }
    } else {
      return t('genderRequired');
    }
  }
  return null;
}

export function XlsxTable({
  t,
  center,
  profile,
  file,
  initRow,
  fileIsTemplate,
  generalDataset,
  headerSelects,
  onSave = () => {},
}) {
  const [store, render] = useStore();
  const [tForm, tFormTrans] = useTranslateLoader('plugins.multilanguage.formWithTheme');
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const callback = useDebouncedCallback(100);

  function init() {
    store.headerValues = [];
    if (fileIsTemplate) {
      _.forEach(headerSelects, ({ value }) => {
        store.headerValues.push(value);
      });
    }
    render();
  }

  function checkSaveErrors() {
    store.errors = [];
    if (!store.headerValues.includes('email')) {
      store.errors.push(t('colEmailRequired'));
    }
    if (!store.headerValues.includes('name')) {
      store.errors.push(t('colNameRequired'));
    }
    if (!store.headerValues.includes('birthdate')) {
      store.errors.push(t('colBirthdateRequired'));
    }
    if (!store.headerValues.includes('gender')) {
      store.errors.push(t('colGenderRequired'));
    }
    if (generalDataset?.jsonSchema?.required) {
      _.forEach(generalDataset.jsonSchema.required, (key) => {
        if (!store.headerValues.includes(`dataset-common.${key}`)) {
          store.errors.push(
            t('colRequired', { name: generalDataset.jsonSchema.properties[key].title })
          );
        }
      });
    }
    if (store.errors.length) callback(render);
  }

  function load() {
    store.data = [];
    store.columns = [];
    store.hasErrors = false;
    const init = initRow - 1 >= 0 ? initRow - 1 : 0;
    for (let i = init, l = file.length; i < l; i++) {
      const item = file[i];
      if (init === i) {
        _.forEach(item, (value, key) => {
          const selectData = _.filter(
            _.cloneDeep(headerSelects),
            ({ value }) =>
              !store.headerValues.includes(value) ||
              value === 'tags' ||
              value === store.headerValues[key]
          );

          store.columns.push({
            Header: (
              <Box>
                <Select
                  data={[...selectData, { label: '-', value: '-' }]}
                  value={store.headerValues[key]}
                  onChange={(e) => {
                    store.headerValues[key] = e;
                    if (store.dirty) checkSaveErrors();
                    callback(render);
                  }}
                />
              </Box>
            ),
            accessor: key.toString(),
            valueRender: (value) => {
              const errorMessage = getValueErrorMessage({
                t,
                tForm,
                value,
                headerValue: store.headerValues[key],
                generalDataset,
              });
              if (errorMessage) {
                const oldHasError = !!store.hasErrors;
                store.hasErrors = true;
                if (oldHasError !== store.hasErrors) callback(render);
              }
              return (
                <Box
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                  })}
                >
                  {getValue(locale, value)}
                  {errorMessage ? (
                    <Tooltip label={errorMessage}>
                      <Box sx={(theme) => ({ color: theme.other.core.color.danger[500] })}>
                        <AlertWarningTriangleIcon />
                      </Box>
                    </Tooltip>
                  ) : null}
                </Box>
              );
            },
          });
        });
      }
      store.data.push(_.toPlainObject(item));
    }
    render();
  }

  function getFinalUsers() {
    const users = [];
    _.forEach(store.data, (data) => {
      const user = {};
      _.forEach(store.headerValues, (key, index) => {
        if (key && key !== '-') {
          if (key.startsWith('dataset-common')) {
            if (!_.isObject(user.dataset)) user.dataset = {};
            const propKey = key.split('.')[1];
            const isArray = generalDataset.jsonSchema.properties[propKey].type === 'array';

            if (isArray) {
              user.dataset[propKey] = {
                value: data[index] ? data[index].split(datasetArraySplitKey) : [],
              };
            } else {
              user.dataset[propKey] = {
                value: data[index],
              };
            }
          } else if (key === 'tags') {
            if (!_.isArray(user.tags)) user.tags = [];
            if (_.isString(data[index])) {
              user.tags.push(...data[index].split(','));
            }
          } else {
            user[key] = data[index];
            if (key === 'birthdate') {
              user[key] = new Date(user[key]);
            }
            if (_.isPlainObject(user[key])) {
              user[key] = user[key].text;
            }
          }
        }
      });
      if (user.tags?.length) {
        user.tags = _.uniq(user.tags);
      }
      users.push(user);
    });
    return users;
  }

  async function save() {
    try {
      store.dirty = true;
      checkSaveErrors();
      if (store.errors.length || store.hasErrors) return;
      store.loading = true;
      render();
      const users = getFinalUsers();

      await addUsersBulkRequest({
        users,
        center,
        profile,
      });
      onSave();
      addSuccessAlert(t(`usersAddedSuccessfully`));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (file && locale) init();
  }, [file, initRow, locale]);

  React.useEffect(() => {
    if (file && locale) load();
  }, [file, initRow, locale, tFormTrans, JSON.stringify(store.headerValues)]);

  return (
    <>
      <Table columns={store.columns} data={store.data} />

      {store.dirty && store.errors?.length ? (
        <Alert severity="error" closeable={false}>
          {store.errors.map((message) => (
            <Box key={message}>{message}</Box>
          ))}
        </Alert>
      ) : null}

      {store.dirty && store.hasErrors ? (
        <Alert severity="error" closeable={false}>
          {t('fieldsWithErrors')}
        </Alert>
      ) : null}

      <Box sx={() => ({ display: 'flex', justifyContent: 'end' })}>
        <Button onClick={save} loading={store.loading}>
          {t('save')}
        </Button>
      </Box>
    </>
  );
}

XlsxTable.propTypes = {
  t: PropTypes.func,
  file: PropTypes.any,
  onSave: PropTypes.func,
  center: PropTypes.string,
  profile: PropTypes.string,
  initRow: PropTypes.number,
  generalDataset: PropTypes.any,
  fileIsTemplate: PropTypes.bool,
  headerSelects: PropTypes.any,
};

export default XlsxTable;
