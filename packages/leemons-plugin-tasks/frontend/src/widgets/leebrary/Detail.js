import React from 'react';
import PropTypes from 'prop-types';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';

const Detail = ({ asset, onRefresh, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const toolbarItems = {};

  const handleClick = (url, target = 'self', callback) => {
    if (target === 'self') {
      history.push(url);
      return typeof callback === 'function' && callback('redirected', url);
    }

    if (target === 'api') {
      const [method, uri] = url.split('://');
      return leemons
        .api(uri, {
          method,
          allAgents: true,
        })
        .then((v) => typeof callback === 'function' && callback(v));
    }

    return null;
  };

  // ·········································································
  // HANDLERS

  if (asset?.id) {
    if (asset.editable) {
      toolbarItems.edit = t('edit');
    }
    if (asset.providerData?.published) {
      toolbarItems.assign = t('assign');
    }
    if (asset.deleteable) {
      toolbarItems.delete = t('delete');
    }
  }

  const handleEdit = () => {
    history.push(`/private/tasks/library/edit/${asset.providerData.id}`);
  };

  const handleAssign = () => {
    history.push(`/private/tasks/library/assign/${asset.providerData.id}`);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: () =>
        handleClick(`DELETE://tasks/tasks/${asset.providerData.id}`, 'api', () => {
          addSuccessAlert('Task deleted');
          onRefresh();
        }),
    })();
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
  console.log(asset);

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
        metadata,
      }}
      variant="task"
      variantTitle={t('task')}
      toolbarItems={toolbarItems}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onAssign={handleAssign}
    />
  );
};

Detail.propTypes = {
  asset: PropTypes.any,
};

export default Detail;
