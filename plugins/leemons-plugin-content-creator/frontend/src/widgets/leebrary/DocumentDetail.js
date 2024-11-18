/* eslint-disable prettier/prettier */
import { useHistory } from 'react-router-dom';

import { useIsStudent } from '@academic-portfolio/hooks';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { LibraryDetail } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { AssetMetadataContentCreator } from '@content-creator/components/AssetMetadataContentCreator';
import prefixPN from '@content-creator/helpers/prefixPN';
import { deleteDocumentRequest, duplicateDocumentRequest } from '@content-creator/request';

const DocumentDetail = ({ asset, onRefresh, onPin, onUnpin, onShare, ...props }) => {
  const isStudent = useIsStudent();
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
    if (asset.providerData?.published && !isStudent) {
      toolbarItems.assign = t('assign');
    }
    if (asset.duplicable) {
      toolbarItems.duplicate = t('duplicate');
    }
    if (asset.providerData?.published && asset.shareable) {
      toolbarItems.share = t('share');
    }
    if (asset.pinneable) {
      if (asset.pinned === false) {
        toolbarItems.pin = t('pin');
      }
      if (asset.pinned === true) {
        toolbarItems.unpin = t('unpin');
      }
    }
    toolbarItems.printPDF = t('download');
  }

  function handleOnPin(item) {
    onPin(item);
  }

  const handleOnUnpin = (item) => {
    onUnpin(item);
  };

  const handleOnShare = () => {
    onShare(asset);
  };

  const handleView = () => {
    history.push(`/private/content-creator/${asset.providerData.id}/view`);
  };

  const handleEdit = () => {
    history.push(`/private/content-creator/${asset.providerData.id}/edit`);
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
    history.push(`/private/content-creator/${asset.providerData.id}/assign`);
  };

  // ·········································································
  // RENDER

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
      }}
      metadataComponent={<AssetMetadataContentCreator metadata={asset} />}
      variant="document"
      isEmbedded={props.variant === 'embedded'}
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
      onPin={handleOnPin}
      onUnpin={handleOnUnpin}
      onDuplicate={handleDuplicate}
      onShare={handleOnShare}
    />
  );
};

DocumentDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
  variant: PropTypes.string,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onShare: PropTypes.func,
};

export default DocumentDetail;
