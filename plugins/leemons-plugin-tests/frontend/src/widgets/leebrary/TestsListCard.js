import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { ShareIcon } from '@bubbles-ui/icons/outline';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { useIsOwner } from '@leebrary/hooks/useIsOwner';
import { TestIcon } from '../../components/Icons/TestIcon';
import { deleteTestRequest, duplicateRequest } from '../../request';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const TestsListCard = ({ asset, selected, onRefresh, onShare, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { classes } = ListCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();
  const isOwner = useIsOwner(asset);

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      // if (asset.providerData?.published) {
      //   items.push({
      //     icon: <ViewOnIcon />,
      //     children: t('view'),
      //     onClick: (e) => {
      //       e.stopPropagation();
      //       history.push(`/private/tests/detail/${asset.providerData.id}`);
      //     },
      //   });
      // }
      if (asset.providerData?.published && asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: t('share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
      if (isOwner && asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/assign/${asset.providerData.id}`);
          },
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/${asset.providerData.id}`);
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
                  await duplicateRequest({
                    id: asset.providerData.id,
                    published: asset.providerData.published,
                    ignoreSubjects: !isOwner,
                    keepQuestionBank: isOwner,
                  });
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
                  await deleteTestRequest(asset.providerData.id);
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
    }

    return items;
  }, [asset, isOwner, t]);

  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'test' }}
      menuItems={menuItems}
      variant="tests"
      variantTitle={t('tests')}
      variantIcon={<TestIcon width={18} height={18} />}
      className={classes.root}
    />
  );
};

TestsListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default TestsListCard;
