import React from 'react';
import PropTypes from 'prop-types';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@content-creator/helpers/prefixPN';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import { deleteDocumentRequest, duplicateDocumentRequest } from '@content-creator/request';

const DocumentDetail = ({ asset, onRefresh, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('documentCard'));
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
    if (asset.deleteable) {
      toolbarItems.delete = t('delete');
    }
    if (asset.providerData?.published) {
      toolbarItems.assign = t('assign');
    }
    if (asset.duplicable) {
      toolbarItems.duplicate = t('duplicate');
    }
    // if (asset.shareable) {
    //   toolbarItems.share = t('share');
    // }
  }

  const handleView = () => {
    history.push(`/private/content-creator/${asset.providerData.id}`);
  };

  const handleEdit = () => {
    history.push(`/private/content-creator/${asset.providerData.id}`);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          setAppLoading(true);
          await deleteDocumentRequest(asset.providerData.id);
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
          await duplicateDocumentRequest(asset.providerData.id, asset.providerData.published);
          addSuccessAlert(t('duplicated'));
          onRefresh();
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
        setAppLoading(false);
      },
    })();
  };

  const handleAssign = () => {
    history.push(`/private/content-creator/assign/${asset.providerData.id}`);
  };

  // ·········································································
  // RENDER

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
      }}
      variant="document"
      variantTitle={t('document')}
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
      onDelete={handleDelete}
      onAssign={handleAssign}
      onDuplicate={handleDuplicate}
    />
  );
};

DocumentDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
};

export default DocumentDetail;
