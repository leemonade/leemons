import React from 'react';
import PropTypes from 'prop-types';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import { deleteTestRequest } from '../../request';

const TestsDetail = ({ asset, onRefresh, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const toolbarItems = {};

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
  }

  const handleView = () => {
    history.push(`/private/tests/detail/${asset.providerData.id}`);
  };

  const handleEdit = () => {
    history.push(`/private/tests/${asset.providerData.id}`);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          await deleteTestRequest(asset.providerData.id);
          addSuccessAlert(t('deleted'));
          onRefresh();
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
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
      label: t('gradable'),
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
    />
  );
};

TestsDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
};

export default TestsDetail;
