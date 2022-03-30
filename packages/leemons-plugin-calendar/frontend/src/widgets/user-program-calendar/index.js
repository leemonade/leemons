/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { listSessionClassesRequest } from '../../request';

const Styles = createStyles((theme) => ({
  root: {
    overflow: 'auto',
    width: '100%',
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

  return <Box className={styles.root}>aafssdf</Box>;
}

UserClassesSwiperWidget.propTypes = {
  program: PropTypes.object.isRequired,
};

export default UserClassesSwiperWidget;
