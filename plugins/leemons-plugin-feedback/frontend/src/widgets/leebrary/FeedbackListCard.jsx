import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components/LibraryCard';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deleteFeedbackRequest, duplicateFeedbackRequest } from '@feedback/request';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { FeedbackCardIcon } from '../../components/FeedbackCardIcon';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const FeedbackListCard = ({ asset, selected, onRefresh, onShare, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('feedbackCard'));
  const { classes } = ListCardStyles({ selected });
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
      // if (asset.providerData?.published) {
      //   items.push({
      //     icon: <ViewOnIcon />,
      //     children: t('view'),
      //     onClick: (e) => {
      //       e.stopPropagation();
      //       history.push(`/private/feedback/preview/${asset.providerData.id}`);
      //     },
      //   });
      // }
      if (asset.shareable && (asset.providerData?.published || asset.providerData === undefined)) {
        items.push({
          icon: <ShareIcon />,
          children: t('share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
      if (asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/feedback/assign/${asset.providerData.id}`);
          },
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/feedback/${asset.providerData.id}`);
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
                  await duplicateFeedbackRequest(
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
                  await deleteFeedbackRequest(asset.providerData.id);
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
      if (asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: t('share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'feedback' }}
      menuItems={menuItems}
      variant="feedback"
      variantTitle={t('feedback')}
      variantIcon={<FeedbackCardIcon />}
      className={classes.root}
    />
  );
};

FeedbackListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default FeedbackListCard;
