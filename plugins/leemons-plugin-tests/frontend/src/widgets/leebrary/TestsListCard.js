/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
// TODO: import from @library plugin
import { LibraryCard } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
// import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import { TestIcon } from '../../components/Icons/TestIcon';
import { deleteTestRequest, duplicateRequest } from '../../request';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
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
      // if (asset.shareable) {
      //   items.push({
      //     icon: <ShareIcon />,
      //     children: t('share'),
      //     onClick: (e) => {
      //       e.stopPropagation();
      //       onShare(asset);
      //     },
      //   });
      // }
      if (asset.providerData?.published) {
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
                  await duplicateRequest(asset.providerData.id, asset.providerData.published);
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
  }, [asset, t]);

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
