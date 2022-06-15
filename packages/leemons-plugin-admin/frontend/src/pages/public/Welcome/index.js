import React from 'react';
import { Box, Stack, Button, ContextContainer, Select } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { useI18n } from 'react-simple-i18n';
import localeContext from '../../../contexts/translations';
import { LOCALES } from '../../../constants';
import { setLanguagesRequest } from '../../../request/settings';

const Welcome = () => {
  const { loadLocale, locale } = React.useContext(localeContext);
  const [state, setState] = React.useState({ lang: locale, loading: false });
  const { t } = useI18n();
  const history = useHistory();

  const handleLocaleChange = (lang) => {
    setState({ ...state, lang });
    loadLocale(lang);
  };

  const handleNext = async () => {
    setState({ ...state, loading: true });
    try {
      const lang = LOCALES.find((item) => item.value === state.lang);

      await setLanguagesRequest({ code: lang.value, name: lang.label }, state.lang);

      history.push('/admin/signup');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box style={{ height: '100vh' }}>
      <Stack fullWidth fullHeight alignItems="center" justifyContent="center">
        <Box style={{ width: 400 }}>
          <ContextContainer title={t('welcome.title')} description={t('welcome.description')}>
            <Select
              label={t('welcome.selectLanguage')}
              value={state.lang}
              onChange={handleLocaleChange}
              data={LOCALES}
            />
            <Box>
              <Button onClick={handleNext} loading={state.loading}>
                {t('welcome.next')}
              </Button>
            </Box>
          </ContextContainer>
        </Box>
      </Stack>
    </Box>
  );
};

export default Welcome;
