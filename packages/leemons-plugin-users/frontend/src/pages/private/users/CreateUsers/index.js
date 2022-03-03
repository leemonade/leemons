import React, { useMemo } from 'react';
import {
  Box,
  PageContainer,
  Stack,
  TableInput,
  TextInput,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { goDetailProfilePage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { useStore } from '@common';
import { useForm } from 'react-hook-form';
import { getSystemDataFieldsConfigRequest } from '../../../../request';

function CreateUsers() {
  const [t] = useTranslateLoader(prefixPN('create_users'));
  const [store, render] = useStore({});
  const { t: tCommon } = useCommonTranslate('page_header');
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const debouncedFunction = useDebouncedCallback(1000);

  const form = useForm();
  const history = useHistory();

  React.useEffect(() => {
    const subscription = form.watch((value, event) => {
      if (event.name === 'email') {
        debouncedFunction(() => {
          console.log('Se ejecuta');
          console.log(value, event);
        });
      }
    });
    return () => subscription.unsubscribe();
  });

  async function init() {
    const { config } = await getSystemDataFieldsConfigRequest();
    store.avatar = config.avatar;
    store.secondSurname = config.secondSurname;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  const data = useMemo(
    () => ({
      pageHeader: {
        title: t('pageTitle'),
      },
      tableColumns: [
        {
          Header: t('emailHeader'),
          accessor: 'email',
          className: 'text-left',
          input: {
            node: <TextInput required />,
            rules: { required: t('emailHeaderRequired') },
          },
          valueRender: (value) => <>{value?.name}</>,
        },
      ],
      tableLabels: {
        add: 'Add',
        remove: 'Remove',
      },
    }),
    [t, JSON.stringify(store.avatar), JSON.stringify(store.secondSurname)]
  );

  function onChange(e) {
    store.usersToCreate = e;
  }

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader
        values={data.pageHeader}
        buttons={{ new: tCommon('new') }}
        onNew={() => goDetailProfilePage(history)}
      />

      <PageContainer noFlex>
        <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <TableInput
            data={store.usersToCreate}
            onChange={onChange}
            form={form}
            columns={data.tableColumns}
            editable
            sortable={false}
            removable={false}
            labels={data.tableLabels}
          />
        </Box>
      </PageContainer>
    </Stack>
  );
}

export default CreateUsers;
