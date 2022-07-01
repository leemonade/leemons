import React from 'react';
import { ContextContainer, Paper, TableInput, TextInput } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@emails-amazon-ses/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import * as PropTypes from 'prop-types';
import { addErrorAlert } from '@layout/alert';
import { saveProviderRequest } from '@emails/request';

TableInput.propTypes = {
  data: PropTypes.any,
  onChange: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.any),
  removable: PropTypes.bool,
  sortable: PropTypes.bool,
  labels: PropTypes.shape({ add: PropTypes.any, remove: PropTypes.any }),
};
export default function AddEmailProvider({ providers, onChange }) {
  const [t] = useTranslateLoader(prefixPN('provider'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  async function onBeforeAdd(config) {
    try {
      await saveProviderRequest({
        providerName: 'emails-amazon-ses',
        config: {
          name: 'Amazon SES',
          ...config,
        },
      });
      return true;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
    }
  }

  async function onUpdate({ oldItem, newItem }) {
    try {
      await saveProviderRequest({
        providerName: 'emails-amazon-ses',
        config: {
          id: oldItem.id,
          name: oldItem.name,
          ...newItem,
        },
      });
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  const columns = [
    {
      Header: t('region'),
      accessor: 'region',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
    {
      Header: t('accessKey'),
      accessor: 'accessKey',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
    {
      Header: t('secretAccessKey'),
      accessor: 'secretAccessKey',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
  ];

  return (
    <Paper shadow="none" sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02 })}>
      <ContextContainer title={t('title')} description={t('description')}>
        <TableInput
          data={providers}
          onBeforeAdd={onBeforeAdd}
          onUpdate={onUpdate}
          onChange={onChange}
          columns={columns}
          sortable={false}
          editable={true}
          removable={true}
          labels={{
            add: t('tableAdd'),
            edit: t('tableEdit'),
            remove: t('tableRemove'),
          }}
        />
      </ContextContainer>
    </Paper>
  );
}
AddEmailProvider.propTypes = {
  providers: PropTypes.array,
  onChange: PropTypes.func,
};
