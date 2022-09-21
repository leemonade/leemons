import React from 'react';
import {LibraryDetail} from '@bubbles-ui/leemons';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import {addErrorAlert, addSuccessAlert} from '@layout/alert';
import {deleteQuestionBankRequest} from '@tests/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import {useLayout} from '@layout/context';

const QuestionsBanksDetail = ({asset, onRefresh, ...props}) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const {openConfirmationModal, openDeleteConfirmationModal} = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();
  const toolbarItems = {};

  if (asset?.id) {
    if (asset.editable) {
      toolbarItems.edit = t('edit');
    }
    if (asset.deleteable) {
      toolbarItems.delete = t('delete');
    }
  }

  // ·········································································
  // HANDLERS

  const handleEdit = () => {
    history.push(`/private/tests/questions-banks/${asset.providerData.id}`);
  };

  const handleDelete = () => {
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
  };

  // ·········································································
  // RENDER

  const metadata = [];

  if (asset?.providerData?.questions?.length) {
    metadata.push({label: t('questions'), value: asset.providerData.questions.length});
  }
  if (asset?.providerData?.categories?.length) {
    metadata.push({label: t('categories'), value: asset.providerData.categories.length});
  }

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
        metadata,
      }}
      variant="questionBank"
      variantTitle={t('questionBank')}
      toolbarItems={toolbarItems}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

QuestionsBanksDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
};

export default QuestionsBanksDetail;
