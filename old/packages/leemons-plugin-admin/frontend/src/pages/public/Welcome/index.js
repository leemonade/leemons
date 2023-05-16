import React from 'react';
import { Box, Button, ContextContainer, Select, Paragraph } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { useI18n } from 'react-simple-i18n';
import localeContext from '../../../contexts/translations';
import { LOCALES } from '../../../constants';
import { setLanguagesRequest } from '../../../request/settings';
import { HeroWrapper } from '../../../components/HeroWrapper';

const Welcome = () => {
  const { loadLocale, locale } = React.useContext(localeContext);
  const [state, setState] = React.useState({ lang: locale, loading: false });
  const { t } = useI18n();
  const history = useHistory();

  // ·····················································
  // HANDLERS

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

  // ·····················································
  // RENDER

  return (
    <HeroWrapper quote={{ q: t('welcome.quote.title'), a: t('welcome.quote.description') }}>
      <ContextContainer title={t('welcome.title')} description={t('welcome.description')}>
        <Select
          placeholder={t('welcome.selectLanguage')}
          value={state.lang}
          onChange={handleLocaleChange}
          data={LOCALES}
        />
        <Paragraph>{t('welcome.disclaimer')}</Paragraph>
        <Box>
          <Button onClick={handleNext} loading={state.loading}>
            {t('welcome.next')}
          </Button>
        </Box>
      </ContextContainer>
    </HeroWrapper>
  );
};

export default Welcome;
