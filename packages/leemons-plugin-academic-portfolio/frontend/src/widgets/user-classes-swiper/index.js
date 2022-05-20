/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, ImageLoader, Stack, Text, Swiper } from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray } from 'lodash';
import { useHistory } from 'react-router-dom';
import { listSessionClassesRequest } from '../../request';
import { getClassIcon } from '../../helpers/getClassIcon';
import { getClassImage } from '../../helpers/getClassImage';

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
    borderRadius: '2px',
    padding: theme.spacing[4],
    cursor: 'pointer',
  },
  colorIcon: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    right: '6px',
    bottom: '0px',
    backgroundColor: theme.colors.uiBackground02,
  },
  icon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    color: theme.colors.text07,
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

  if (store.loading || !store.classes) return null;

  return (
    <Box className={styles.root}>
      <Swiper
        className={styles.cardContainer}
        breakAt={{
          1200: { slidesPerView: 3, spaceBetween: 2 },
          940: { slidesPerView: 3, spaceBetween: 2 },
          520: { slidesPerView: 2, spaceBetween: 2 },
          360: { slidesPerView: 1, spaceBetween: 2 },
        }}
      >
        {store.classes.map((classe, index) => {
          const name = `${classe.subject.name} - ${classe.subject.internalId}`;
          const group = classe.groups ? classe.groups.abbreviation : null;
          const course = isArray(classe.courses)
            ? t('multiCourse')
            : classe.courses
            ? `${classe.courses.index}º`
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
                            src={getClassIcon(classe)}
                            strokeCurrent
                            fillCurrent
                          />
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
                <Stack direction="column">
                  <Text size="xs">{name}</Text>
                  <Text strong>
                    {course}
                    {group ? (course ? `- ${group}` : group) : null}
                  </Text>
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
