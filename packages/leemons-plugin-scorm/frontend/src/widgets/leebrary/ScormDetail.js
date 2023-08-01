import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { prefixPN } from '@scorm/helpers';
import { deletePackageRequest, duplicatePackageRequest } from '@scorm/request';
import { CardVariantIcon } from '@scorm/components/icons';

const ScormDetail = ({ asset, onRefresh, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('scormCard'));
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const toolbarItems = { toggle: t('toggle'), open: t('open'), view: t('view') };

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
    history.push(`/private/scorm/preview/${asset.providerData.id}`);
  };

  const handleEdit = () => {
    history.push(`/private/scorm/${asset.providerData.id}`);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          setAppLoading(true);
          await deletePackageRequest(asset.providerData.id);
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
          await duplicatePackageRequest(asset.providerData.id, asset.providerData.published);
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
    history.push(`/private/scorm/assign/${asset.providerData.id}`);
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
      variantIcon={CardVariantIcon}
      toolbarItems={toolbarItems}
      titleActionButton={
        asset?.providerData?.published
          ? {
            icon: <ViewOnIcon height={16} width={16} />,
            onClick: handleView,
          }
          : null
      }
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAssign={handleAssign}
      onDuplicate={handleDuplicate}
    />
  );
};

ScormDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
};

export default ScormDetail;
