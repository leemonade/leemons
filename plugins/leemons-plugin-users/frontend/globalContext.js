import { Box, Button, Modal, Paragraph, Stack } from "@bubbles-ui/components";
import { useSocketConnected } from "@mqtt-socket-io/hooks/useSocketConnected";
import { SocketIoService } from "@mqtt-socket-io/service";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { SessionContext, SessionProvider } from "@users/context/session";
import { apiSessionMiddleware } from "@users/helpers/apiSessionMiddleware";
import prefixPN from "@users/helpers/prefixPN";
import { useUpdateUserProfile } from "@users/hooks";
import checkUserAgentDatasetsRequest from "@users/request/checkUserAgentDatasets";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Provider({ children }) {
  const [t] = useTranslateLoader(prefixPN("needDatasetDataModal"));
  const [showUpdateDatasetModal, setShowUpdateDatasetModal] = React.useState(false);
  const isSocketConnected = useSocketConnected();

  const navigate = useNavigate();
  const location = useLocation();

  useUpdateUserProfile();

  // ·································································
  // INITIAL DATA PROCCESSING

  useEffect(() => {
    leemons.api.useReq(apiSessionMiddleware);
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      checkUserAgentDatasetsRequest();
    }
  }, [isSocketConnected]);

  // ·································································
  // HANDLERS

  SocketIoService.useOn("USER_AGENT_NEED_UPDATE_DATASET", () => {
    if (
      !showUpdateDatasetModal &&
      location.pathname !== "/private/users/detail" &&
      !location.search.includes("editDataset=true")
    ) {
      setShowUpdateDatasetModal(true);
    }
  });

  function handleOnGoPage() {
    navigate("/private/users/detail?editDataset=true");
    setShowUpdateDatasetModal(false);
  }

  // ·································································
  // RENDER

  return (
    <SessionProvider value={{}}>
      <Modal
        title={t("title")}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        opened={showUpdateDatasetModal}
      >
        <Stack direction="column" spacing={4} fullWidth>
          <Box>
            <Paragraph>{t("description")}</Paragraph>
          </Box>
          <Stack fullWidth justifyContent="end">
            <Button onClick={handleOnGoPage}>{t("goPageButton")}</Button>
          </Stack>
        </Stack>
      </Modal>
      {children}
    </SessionProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default SessionContext;
