/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  createStyles,
  ImageLoader,
  Loader,
  Stack,
  Swiper,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray } from 'lodash';
import { useHistory } from 'react-router-dom';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import { addErrorAlert } from '@layout/alert';
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
  },
  cardWrapper: {
    padding: 2,
    paddingRight: 0,
  },
  card: {
    backgroundColor: theme.colors.uiBackground01,
    borderRadius: '4px',
    padding: theme.spacing[6],
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    cursor: 'pointer',
    textAlign: 'center',
    border: '2px solid',
    borderColor: theme.colors.uiBackground01,
    transitionDuration: '100ms',
    '&:hover': {
      borderColor: theme.colors.ui01,
    },
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
      <Swiper
        className={styles.cardContainer}
        breakAt={{
          1800: { slidesPerView: 6, spaceBetween: 2 },
          1600: { slidesPerView: 5, spaceBetween: 2 },
          1200: { slidesPerView: 4, spaceBetween: 2 },
          940: { slidesPerView: 4, spaceBetween: 2 },
          520: { slidesPerView: 3, spaceBetween: 2 },
          360: { slidesPerView: 2, spaceBetween: 2 },
        }}
      >
        {store.classes.map((classe, index) => {
          const name = `${classe.subject.name} - ${classe.subject.internalId}`;
          const group =
            !classe.groups || classe.groups.isAlone
              ? null
              : classe.groups
              ? classe.groups.abbreviation
              : null;
          const course =
            !classe.groups || classe.groups.isAlone
              ? null
              : isArray(classe.courses)
              ? t('multiCourse')
              : classe.courses
              ? getCourseName(classe.courses)
              : null;
          const imageStyle = getClassImage(classe)
            ? { backgroundImage: `url(${getClassImage(classe)})` }
            : {};
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
                  <Box className={styles.image} style={imageStyle} />
                  {classe.color || classe.icon ? (
                    <Box
                      style={classe.color ? { backgroundColor: classe.color } : {}}
                      className={styles.colorIcon}
                    >
                      {getClassIcon(classe) ? (
                        <Box className={styles.icon}>
                          <ImageLoader
                            height="12px"
                            width="12px"
                            imageStyles={{
                              width: 12,
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                            src={getClassIcon(classe)}
                            forceImage
                          />
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
                <Stack direction="column" spacing={2}>
                  <Box style={{ height: '32px' }}>
                    <TextClamp lines={2} showTooltip>
                      <Text color="primary" strong>
                        {name}
                      </Text>
                    </TextClamp>
                  </Box>
                  <Box style={{ height: '17px' }}>
                    <TextClamp lines={1} showTooltip>
                      <Text size="sm" strong>
                        {course}
                        {group ? (course ? `- ${group}` : group) : null}
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
