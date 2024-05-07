/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  createStyles,
  Loader,
  Stack,
  Text,
  TextClamp,
  AvatarSubject,
} from '@bubbles-ui/components';
import { Swiper } from '@bubbles-ui/extras';
import { useStore } from '@common';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useHistory } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import getSubjectGroupCourseNamesFromClassData from '@academic-portfolio/helpers/getSubjectGroupCourseNamesFromClassData';
import { listSessionClassesRequest } from '../../request';
import { getClassImage } from '../../helpers/getClassImage';
import { getClassIcon } from '../../helpers/getClassIcon';

const Styles = createStyles((theme) => ({
  root: {
    overflow: 'auto',
    width: '100%',
  },
  cardContainer: {
    backgroundColor: theme.colors.ui02,
  },
  imageContainer: {
    position: 'relative',
    paddingRight: theme.spacing[2],
  },
  image: {
    height: '48px',
    width: '48px',
    borderRadius: '50%',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    backgroundColor: theme.colors.ui02,
    fontSize: '24px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
  },
  cardWrapper: {
    padding: 2,
    paddingRight: 0,
  },
  card: {
    padding: theme.spacing[6],
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    cursor: 'pointer',
    textAlign: 'center',
    transitionDuration: '100ms',
  },
  colorIcon: {
    position: 'absolute',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    right: '0px',
    bottom: '-2px',
    backgroundColor: theme.colors.uiBackground02,
    border: '2px solid',
    borderColor: theme.colors.uiBackground01,
    color: theme.colors.text07,
    img: {
      filter: 'brightness(0) invert(1)',
    },
  },
  icon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '16px',
    height: '16px',
    color: theme.colors.text07,
    img: {
      filter: 'brightness(0) invert(1)',
    },
  },
}));

function UserClassesSwiperWidget({ program }) {
  const { classes: styles } = Styles();
  const [store, render] = useStore({
    loading: true,
  });
  const [t] = useTranslateLoader(prefixPN('userClassesSwiperWidget'));

  const history = useHistory();

  async function load() {
    try {
      const { classes } = await listSessionClassesRequest({ program: program.id });
      store.classes = classes;
    } catch (error) {
      addErrorAlert(error);
      console.error(error);
    }
    store.loading = false;
    render();
  }

  function goClassDashboard(classe) {
    history.push(`/private/dashboard/class/${classe.id}`);
  }

  React.useEffect(() => {
    if (program) load();
  }, [program]);

  if (store.loading) return <Loader />;
  if (!store.classes) return null;

  return (
    <Box className={styles.root}>
      <Box
        sx={(theme) => ({
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '28px',
          marginBottom: theme.spacing[4],
        })}
      >
        {t('subjects')}
      </Box>
      <Swiper
        breakAt={{
          1800: { slidesPerView: 8, spaceBetween: 2 },
          1600: { slidesPerView: 7, spaceBetween: 2 },
          1200: { slidesPerView: 6, spaceBetween: 2 },
          940: { slidesPerView: 5, spaceBetween: 2 },
          520: { slidesPerView: 4, spaceBetween: 2 },
          360: { slidesPerView: 3, spaceBetween: 2 },
        }}
      >
        {store.classes.map((classe, index) => {
          const dataLabels = getSubjectGroupCourseNamesFromClassData(classe);

          const imageStyle = getClassImage(classe)
            ? { backgroundImage: `url(${getClassImage(classe)})` }
            : {};

          let nameFirstLetters = null;
          const nameArray = classe.subject.name.split(' ');
          if (nameArray.length > 1) {
            nameFirstLetters = nameArray[0][0] + nameArray[1][0];
          } else {
            nameFirstLetters = nameArray[0]?.[0];
          }
          return (
            <Box
              key={classe.id}
              className={styles.cardWrapper}
              style={{ paddingRight: index < store.classes.length - 1 ? 0 : 2 }}
            >
              <Stack
                className={styles.card}
                alignItems="center"
                direction="column"
                spacing={4}
                fullWidth
                onClick={() => goClassDashboard(classe)}
              >
                <Box className={styles.imageContainer}>
                  <Box
                    style={
                      classe.color ? { backgroundColor: classe.color, ...imageStyle } : imageStyle
                    }
                    className={styles.image}
                  >
                    {!imageStyle && nameFirstLetters}
                  </Box>

                  {classe.color || classe.icon ? (
                    <Box className={styles.colorIcon}>
                      <AvatarSubject color={classe.color} icon={getClassIcon(classe)} size="md" />
                    </Box>
                  ) : null}
                </Box>
                <Stack direction="column" spacing={2}>
                  <Box>
                    <TextClamp lines={2} showTooltip>
                      <Text color="primary" strong>
                        {dataLabels?.subject}
                      </Text>
                    </TextClamp>
                  </Box>
                  <Box>
                    <TextClamp lines={1} showTooltip>
                      <Text size="sm" strong>
                        {dataLabels?.courseAndGroupParsed}
                      </Text>
                    </TextClamp>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Swiper>
    </Box>
  );
}

UserClassesSwiperWidget.propTypes = {
  program: PropTypes.object.isRequired,
};

export default UserClassesSwiperWidget;
