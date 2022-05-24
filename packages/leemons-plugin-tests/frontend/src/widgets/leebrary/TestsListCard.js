import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { EditIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import { useHistory } from 'react-router-dom';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deleteTestRequest } from '../../request';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const TestsListCard = ({ asset, selected, onRefresh, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { classes } = ListCardStyles({ selected });
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.providerData.published) {
        items.push({
          icon: <ViewOnIcon />,
          children: t('view'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/detail/${asset.providerData.id}`);
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
      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon />,
          children: 'Delete',
          onClick: (e) => {
            e.stopPropagation();
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
          },
        });
      }
      if (asset.providerData.published) {
        items.push({
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/assign/${asset.providerData.id}`);
          },
        });
      }
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="tests"
      variantTitle={t('tests')}
      className={classes.root}
    />
  );
};

TestsListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default TestsListCard;
