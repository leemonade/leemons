import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from 'assignables/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@content-creator/helpers/prefixPN';
import {
  AssignIcon,
  DuplicateIcon,
  PluginContentCreatorIcon,
  ViewOnIcon,
} from '@bubbles-ui/icons/outline';
import { useHistory } from 'react-router-dom';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deleteDocumentRequest, duplicateDocumentRequest } from '@content-creator/request';

const DocumentCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const DocumentListCard = ({ asset, selected, onRefresh, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('documentCard'));
  const { classes } = DocumentCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.providerData?.published) {
        items.push({
          icon: <ViewOnIcon />,
          children: t('view'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/content-creator/${asset.providerData.id}/view`);
          },
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditWriteIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/content-creator/${asset.providerData.id}/edit`);
          },
        });
      }
      if (asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/content-creator/${asset.providerData.id}/assign`);
          },
        });
      }

      if (asset.duplicable && asset.providerData) {
        items.push({
          icon: <DuplicateIcon />,
          children: t('duplicate'),
          onClick: (e) => {
            e.stopPropagation();
            openConfirmationModal({
              onConfirm: async () => {
                try {
                  setAppLoading(true);
                  await duplicateDocumentRequest(
                    asset.providerData.id,
                    asset.providerData.published
                  );
                  addSuccessAlert(t('duplicated'));
                  onRefresh();
                } catch (err) {
                  addErrorAlert(getErrorMessage(err));
                }
                setAppLoading(false);
              },
            })();
          },
        });
      }
      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon />,
          children: t('delete'),
          onClick: (e) => {
            e.stopPropagation();
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
          },
        });
      }
      // if (asset.shareable) {
      //   items.push({
      //     icon: null,
      //     children: t('share'),
      //     onClick: () => {},
      //   });
      // }
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="document"
      variantTitle={t('document')}
      variantIcon={<PluginContentCreatorIcon />}
      className={classes.root}
    />
  );
};

DocumentListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default DocumentListCard;
