/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
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
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import { getMailProvidersRequest } from '@admin/request/mails';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import loadable from '@loadable/component';

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
  return loadable(() => import(`@leemons/plugins/${pluginName}/src/widgets/add-email-provider.js`));
}

const MailProviders = ({ onNextLabel, onNext = () => {} }) => {
  const [t] = useTranslateLoader(prefixPN('setup'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    loading: true,
    activeProvider: null,
  });

  const { classes: styles, cx } = Styles();

  async function load() {
    try {
      const { providers } = await getMailProvidersRequest();
      store.providers = providers;
      store.loading = false;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function handleOnNext() {
    onNext();
  }

  React.useEffect(() => {
    load();
  }, []);

  const Provider = store.activeProvider ? dynamicImport(store.activeProvider) : () => null;

  return (
    <Box>
      <ContextContainer title={t('mails.title')} description={t('mails.description')} divided>
        <ContextContainer>
          <Title order={4}>{t('mails.chooseProvider')}</Title>
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
                      store.activeProvider === provider.providerName
                        ? styles.providerButtonActive
                        : null
                    )}
                    onClick={() => {
                      if (store.activeProvider === provider.providerName) {
                        store.activeProvider = null;
                      } else {
                        store.activeProvider = provider.providerName;
                      }
                      render();
                    }}
                  >
                    <img src={provider.image} alt={provider.providerName} />
                    <Text role="productive">{provider.name}</Text>
                  </Box>
                ))}
              </Stack>
              <Box>
                <Button
                  variant="link"
                  onClick={() => window.open('https://github.com/leemonade/leemons')}
                >
                  {t('mails.github')}
                </Button>
              </Box>
              <Provider />
            </>
          ) : (
            <Alert severity="error" closeable={false}>
              {t('mails.noProviders')}
            </Alert>
          )}
        </ContextContainer>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext} loading={store.saving}>
            {onNextLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

MailProviders.defaultProps = {
  onNextLabel: 'Save and continue',
};
MailProviders.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { MailProviders };
export default MailProviders;
