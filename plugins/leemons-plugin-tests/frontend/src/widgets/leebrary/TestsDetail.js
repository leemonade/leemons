import React from 'react';
import PropTypes from 'prop-types';
// TODO: import from @library plugin
import { LibraryDetail } from '@leebrary/components';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import AssetMetadataTest from '@tests/components/AssetMetadataTest/AssetMetadataTest';
import { deleteTestRequest, duplicateRequest } from '../../request';

const TestsDetail = ({ asset, onRefresh, onShare, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('testsCard'));
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
    // if (asset.shareable) {
    //   toolbarItems.share = t('share');
    // }
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
    if (asset.pinned === false) {
      toolbarItems.pin = t('pin');
    }
    if (asset.pinned === true) {
      toolbarItems.unpin = t('unpin');
    }
    // duplicateRequest
  }

  const handleView = () => {
    history.push(`/private/tests/detail/${asset.providerData.id}`);
  };

  const handleEdit = () => {
    history.push(`/private/tests/${asset.providerData.id}`);
  };

  // const handleOnShare = () => {
  //   onShare(asset);
  // };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          setAppLoading(true);
          await deleteTestRequest(asset.providerData.id);
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
          await duplicateRequest(asset.providerData.id, asset.providerData.published);
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
    history.push(`/private/tests/assign/${asset.providerData.id}`);
  };

  // ·········································································
  // RENDER

  const metadata = [];

  if (asset?.providerData) {
    metadata.push({
      label: t('evaluation'),
      value: asset.providerData.gradable ? t('gradable') : t('nogradable'),
    });
  }
  if (asset?.providerData?.metadata?.questions?.length) {
    metadata.push({ label: t('questions'), value: asset.providerData.metadata.questions.length });
  }

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
        metadata,
      }}
      metadataComponent={
        <AssetMetadataTest
          metadata={{
            ...asset,
            metadata,
          }}
        />
      }
      // metadataComponent={<div>hello!</div>}
      variant="tests"
      variantTitle={t('tests')}
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
    // onShare={handleOnShare}
    />
  );
};

TestsDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default TestsDetail;
