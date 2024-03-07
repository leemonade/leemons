import React from 'react';
import PropTypes from 'prop-types';
import { PluginLearningPathsIcon } from '@bubbles-ui/icons/outline';
// TODO: import from @library plugin
import { LibraryDetail } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import duplicateModuleRequest from '@learning-paths/requests/duplicateModule';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import removeModuleRequest from '@learning-paths/requests/removeModule';
import { prefixPN } from '@learning-paths/helpers';
import { AssetMetadataModule } from '@learning-paths/components/AssetMetadataModule';
import { useListCardLocalizations } from './ListCard';

function Details({ asset, onRefresh, onShare, onPin, onUnpin, ...props }) {
  const { id, published } = asset?.providerData ?? {};
  // const name = asset?.name;
  // const role = asset?.role;

  // const isOwner = role === 'owner';

  const localizations = useListCardLocalizations();
  const [t] = useTranslateLoader(prefixPN('libraryCard.menuItems'));
  const {
    openDeleteConfirmationModal,
    openConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const history = useHistory();

  const toolbarItems = { toggle: t('toggle'), open: t('open'), view: t('view') };

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

    if (asset.duplicable) {
      toolbarItems.duplicate = t('duplicate');
    }

    // if (isOwner) {
    //   toolbarItems.share = t('share');
    // }
    if (asset.pinneable) {
      if (asset.pinned === false) {
        toolbarItems.pin = t('pin');
      }
      if (asset.pinned === true) {
        toolbarItems.unpin = t('unpin');
      }
    }
  }

  const handleView = () => {
    history.push(`/private/learning-paths/modules/${id}/view`);
  };
  const handleEdit = () => {
    history.push(`/private/learning-paths/modules/${id}/edit`);
  };

  const handleAssign = () => {
    history.push(`/private/learning-paths/modules/${id}/assign`);
  };

  const handleOnPin = () => {
    onPin(asset);
  };

  const handleOnUnpin = () => {
    onUnpin(asset);
  };

  const handleDuplicate = () => {
    openConfirmationModal({
      title: localizations?.duplicate?.title,
      description: localizations?.duplicate?.message?.replace('{{name}}', name),
      onConfirm: async () => {
        setAppLoading(true);
        try {
          await duplicateModuleRequest(id, { published: !!published });

          addSuccessAlert(localizations?.duplicate?.success?.replace('{{name}}', name));
          onRefresh();
        } catch (e) {
          addErrorAlert(
            localizations?.duplicate?.error?.replace('{{name}}', name),
            e.message ?? e.error
          );
        } finally {
          setAppLoading(false);
        }
      },
    })();
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      title: localizations?.delete?.title,
      description: localizations?.delete?.message?.replace('{{name}}', name),
      onConfirm: async () => {
        setAppLoading(true);
        try {
          await removeModuleRequest(id, { published: !!published });

          addSuccessAlert(localizations?.delete?.success?.replace('{{name}}', name));
          onRefresh();
        } catch (e) {
          addErrorAlert(
            localizations?.delete?.error?.replace('{{name}}', name),
            e.message ?? e.error
          );
        } finally {
          setAppLoading(false);
        }
      },
    })();
  };

  return (
    <LibraryDetail
      {...props}
      asset={asset}
      variant="task"
      metadataComponent={<AssetMetadataModule metadata={asset} />}
      variantIcon={<PluginLearningPathsIcon />}
      variantTitle={localizations.variantTitle}
      toolbarItems={toolbarItems}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
      onDuplicate={handleDuplicate}
      onAssign={handleAssign}
      onShare={onShare}
      onPin={handleOnPin}
      onUnpin={handleOnUnpin}
    />
  );
}

Details.propTypes = {
  asset: PropTypes.object,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
};

export default Details;
