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
  cardText: {
    maxWidth: 200,
    textAlign: 'left',
  },
  colorIcon: {
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
        slidesPerView={'auto'}
      >
        {store.classes.map((classe, index) => {
          const dataLabels = getSubjectGroupCourseNamesFromClassData(classe);

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
                spacing={4}
                fullWidth
                onClick={() => goClassDashboard(classe)}
              >

                  {classe.color || classe.icon ? (
                    <Box className={styles.colorIcon}>
                      <AvatarSubject name={classe.subject.name} color={classe.color} icon={getClassIcon(classe)} size="xxlg" />
                    </Box>
                  ) : null}
                <Stack direction="column" spacing={0} justifyContent='start' alignItems='start' className={styles.cardText}>
                    <TextClamp lines={1} showTooltip>
                      <Text color="primary" strong>
                        {dataLabels?.subject}
                      </Text>
                    </TextClamp>
                    <TextClamp lines={1} showTooltip>
                      <Text size="sm" >
                        {dataLabels?.courseAndGroupParsed}
                      </Text>
                    </TextClamp>
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
