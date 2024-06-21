import React from 'react';
import PropTypes from 'prop-types';
import { LibraryDetail } from '@leebrary/components';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import { deleteFeedbackRequest, duplicateFeedbackRequest } from '@feedback/request';
import { AssetMetadataFeedback } from '../../components/AssetMetadataFeedback';

const FeedbackDetail = ({ asset, onRefresh, onPin, onUnpin, onShare, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('feedbackCard'));
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const toolbarItems = { toggle: t('toggle'), open: t('open') };

  // ·········································································
  // HANDLERS

  if (asset?.id) {
    if (asset.editable) {
      toolbarItems.edit = t('edit');
    }
    if (asset.shareable) {
      toolbarItems.share = t('share');
    }
    if (asset.deleteable) {
      toolbarItems.delete = t('delete');
    }
    if (asset.providerData?.published) {
      toolbarItems.assign = t('assign');
    }
    if (asset.duplicable) {
      toolbarItems.duplicate = t('duplicate');
    }
    if (asset.pinneable) {
      if (asset.pinned === false) {
        toolbarItems.pin = t('pin');
      }
      if (asset.pinned === true) {
        toolbarItems.unpin = t('unpin');
      }
    }
    if (asset.shareable) {
      toolbarItems.share = t('share');
    }
  }

  const handleView = () => {
    history.push(`/private/feedback/preview/${asset.providerData.id}`);
  };

  const handleEdit = () => {
    history.push(`/private/feedback/${asset.providerData.id}`);
  };
  const handleOnPin = () => {
    onPin(asset);
  };

  const handleOnUnpin = () => {
    onUnpin(asset);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          setAppLoading(true);
          await deleteFeedbackRequest(asset.providerData.id);
          addSuccessAlert(t('deleted'));
          onRefresh();
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        setAppLoading(false);
      },
    })();
  };

  const handleDuplicate = () => {
    openConfirmationModal({
      onConfirm: async () => {
        try {
          setAppLoading(true);
          await duplicateFeedbackRequest(asset.providerData.id, asset.providerData.published);
          addSuccessAlert(t('duplicated'));
          onRefresh();
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        setAppLoading(false);
      },
    })();
  };

  const handleOnShare = () => {
    onShare(asset);
  };

  const handleAssign = () => {
    history.push(`/private/feedback/assign/${asset.providerData.id}`);
  };

  // ·········································································
  // RENDER

  const metadata = [];

  if (asset?.providerData?.metadata?.questions) {
    metadata.push({ label: t('questions'), value: asset.providerData.metadata.questions });
  }

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
        metadata,
      }}
      metadataComponent={
        <AssetMetadataFeedback
          metadata={{
            ...asset,
            metadata,
          }}
        />
      }
      variant="feedback"
      variantTitle={t('feedback')}
      toolbarItems={toolbarItems}
      titleActionButton={
        asset?.providerData?.published
          ? {
              icon: <ViewOnIcon height={16} width={16} />,
              onClick: handleView,
            }
          : null
      }
      onEdit={handleEdit}
      onPin={handleOnPin}
      onUnpin={handleOnUnpin}
      onDelete={handleDelete}
      onAssign={handleAssign}
      onDuplicate={handleDuplicate}
      onShare={handleOnShare}
    />
  );
};

FeedbackDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onShare: PropTypes.func,
};

export default FeedbackDetail;
