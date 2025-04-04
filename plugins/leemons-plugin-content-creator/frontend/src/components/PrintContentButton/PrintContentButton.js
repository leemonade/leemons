import React, { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { Box, Button } from "@bubbles-ui/components";
import { DownloadIcon } from "@bubbles-ui/icons/solid";
import ContentEditorInput from "@common/components/ContentEditorInput/ContentEditorInput";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import propTypes from "prop-types";

import { ContentToPrintStyles } from "./ContentToPrint.styles";

import prefixPN from "@content-creator/helpers/prefixPN";
import { processContentForPDF } from "@content-creator/helpers/processContentForPDF";
import useDocument from "@content-creator/request/hooks/queries/useDocument";

const PrintContentButton = ({
  content,
  title,
  assetId,
  variant = "button",
  onTrigger,
}) => {
  const { classes } = ContentToPrintStyles({}, { name: "ContentToPrint" });
  const [t] = useTranslateLoader(prefixPN("printContentButton"));

  const { data: documentData } = useDocument({
    id: assetId,
    isNew: false,
    enabled: !!assetId,
  });

  const processedContent = useMemo(() => {
    const contentToProcess = documentData?.content ?? content;
    if (!contentToProcess) {
      return null;
    }
    return processContentForPDF(contentToProcess, t);
  }, [documentData, content, t]);

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title ?? "",
    removeAfterPrint: true,
  });

  React.useEffect(() => {
    if (onTrigger) {
      onTrigger(handlePrint);
    }
  }, [onTrigger, handlePrint]);

  const variantType = {
    button: (
      <Button variant="outline" onClick={handlePrint}>
        {t("printPDF")}
      </Button>
    ),
    icon: (
      <DownloadIcon
        width={18}
        height={18}
        color="#2F463F"
        onClick={handlePrint}
        style={{ cursor: "pointer" }}
      />
    ),
  };

  if (!processedContent) {
    return null;
  }

  return (
    <>
      <Box style={{ display: "none" }}>
        <ContentEditorInput
          ref={printRef}
          readOnly
          value={processedContent}
          editorClassname={classes.printEditor}
          compact
        />
      </Box>
      {variantType[variant]}
    </>
  );
};

PrintContentButton.propTypes = {
  content: propTypes.string,
  title: propTypes.string,
  variant: propTypes.oneOf(["button", "icon"]),
  assetId: propTypes.string,
  onTrigger: propTypes.func,
};

export { PrintContentButton };
