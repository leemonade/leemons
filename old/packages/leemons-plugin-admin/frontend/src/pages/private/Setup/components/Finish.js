import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  createStyles,
  ImageLoader,
  Paragraph,
  Title,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { logoutSession } from '@users/session';
import constants from '@users/constants';
import { useHistory } from 'react-router-dom';
import { updateSettingsRequest } from '@admin/request/settings';

const Styles = createStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Finish = () => {
  const [t] = useTranslateLoader(prefixPN('setup.finish'));
  const history = useHistory();

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
                <Button onClick={() => logoutSession(history, `/${constants.base}`)}>
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
