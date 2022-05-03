import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, ModalsProvider, useModals, Paragraph } from '@bubbles-ui/components';
import { NotificationProvider } from '@bubbles-ui/notifications';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from './src/helpers/prefixPN';
import { LayoutContext, LayoutProvider } from './src/context/layout';
import PrivateLayout from './src/components/PrivateLayout';

function LayoutWrapper({ isPrivate, children }) {
  if (isPrivate) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }
  return children;
}

LayoutWrapper.propTypes = {
  children: PropTypes.node,
  isPrivate: PropTypes.bool,
};

function LayoutProviderWrapper({ children }) {
  const [layoutState, setLayoutState] = useState({
    loading: false,
    contentRef: useRef(),
    isAcademicMode: true,
    profileChecked: false,
  });
  const location = useLocation();
  const modals = useModals();
  const [t] = useTranslateLoader(prefixPN('modals'));

  // TODO: Las traducciones se están tardando una eternidad, por eso al inicio se cargan solo las keys
  const openDeleteConfirmationModal =
    ({ title, description, labels, onCancel = () => {}, onConfirm = () => {} }) =>
    () =>
      modals.openConfirmModal({
        title: title || t('title.delete', { 'title.delete': 'Esta muriendo' }),
        children: (
          <Paragraph
            sx={(theme) => ({
              paddingBottom: theme.spacing[5],
            })}
          >
            {description || t('description.delete')}
          </Paragraph>
        ),
        labels: {
          confirm: labels?.confirm || t('buttons.confirm'),
          cancel: labels?.cancel || t('buttons.cancel'),
        },
        confirmProps: { color: 'fatic' },
        onCancel,
        onConfirm,
      });

  const openConfirmationModal =
    ({ title, description, labels, onCancel = () => {}, onConfirm = () => {} }) =>
    () =>
      modals.openConfirmModal({
        title: title || t('title.confirm'),
        children: (
          <Paragraph
            sx={(theme) => ({
              paddingBottom: theme.spacing[5],
            })}
          >
            {description || t('description.confirm')}
          </Paragraph>
        ),
        labels: {
          confirm: labels?.confirm || t('buttons.confirm'),
          cancel: labels?.cancel || t('buttons.cancel'),
        },
        onCancel,
        onConfirm,
      });

  const setPrivateLayout = (val) => {
    setLayoutState({ ...layoutState, private: val });
  };

  const setLoading = (loading) => {
    setLayoutState({ ...layoutState, loading });
  };

  const setContentRef = (contentRef) => {
    setLayoutState({ ...layoutState, contentRef });
  };

  const scrollTo = (props) => {
    if (!isNil(layoutState.contentRef?.current)) {
      layoutState.contentRef.current.scrollTo({ ...props, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location && location.pathname) {
      const isPrivate = location.pathname.indexOf('/private') === 0;
      setPrivateLayout(isPrivate);
    }
  }, [location]);

  return (
    <NotificationProvider leftOffset={layoutState.menuWidth}>
      <LayoutProvider
        value={{
          layoutState,
          setLayoutState,
          setPrivateLayout,
          setLoading,
          setContentRef,
          scrollTo,
          openDeleteConfirmationModal,
          openConfirmationModal,
          openModal: modals.openModal,
          closeModal: modals.closeModal,
        }}
      >
        <LayoutWrapper isPrivate={layoutState.private}>{children}</LayoutWrapper>
      </LayoutProvider>
    </NotificationProvider>
  );
}

LayoutProviderWrapper.propTypes = {
  children: PropTypes.node,
};

export function Provider({ children }) {
  return (
    <ThemeProvider>
      <ModalsProvider>
        <LayoutProviderWrapper>{children}</LayoutProviderWrapper>
      </ModalsProvider>
    </ThemeProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LayoutContext;
