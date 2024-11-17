import prefixPN from '@admin/helpers/prefixPN';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  ImageLoader,
  Stack,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';

const Styles = createStyles((theme) => ({
  cardsContainer: {
    display: 'flex',
    gap: theme.spacing[4],
    flexWrap: 'wrap',
  },
  card: {
    width: '282px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid',
    borderColor: theme.colors.ui03,
  },
  cardHeader: {
    height: '124px',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center',
  },
  cardTitle: {
    height: '41px',
    fontWeight: 600,
    fontSize: theme.fontSizes[3],
    color: theme.colors.text01,
  },
  cardTitleContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(247, 248, 250, 0.8)',
    paddingLeft: theme.spacing[3],
    paddingRight: theme.spacing[3],
    display: 'flex',
    alignItems: 'center',
  },
  cardNumber: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '41px',
    height: '41px',
    backgroundColor: 'rgba(247, 248, 250, 0.8)',
    borderRadius: '8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text02,
    fontSize: '32px',
  },
  cardBody: {
    padding: theme.spacing[4],
    fontSize: theme.fontSizes[2],
    color: theme.colors.text02,
  },
}));

function Card({ styles, headerColor, title, description, image, imageWidth, imageHeight, number }) {
  return (
    <Box className={styles.card}>
      <Box className={styles.cardHeader} style={{ backgroundColor: headerColor }}>
        <Box className={styles.cardNumber}>{number}</Box>
        <ImageLoader src={`/public/admin/${image}`} height={imageHeight} width={imageWidth} />
      </Box>
      <Box className={styles.cardTitle} style={{ backgroundColor: headerColor }}>
        <Box className={styles.cardTitleContainer}>{title}</Box>
      </Box>
      <Box className={styles.cardBody} dangerouslySetInnerHTML={{ __html: description }} />
    </Box>
  );
}

Card.propTypes = {
  styles: PropTypes.object,
  headerColor: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  number: PropTypes.number,
};

const Start = ({ onNextLabel, zoneTranslations, zone, onNext = () => {} }) => {
  const [t] = useTranslateLoader(prefixPN('setup.welcome'));

  const { classes: styles, cx } = Styles();

  // ····················································
  // HANDLERS
  const handleOnNext = () => {
    onNext();
  };

  return (
    <Box>
      <ContextContainer title={t('title')} description={t('description')} divided>
        <Box className={styles.cardsContainer}>
          <Card
            styles={styles}
            headerColor="#F4E6E6"
            number="1"
            title={t('organization')}
            image="organization.png"
            imageWidth={136}
            imageHeight={102}
            description={t('organizationDescription')}
          />
          <Card
            styles={styles}
            headerColor="#D8E8FF"
            number="2"
            title={t('mailProviders')}
            image="mail-provider.png"
            imageWidth={123}
            imageHeight={113}
            description={t('mailProvidersDescription')}
          />
          <Card
            styles={styles}
            headerColor="#FEFBE8"
            number="3"
            title={t('languages')}
            image="languages.png"
            imageWidth={140}
            imageHeight={112}
            description={t('languagesDescription')}
          />
          <Card
            styles={styles}
            headerColor="#E3EFDE"
            number="4"
            title={t('centers')}
            image="centers.png"
            imageWidth={143}
            imageHeight={101}
            description={t('centersDescription')}
          />
          <Card
            styles={styles}
            headerColor="#FEFBE8"
            number="5"
            title={t('profiles')}
            image="profile.png"
            imageWidth={133}
            imageHeight={101}
            description={t('profilesDescription')}
          />
          <Card
            styles={styles}
            headerColor="#EEEAF7"
            number="6"
            title={t('adminUsers')}
            image="admin-users.png"
            imageWidth={146}
            imageHeight={107}
            description={t('adminUsersDescription')}
          />
          {zone?.widgetItems.map((item, index) => (
            <Card
              key={item.id}
              styles={styles}
              headerColor={item.properties?.card?.headerColor}
              number={6 + index + 1}
              title={zoneTranslations[item.properties?.card?.title]}
              image={item.properties?.card?.image}
              imageWidth={item.properties?.card?.imageWidth}
              imageHeight={item.properties?.card?.imageHeight}
              description={zoneTranslations[item.properties?.card?.description]}
            />
          ))}
        </Box>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext}>{onNextLabel}</Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Start.defaultProps = {
  onNextLabel: 'Continue',
};
Start.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
  zone: PropTypes.any,
  zoneTranslations: PropTypes.any,
};

export { Start };
export default Start;
