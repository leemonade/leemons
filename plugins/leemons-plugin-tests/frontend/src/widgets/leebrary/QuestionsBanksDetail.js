import { LibraryDetail } from "@leebrary/components";

import useRequestErrorMessage from "@common/useRequestErrorMessage";
import { addErrorAlert, addSuccessAlert } from "@layout/alert";
import { useLayout } from "@layout/context";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { AssetMetadataQuestionBank } from "@tests/components/AssetMetadataQuestionBank";
import prefixPN from "@tests/helpers/prefixPN";
import { deleteQuestionBankRequest } from "@tests/request";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const QuestionsBanksDetail = ({ asset, onRefresh, onShare, ...props }) => {
  const [t] = useTranslateLoader(prefixPN("testsCard"));
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const navigate = useNavigate();
  const toolbarItems = {};

  if (asset?.id) {
    if (asset.editable) {
      toolbarItems.edit = t("edit");
    }
    if (asset.deleteable) {
      toolbarItems.delete = t("delete");
    }
    if (asset.pinned === false) {
      toolbarItems.pin = t("pin");
    }
    if (asset.pinned === true) {
      toolbarItems.unpin = t("unpin");
    }
    if (asset.shareable) {
      toolbarItems.share = t("share");
    }
  }

  // ·········································································
  // HANDLERS

  const handleEdit = () => {
    navigate(`/private/tests/questions-banks/${asset.providerData.id}`);
  };

  const handleDelete = () => {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          await deleteQuestionBankRequest(asset.providerData.id);
          addSuccessAlert(t("deleted"));
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
    metadata.push({
      label: t("questions"),
      value: asset.providerData.questions.length,
    });
  }
  if (asset?.providerData?.categories?.length) {
    metadata.push({
      label: t("categories"),
      value: asset.providerData.categories.length,
    });
  }

  return (
    <LibraryDetail
      {...props}
      asset={{
        ...asset,
        metadata,
      }}
      metadataComponent={
        <AssetMetadataQuestionBank
          metadata={{
            ...asset,
            metadata,
          }}
        />
      }
      variant="questionBank"
      variantTitle={t("questionBank")}
      toolbarItems={toolbarItems}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onShare={onShare}
    />
  );
};

QuestionsBanksDetail.propTypes = {
  asset: PropTypes.any,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default QuestionsBanksDetail;
