import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  Paper,
  Switch,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@emails-smtp/helpers/prefixPN';
import { removeProviderRequest, saveProviderRequest } from '@emails/request';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { cloneDeep, findIndex, map } from 'lodash';
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
      },
    },
    {
      Header: t('pass'),
      accessor: 'pass',
      input: {
        node: <TextInput required />,
      },
    },
  ];

  return (
    <Paper shadow="none" sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02 })}>
      <ContextContainer title={t('title')} description={t('description')}>
        <Box>
          <Box>
            <Button
              color="primary"
              variant="link"
              size="xs"
              onClick={() =>
                window.open('https://support.google.com/mail/answer/7126229', '_blank', 'noopener')
              }
            >
              {t('gmail')}
            </Button>
          </Box>
          <Box>
            <Button
              color="primary"
              variant="link"
              size="xs"
              onClick={() =>
                window.open(
                  'https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040',
                  '_blank',
                  'noopener'
                )
              }
            >
              {t('outlook')}
            </Button>
          </Box>
          <Box>
            <Button
              color="primary"
              variant="link"
              size="xs"
              onClick={() =>
                window.open('https://help.yahoo.com/kb/SLN4724.html', '_blank', 'noopener')
              }
            >
              {t('yahoo')}
            </Button>
          </Box>
        </Box>

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
