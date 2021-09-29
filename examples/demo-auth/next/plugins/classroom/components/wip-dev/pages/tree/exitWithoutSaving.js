import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, useModal } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';

export default function ExitWithoutSaving({
  onDiscard = () => {},
  onCancel = () => {},
  isShown = false,
}) {
  const [translations] = useTranslate({
    keysStartsWith: 'plugins.classroom.save_without_saving_modal',
  });
  const t = tLoader('plugins.classroom.save_without_saving_modal', translations);
  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('title'),
    cancelLabel: t('actions.discard'),
    actionLabel: t('actions.cancel'),
    overlayClose: false,
    onAction: onCancel,
    onCancel: onDiscard,
  });

  useEffect(() => {
    if (modal.isShown !== isShown) {
      toggleModal();
    }
  }, [isShown]);

  return (
    <Modal {...modal}>
      <p>{t('message.top')}</p>
      <p className="mt-4">{t('message.bottom')}</p>
    </Modal>
  );
}

ExitWithoutSaving.propTypes = {
  onDiscard: PropTypes.func,
  onCancel: PropTypes.func,
  isShown: PropTypes.bool,
};
