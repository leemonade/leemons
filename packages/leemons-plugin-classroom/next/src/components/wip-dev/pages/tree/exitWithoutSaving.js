import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, useModal } from 'leemons-ui';

export default function ExitWithoutSaving({
  onDiscard = () => {},
  onCancel = () => {},
  isShown = false,
}) {
  const [modal, toggleModal] = useModal({
    animated: true,
    title: 'Close without saving?',
    cancelLabel: 'Yes, exit and discard changes',
    actionLabel: 'No, return to edition',
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
      <p>If you leave the tree edition now you will lose the modifications made in this level.</p>
      <p className="mt-4">Do you want to exit without saving?</p>
    </Modal>
  );
}

ExitWithoutSaving.propTypes = {
  onDiscard: PropTypes.func,
  onCancel: PropTypes.func,
  isShown: PropTypes.bool,
};
