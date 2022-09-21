import React from 'react';
import PropTypes from 'prop-types';
import {createStyles} from '@bubbles-ui/components';
import {LibraryCard} from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import {DeleteBinIcon, EditWriteIcon} from '@bubbles-ui/icons/solid';
import {addErrorAlert, addSuccessAlert} from '@layout/alert';
import {deleteQuestionBankRequest} from '@tests/request';
import {useHistory} from 'react-router-dom';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import {useLayout} from '@layout/context';

const ListCardStyles = createStyles((theme, {selected}) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const QuestionsBanksListCard = ({asset, selected, onRefresh, ...props}) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const {classes} = ListCardStyles({selected});
  const {openConfirmationModal, openDeleteConfirmationModal} = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.editable) {
        items.push({
          icon: <EditWriteIcon/>,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/tests/questions-banks/${asset.providerData.id}`);
          },
        });
      }
      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon/>,
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
    }

    return items;
  }, [asset, t]);

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="questionBank"
      variantTitle={t('questionBank')}
      className={classes.root}
    />
  );
};

QuestionsBanksListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default QuestionsBanksListCard;
