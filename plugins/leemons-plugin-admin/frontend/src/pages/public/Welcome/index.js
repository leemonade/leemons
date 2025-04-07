import { Box, Button, ContextContainer, Paragraph, Select } from '@bubbles-ui/components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from 'react-simple-i18n';
import { HeroWrapper } from '../../../components/HeroWrapper';
import { LOCALES } from '../../../constants';
import localeContext from '../../../contexts/translations';
import { setLanguagesRequest } from '../../../request/settings';

const Welcome = () => {
  const { loadLocale, locale } = React.useContext(localeContext);
  const [state, setState] = React.useState({ lang: locale, loading: false });
  const { t } = useI18n();
  const navigate = useNavigate();

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

      navigate('/admin/signup');
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
