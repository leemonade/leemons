import prefixPN from '@admin/helpers/prefixPN';
import { updateSettingsRequest } from '@admin/request/settings';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  ImageLoader,
  Paragraph,
  Title,
  createStyles,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import constants from '@users/constants';
import { logoutSession } from '@users/session';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Styles = createStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Finish = () => {
  const [t] = useTranslateLoader(prefixPN('setup.finish'));
  const navigate = useNavigate();

  const { classes: styles, cx } = Styles();

  React.useEffect(() => {
    updateSettingsRequest({ configured: true });
  }, []);

  return (
    <Box>
      <ContextContainer title={t('title')}>
        <Box className={styles.container}>
          <ImageLoader src={`/public/admin/finish.png`} height={393} width={366} />
          <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>
            <ContextContainer>
              <Title order={2}>{t('readyToGo')}</Title>
              <Alert title={t('info')} variant="block" closeable={false}>
                {t('infoDescription')}
              </Alert>
              <Paragraph>{t('description')}</Paragraph>
              <Box>
                <Button onClick={() => logoutSession(navigate, `/${constants.base}`)}>
                  {t('nextButton')}
                </Button>
              </Box>
            </ContextContainer>
          </Box>
        </Box>
      </ContextContainer>
    </Box>
  );
};

Finish.defaultProps = {
  onNextLabel: 'Continue',
};
Finish.propTypes = {
  onNextLabel: PropTypes.string,
};

export { Finish };
export default Finish;
