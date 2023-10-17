import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Anchor,
  Box,
  Button,
  ContextContainer,
  Paragraph,
  Select,
  Stack,
  TableInput,
} from '@bubbles-ui/components';
import { isEmpty } from 'lodash';
import LocalePicker from '@admin/components/LocalePicker';
import { getLanguagesRequest, setLanguagesRequest } from '@admin/request/settings';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';

const Locales = ({ configured, onNextLabel, onNext = () => {} }) => {
  const [localesData, setLocalesData] = React.useState([]);
  const [locales, setLocales] = React.useState([]);
  const [defaultLocale, setDefaultLocale] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [t] = useTranslateLoader(prefixPN('setup'));

  const mounted = React.useRef(true);

  // ····················································
  // INITIAL DATA PROCESSING

  const loadLanguages = async () => {
    setLoading(true);
    try {
      const response = await getLanguagesRequest();

      if (response.langs && mounted.current) {
        const serverLocales = response.langs.locales.map(({ code }) => ({ code }));
        setLocales(serverLocales);
        setDefaultLocale(response.langs.defaultLocale);
      }

      if (mounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const saveLanguages = async () => {
    setLoading(true);
    const localesToSave = localesData
      .filter((item) => locales.map((lang) => lang.code).includes(item.value))
      .map((item) => ({ code: item.value, name: item.label }));

    try {
      await setLanguagesRequest(localesToSave, defaultLocale);

      if (mounted.current) {
        onNext();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLanguages();
    return () => {
      mounted.current = false;
    };
  }, []);

  // ····················································
  // HANDLERS

  const handleOnChange = (data) => {
    setLocales(data);
    if (data?.length === 1) {
      setDefaultLocale(data[0].code);
    }
  };

  const handleOnNext = () => {
    saveLanguages();
  };

  // ····················································
  // RENDER

  return (
    <Box>
      <ContextContainer
        title={t('languages.title')}
        description={t('languages.description')}
        divided
      >
        <ContextContainer>
          <Paragraph>{t('languages.intro')}</Paragraph>

          <Box style={{ maxWidth: 400 }}>
            <TableInput
              showHeaders
              sortable={false}
              columns={[
                {
                  Header: t('common.labels.selectLanguage'),
                  accessor: 'code',
                  input: {
                    node: <LocalePicker onLoadData={setLocalesData} />,
                    rules: { required: t('languages.required') },
                  },
                  editable: false,
                  valueRender: (value) => {
                    const locale = localesData.find((l) => l.value === value);
                    return locale?.label;
                  },
                },
              ]}
              labels={{
                add: t('languages.add'),
                remove: t('languages.remove'),
              }}
              data={locales}
              onBeforeRemove={() => locales?.length > 1}
              onBeforeAdd={(e) => !locales.find((item) => item.code === e.code)}
              onChange={handleOnChange}
            />
          </Box>
          {!isEmpty(locales) && (
            <Select
              label={t('languages.defaultLang.title')}
              description={t('languages.defaultLang.description')}
              data={localesData.filter((item) => locales.find((l) => l.code === item.value))}
              value={defaultLocale}
              onChange={setDefaultLocale}
              disabled={configured}
              contentStyle={{ maxWidth: 262 }}
            />
          )}
          <Alert type="info" closeable={false}>
            {t('languages.collaborate')}
            <Anchor href="https://github.io" target="_blank" external>
              Github
            </Anchor>
          </Alert>
        </ContextContainer>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext} loading={loading}>
            {onNextLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Locales.defaultProps = {
  onNextLabel: 'Save and continue',
};
Locales.propTypes = {
  configured: PropTypes.bool,
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Locales };
export default Locales;
