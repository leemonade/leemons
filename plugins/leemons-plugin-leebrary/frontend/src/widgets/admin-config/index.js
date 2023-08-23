/* eslint-disable no-nested-ternary */
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  createStyles,
  Loader,
  Stack,
  Text,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import prefixPN from '@leebrary/helpers/prefixPN';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { flatten, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { getProvidersRequest } from '../../request';

const Styles = createStyles((theme) => ({
  providerButton: {
    height: '70px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.colors.interactive03,
    border: `1px solid ${theme.colors.interactive03}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: theme.colors.interactive01,
    },
    img: {
      height: '16px',
      width: '16px',
      objectFit: 'contain',
      display: 'block',
      marginBottom: theme.spacing[2],
      filter: 'grayscale(100%)',
      transition: 'all 0.2s ease-in-out',
    },
  },
  providerButtonActive: {
    backgroundColor: theme.colors.mainWhite,
    borderColor: theme.colors.interactive01,
    img: {
      filter: 'grayscale(0%)',
    },
  },
}));

function dynamicImport(pluginName) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/add-leebrary-provider.js`)
  );
}

const AdminConfig = ({ onNextLabel, onNext = () => {} }) => {
  const [t] = useTranslateLoader(prefixPN('admin.setup'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    loading: true,
    activeProvider: null,
  });

  const totalProviders = flatten(map(store.providers, 'providers')).length;

  const { classes: styles, cx } = Styles();

  async function load() {
    try {
      const { providers } = await getProvidersRequest();

      store.providers = providers;
      store.loading = false;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function handleOnNext() {
    try {
      onNext();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  function onChange(items) {
    store.activeProvider.providers = items;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  const Provider = React.useMemo(
    () => (store.activeProvider ? dynamicImport(store.activeProvider.providerName) : () => null),
    [store.activeProvider]
  );

  return (
    <Box>
      <ContextContainer>
        <Title order={4}>{t('chooseProvider')}</Title>
        {store.loading ? (
          <Loader />
        ) : store.providers.length ? (
          <>
            <Stack spacing={4}>
              {store.providers.map((provider) => (
                <Box
                  key={provider.providerName}
                  className={cx(
                    styles.providerButton,
                    store.activeProvider?.providerName === provider.providerName
                      ? styles.providerButtonActive
                      : null
                  )}
                  onClick={() => {
                    if (store.activeProvider?.providerName === provider.providerName) {
                      store.activeProvider = null;
                    } else {
                      store.activeProvider = provider;
                    }
                    render();
                  }}
                >
                  <img src={provider.image} alt={provider.providerName} />
                  <Text role="productive">{provider.name}</Text>
                </Box>
              ))}
            </Stack>

            <Provider {...(store.activeProvider || {})} onChange={onChange} />
            {store.dirty && !totalProviders ? (
              <Alert title={t('error')} severity="error" closeable={false}>
                {t('defaultOrganizationEmailRequired')}
              </Alert>
            ) : null}
          </>
        ) : (
          <Alert severity="error" closeable={false}>
            {t('noProviders')}
          </Alert>
        )}
      </ContextContainer>
      <br />
      <br />
      <Stack style={{ width: '100%' }} justifyContent="end">
        <Button onClick={handleOnNext} loading={store.saving}>
          {onNextLabel}
        </Button>
      </Stack>
    </Box>
  );
};

AdminConfig.defaultProps = {
  onNextLabel: 'Save and continue',
};
AdminConfig.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { AdminConfig };
export default AdminConfig;
