import useNextActivityUrl from "@assignables/hooks/useNextActivityUrl";
import { Box, Button, Modal, Text, Title, createStyles } from "@bubbles-ui/components";
import { ChevRightIcon } from "@bubbles-ui/icons/outline";
import { noop } from "lodash";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const useFinalizationModalStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing[1],
    alignItems: "center",
    gap: theme.spacing[6],
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing[4],
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSizes.lg,
  },
  centerButtons: {
    justifyContent: "center!important",
  },
  buttons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing[4],
  },
}));

export default function FinalizationModal({
  toggleModal,
  assignation,
  localizations,
  updateTimestamps = noop,
  actionUrl,
}) {
  const [opened, setOpened] = React.useState(false);
  const navigate = useNavigate();

  const nextActivityUrl = useNextActivityUrl(assignation);

  const moduleId = assignation.instance.metadata?.module?.id;
  const isModule = !!moduleId;
  const moduleDashboardUrl = `/private/learning-paths/modules/dashboard/${moduleId}`;

  React.useEffect(() => {
    toggleModal.current = () => setOpened(true);
  }, [setOpened]);

  React.useEffect(() => {
    if (opened) {
      updateTimestamps("end");
    }
  }, [updateTimestamps, opened]);

  React.useEffect(() => {
    if (opened && !assignation?.instance?.assignable?.submission?.type && nextActivityUrl) {
      navigate(nextActivityUrl);
    }
  }, [opened, nextActivityUrl]);

  const { cx, classes } = useFinalizationModalStyles();

  const hasNextActivity = assignation?.instance?.relatedAssignableInstances?.after?.length > 0;

  return (
    <Modal opened={opened} withCloseButton={false} size={hasNextActivity ? "lg" : undefined}>
      <Box className={classes.root}>
        <Box className={classes.text}>
          <Title className={classes.title}>{localizations?.title}</Title>
          <Text>{localizations?.description}</Text>
        </Box>
        <Box
          className={cx(classes.buttons, {
            [classes.centerButtons]: !hasNextActivity,
          })}
        >
          <Link
            to={isModule ? moduleDashboardUrl : actionUrl}
            target={hasNextActivity ? "_blank" : undefined}
          >
            <Button variant={hasNextActivity ? "link" : "filled"}>
              {isModule ? localizations?.goToModule : localizations?.action}
            </Button>
          </Link>
          {hasNextActivity && (
            <Link to={nextActivityUrl}>
              <Button
                variant="filled"
                onClick={() => setOpened(false)}
                rightIcon={<ChevRightIcon />}
              >
                {localizations?.nextActivity}
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
