/* eslint-disable no-shadow */
import { Box, Select, Table, Tooltip } from '@bubbles-ui/components';
import { AlertWarningTriangleIcon } from '@bubbles-ui/icons/solid';
import { EMAIL_REGEX } from '@bubbles-ui/leemons';
import { useLocale, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

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
    return value.toString();
  }
  return value;
}

function getValueErrorMessage({ value, t, headerValue }) {
  if (headerValue === 'email') {
    if (value) {
      if (!value.match(EMAIL_REGEX)) {
        return t('emailInvalid');
      }
    } else {
      return t('emailRequired');
    }
  }
  if (headerValue === 'birthdate') {
    if (value) {
      if (!(Object.prototype.toString.call(value) === '[object Date]' || Number.isFinite(value))) {
        return t('birthdateInvalid');
      }
    } else {
      return t('birthdateRequired');
    }
  }
  if (headerValue === 'gender') {
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

export function XlsxTable({ t, file, initRow, fileIsTemplate, headerSelects }) {
  const [store, render] = useStore();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();

  function init() {
    store.headerValues = [];
    if (fileIsTemplate) {
      _.forEach(headerSelects, ({ value }) => {
        store.headerValues.push(value);
      });
    }
    render();
  }

  function load() {
    store.data = [];
    store.columns = [];
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
                    render();
                  }}
                />
              </Box>
            ),
            accessor: key.toString(),
            valueRender: (value) => {
              const errorMessage = getValueErrorMessage({
                t,
                value,
                headerValue: store.headerValues[key],
              });
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

  React.useEffect(() => {
    if (file && locale) init();
  }, [file, initRow, locale]);

  React.useEffect(() => {
    if (file && locale) load();
  }, [file, initRow, locale, JSON.stringify(store.headerValues)]);

  return (
    <>
      <Table columns={store.columns} data={store.data} />
    </>
  );
}

XlsxTable.propTypes = {
  t: PropTypes.func,
  file: PropTypes.any,
  initRow: PropTypes.number,
  fileIsTemplate: PropTypes.bool,
  headerSelects: PropTypes.any,
};

export default XlsxTable;
