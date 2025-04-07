import { useNavigate } from "react-router-dom";

import { Button, TotalLayoutFooterContainer } from "@bubbles-ui/components";
import { ChevLeftIcon, ChevRightIcon } from "@bubbles-ui/icons/outline";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import PropTypes from "prop-types";

import prefixPN from "@assignables/helpers/prefixPN";

export function ActivityUnavailableFooter({ scrollRef, singlePage }) {
  const [t] = useTranslateLoader(prefixPN("activityNotStarted"));
  const navigate = useNavigate();

  return (
    <TotalLayoutFooterContainer
      fixed
      scrollRef={scrollRef}
      leftZone={
        <Button
          variant="outline"
          leftIcon={<ChevLeftIcon />}
          onClick={() => navigate(-1, { fallback: "/private/assignables/ongoing" })}
        >
          {t("back")}
        </Button>
      }
      rightZone={
        <Button rightIcon={!singlePage ? <ChevRightIcon /> : undefined} disabled>
          {singlePage ? t("finish") : t("next")}
        </Button>
      }
    />
  );
}

ActivityUnavailableFooter.propTypes = {
  scrollRef: PropTypes.object,
  singlePage: PropTypes.bool,
};
