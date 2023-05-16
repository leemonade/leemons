import { ContextContainer, Paper, TableInput, TextInput } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@emails-aws-ses/helpers/prefixPN';
import { removeProviderRequest, saveProviderRequest } from '@emails/request';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { cloneDeep, findIndex } from 'lodash';
import * as PropTypes from 'prop-types';
import React from 'react';

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
      const { provider } = await saveProviderRequest({
        providerName: 'emails-aws-ses',
        config: {
          name: 'Amazon SES',
          ...config,
        },
      });
      onChange([...providers, provider]);
      return true;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
    }
  }

  async function onUpdate({ oldItem, newItem }) {
    try {
      const { tableInputRowId, ...item } = oldItem;
      const index = findIndex(providers, item);
      const { provider } = await saveProviderRequest({
        providerName: 'emails-aws-ses',
        config: {
          id: providers[index].id,
          name: providers[index].name,
          ...newItem,
        },
      });

      const p = cloneDeep(providers);
      p[index] = provider;
      onChange(p);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function onBeforeRemove({ tableInputRowId, ...item }) {
    try {
      const index = findIndex(providers, item);
      await removeProviderRequest({
        providerName: 'emails-aws-ses',
        id: providers[index].id,
      });

      const p = cloneDeep(providers);
      p.splice(index, 1);
      onChange(p);
      return true;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
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
          columns={columns}
          onBeforeAdd={onBeforeAdd}
          onUpdate={onUpdate}
          onBeforeRemove={onBeforeRemove}
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
