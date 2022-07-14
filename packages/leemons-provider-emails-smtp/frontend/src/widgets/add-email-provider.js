import React from 'react';
import { cloneDeep, findIndex, map } from 'lodash';
import {
  ContextContainer,
  NumberInput,
  Paper,
  Switch,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@emails-smtp/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import * as PropTypes from 'prop-types';
import { addErrorAlert } from '@layout/alert';
import { removeProviderRequest, saveProviderRequest } from '@emails/request';

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
        providerName: 'emails-smtp',
        config: {
          name: 'SMTP',
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
      const index = findIndex(
        map(providers, (p) => ({ ...p, secure: !!p.secure })),
        { ...item, secure: !!item.secure }
      );
      const { provider } = await saveProviderRequest({
        providerName: 'emails-smtp',
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
      const index = findIndex(
        map(providers, (p) => ({ ...p, secure: !!p.secure })),
        { ...item, secure: !!item.secure }
      );
      await removeProviderRequest({
        providerName: 'emails-smtp',
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
      Header: t('secure'),
      accessor: 'secure',
      input: {
        node: <Switch />,
      },
      valueRender: (value) => t(value ? 'yes' : 'no'),
    },
    {
      Header: t('port'),
      accessor: 'port',
      input: {
        node: <NumberInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
    {
      Header: t('host'),
      accessor: 'host',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
    {
      Header: t('user'),
      accessor: 'user',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
    {
      Header: t('pass'),
      accessor: 'pass',
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
