/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, createStyles, Paragraph, Stack, Title } from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray } from 'lodash';
import { listSessionClassesRequest } from '../../request';

const Styles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.uiBackground02,
  },
  imageContainer: {
    position: 'relative',
    paddingRight: theme.spacing[2],
  },
  card: {
    backgroundColor: theme.colors.uiBackground01,
    borderRadius: '2px',
    padding: theme.spacing[4],
    width: '250px',
    margin: '2px',
    marginLeft: '0px',
    '&:first-of-type': {
      marginLeft: '2px',
    },
  },
}));

function UserClassesSwiperWidget({ program }) {
  const { classes: styles } = Styles();
  const [store, render] = useStore({
    loading: true,
  });
  const [t] = useTranslateLoader(prefixPN('userClassesSwiperWidget'));

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

  React.useEffect(() => {
    if (program) load();
  }, [program]);

  if (store.loading || !store.classes) return null;

  return (
    <Stack className={styles.root}>
      {store.classes.map((classe) => {
        const name = `${classe.subject.name} - ${classe.subject.internalId}`;
        const group = classe.groups ? classe.groups.abbreviation : null;
        const course = isArray(classe.courses)
          ? t('multiCourse')
          : classe.courses
          ? `${classe.courses.index}º`
          : null;
        return (
          <Stack key={classe.id} className={styles.card}>
            <Box className={styles.imageContainer}>
              <Avatar size="md" />
            </Box>
            <Stack direction="column">
              <Paragraph>{name}</Paragraph>
              <Title order={6}>
                {course}
                {group ? (course ? `- ${group}` : group) : null}
              </Title>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

UserClassesSwiperWidget.propTypes = {
  program: PropTypes.object.isRequired,
};

export default UserClassesSwiperWidget;
