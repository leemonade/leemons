/* eslint-disable no-nested-ternary */
import prefixPN from '@admin/helpers/prefixPN';
import {
  getMailProvidersRequest,
  getPlatformEmailRequest,
  savePlatformEmailRequest,
} from '@admin/request/mails';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  Loader,
  Paragraph,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { flatten, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

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
  const [t] = useTranslateLoader(prefixPN('setup.mails'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    loading: true,
    activeProvider: null,
  });

  const totalProviders = flatten(map(store.providers, 'providers')).length;

  const { classes: styles, cx } = Styles();

  async function load() {
    try {
      const [{ providers }, { email }] = await Promise.all([
        getMailProvidersRequest(),
        getPlatformEmailRequest(),
      ]);

      store.email = email;
      store.providers = providers;
      store.loading = false;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function checkEmail() {
    store.emailError = null;
    // Check if not empty
    if (!store.email) {
      store.emailError = t('emailRequired');
    }
    // Check if valid email
    if (store.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(store.email)) {
      store.emailError = t('emailInvalid');
    }
  }

  async function handleOnNext() {
    try {
      store.dirty = true;
      store.saving = true;
      render();
      checkEmail();
      if (store.emailError === null && totalProviders) {
        await savePlatformEmailRequest(store.email);
        onNext();
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
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
      <ContextContainer title={t('title')} description={t('description')} divided>
        <ContextContainer>
          <Box>
            <Title order={4}>{t('defaultOrganizationEmail')}</Title>
            <Paragraph>{t('defaultOrganizationEmailDescription')}</Paragraph>
          </Box>
          <TextInput
            value={store.email}
            onChange={(e) => {
              store.email = e;
              render();
            }}
            error={store.emailError}
            label={t('organizationEmail')}
            required
          />
        </ContextContainer>
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
              <Box>
                <Button
                  variant="link"
                  onClick={() =>
                    window.open('https://github.com/leemonade/leemons', 'Github', 'noopener')
                  }
                >
                  {t('github')}
                </Button>
              </Box>
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
