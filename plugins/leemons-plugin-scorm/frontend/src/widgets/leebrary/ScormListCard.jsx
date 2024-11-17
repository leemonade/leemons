import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components/LibraryCard';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { prefixPN } from '@scorm/helpers';
import { deletePackageRequest, duplicatePackageRequest } from '@scorm/request';
import { ScormCardIcon } from '@scorm/components/icons';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';

const ScormCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const ScormListCard = ({ asset, selected, onRefresh, embedded, isEmbeddedList, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('scormCard'));
  const { classes } = ScormCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = useMemo(() => {
    const items = [];

    if (asset?.id) {
      // if (asset.providerData?.published) {
      //   items.push({
      //     icon: <ViewOnIcon />,
      //     children: t('view'),
      //     onClick: (e) => {
      //       e.stopPropagation();
      //       history.push(`/private/scorm/preview/${asset.providerData.id}`);
      //     },
      //   });
      // }
      if (asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/scorm/assign/${asset.providerData.id}`);
          },
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/scorm/${asset.providerData.id}`);
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
                  await duplicatePackageRequest(
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
          icon: <DeleteIcon />,
          children: t('delete'),
          onClick: (e) => {
            e.stopPropagation();
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
      asset={{ ...asset, fileType: 'assignables.scorm' }}
      menuItems={menuItems}
      variant="scorm"
      variantTitle="SCORM"
      variantIcon={<ScormCardIcon width={18} height={18} />}
      className={classes.root}
      embedded={embedded}
      isEmbededList={isEmbeddedList}
    />
  );
};

ScormListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
  isEmbeddedList: PropTypes.bool,
  embedded: PropTypes.bool,
};

export default ScormListCard;
