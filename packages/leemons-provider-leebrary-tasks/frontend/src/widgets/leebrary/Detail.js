import React from 'react';
import PropTypes from 'prop-types';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';

const Detail = ({ asset, ...props }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const toolbarItems = {};

  // ·········································································
  // HANDLERS

  if (asset?.id) {
    if (asset.editable) {
      toolbarItems.edit = t('edit');
    }
    if (asset.providerData?.published) {
      toolbarItems.assign = t('assign');
    }
  }

  const handleEdit = () => {
    history.push(`/private/tasks/library/edit/${asset.providerData.id}`);
  };

  const handleAssign = () => {
    history.push(`/private/tasks/library/assign/${asset.providerData.id}`);
  };

  // ·········································································
  // RENDER

  const metadata = [];

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
      onEdit={handleEdit}
      onAssign={handleAssign}
    />
  );
};

Detail.propTypes = {
  asset: PropTypes.any,
};

export default Detail;
