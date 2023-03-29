import {
  ContextContainer,
  Paper,
  PasswordInput,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import prefixPN from '@leebrary-aws-s3/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import React from 'react';

export default function AddLeebraryProvider() {
  const [t] = useTranslateLoader(prefixPN('provider'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({
    providers: [],
  });

  async function load() {
    try {
      const { config } = await leemons.api(`leebrary-aws-s3/config`, {
        allAgents: true,
        method: 'GET',
      });
      if (config) {
        store.providers = [config];
      }
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
    }
  }

  async function onBeforeAdd(config) {
    try {
      await leemons.api(`leebrary/providers/config`, {
        allAgents: true,
        method: 'POST',
        body: {
          provider: 'leebrary-aws-s3',
          config,
        },
      });
      store.providers = [config];
      render();
      return true;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
    }
  }

  async function onUpdate({ newItem }) {
    try {
      await leemons.api(`leebrary/providers/config`, {
        allAgents: true,
        method: 'POST',
        body: {
          provider: 'leebrary-aws-s3',
          config: newItem,
        },
      });
      store.providers = [newItem];
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function onBeforeRemove() {
    try {
      await leemons.api(`leebrary/providers/config/delete`, {
        allAgents: true,
        method: 'POST',
        body: {
          provider: 'leebrary-aws-s3',
        },
      });
      store.providers = [];
      render();
      return true;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return false;
    }
  }

  const columns = [
    {
      Header: t('bucket'),
      accessor: 'bucket',
      input: {
        node: <TextInput required />,
        rules: { required: t('fieldRequired') },
      },
    },
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
        node: <PasswordInput required />,
        rules: { required: t('fieldRequired') },
      },
      valueRender: () => '***********',
    },
  ];

  React.useEffect(() => {
    load();
  }, []);

  return (
    <Paper shadow="none" sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02 })}>
      <ContextContainer title={t('title')} description={t('description')}>
        <TableInput
          data={store.providers}
          columns={columns}
          showHeaders={!store.providers.length}
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
