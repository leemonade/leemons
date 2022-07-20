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

const Styles = createStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Finish = ({ onNextLabel, onNext = () => {} }) => {
  const [t] = useTranslateLoader(prefixPN('setup.finish'));

  const { classes: styles, cx } = Styles();

  // ····················································
  // HANDLERS
  const handleOnNext = () => {
    onNext();
  };

  return (
    <Box>
      <ContextContainer title={t('title')}>
        <Box className={styles.container}>
          <ImageLoader src={`/public/admin/finish.png`} height={393} width={366} />
          <ContextContainer>
            <Title order={2}>{t('readyToGo')}</Title>
            <Alert title={t('info')} variant="block" closeable={false}>
              {t('infoDescription')}
            </Alert>
            <Paragraph>{t('description')}</Paragraph>
            <Box>
              <Button>{t('nextButton')}</Button>
            </Box>
          </ContextContainer>
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
