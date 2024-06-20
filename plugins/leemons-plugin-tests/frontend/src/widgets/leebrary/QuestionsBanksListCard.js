import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { deleteQuestionBankRequest } from '@tests/request';
import { useHistory } from 'react-router-dom';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';

import { QuestionBankIcon } from '../../components/Icons/QuestionBankIcon';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const QuestionsBanksListCard = ({ asset, selected, onRefresh, onShare, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const { classes } = ListCardStyles({ selected });
  const { openDeleteConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/questions-banks/${asset.providerData.id}`);
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
                  await deleteQuestionBankRequest(asset.providerData.id);
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
      if (asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: t('share'),
          onClick: onShare,
        });
      }
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'questionBank' }}
      menuItems={menuItems}
      variant="questionBank"
      variantTitle={t('questionBank')}
      variantIcon={<QuestionBankIcon width={18} height={18} />}
      className={classes.root}
    />
  );
};

QuestionsBanksListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default QuestionsBanksListCard;
