import prefixPN from '@attendance-control/helpers/prefixPN';
import { ContextContainer, Drawer, Loader } from '@bubbles-ui/components';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';

export function AttendanceControlDrawer({ opened, onClose }) {
  const [store, render] = useStore({});
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlDrawer'));

  return (
    <Drawer size={430} opened={opened} onClose={onClose}>
      {store.loading ? <Loader /> : <ContextContainer title={t('title')}>miaudd</ContextContainer>}
    </Drawer>
  );
}

AttendanceControlDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AttendanceControlDrawer;
