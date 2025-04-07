import { Stack } from "@bubbles-ui/components";
import { useSearchParams } from "@common";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FinishedAlert from "./FinishedAlert";
import NotSubmittedAlert from "./NotSubmittedAlert";
import PendingEvaluationAlert from "./PendingEvaluationAlert";
import SubmittedAlert from "./SubmittedAlert";
import TimeoutAlert from "./TimeoutAlert";

export default function ActivityFeedbackAlertManager({ assignation, hasSubmission, isSubmitted }) {
  const params = useSearchParams();
  const navigate = useNavigate();

  const { instance } = assignation ?? {};

  const hasFinished = assignation?.timestamps?.end ?? instance?.finished;
  const isEvaluable = !!instance?.requiresScoring || !!instance?.allowFeedback;

  const isEvaluated = useMemo(
    () => !!assignation?.grades?.find((grade) => grade.type === "main"),
    [assignation?.grades]
  );

  if (hasSubmission) {
    return (
      <Stack direction="column" spacing="xl">
        {params.has("fromTimeout") && (
          <TimeoutAlert
            onClose={() => {
              params.delete("fromTimeout");

              navigate({ search: params.toString() }, { replace: true });
            }}
          />
        )}

        {params.has("fromExecution") && isSubmitted && (
          <SubmittedAlert
            onClose={() => {
              params.delete("fromExecution");
              navigate({ search: params.toString() }, { replace: true });
            }}
          />
        )}

        {!isSubmitted && <NotSubmittedAlert />}

        {!isEvaluated && !!isEvaluable && <PendingEvaluationAlert />}
      </Stack>
    );
  }

  if (hasFinished) {
    return (
      <Stack direction="column" spacing="xl">
        <FinishedAlert />
      </Stack>
    );
  }
}

ActivityFeedbackAlertManager.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      finished: PropTypes.bool,
      requiresScoring: PropTypes.bool,
      allowFeedback: PropTypes.bool,
    }),
    metadata: PropTypes.shape({
      submission: PropTypes.any,
    }),
    timestamps: PropTypes.shape({
      end: PropTypes.any,
    }),
    grades: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
      })
    ),
  }),
  hasSubmission: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};
