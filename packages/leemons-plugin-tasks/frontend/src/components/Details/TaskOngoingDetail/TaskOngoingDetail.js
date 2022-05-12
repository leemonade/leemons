import React from 'react';
import { TaskHeader, AssetPlayer } from '@bubbles-ui/leemons';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { TextEditorInput } from '@bubbles-ui/editors';
import {
  Box,
  Text,
  Title,
  COLORS,
  Button,
  ScoresBar,
  ScoreInput,
  ScoreFeedback,
  VerticalStepper,
  ContextContainer,
} from '@bubbles-ui/components';
import { mock } from './mock/mock';

import { TaskOngoingDetailStyles } from './TaskOngoingDetail.styles';
import {
  TASK_ONGOING_DETAIL_DEFAULT_PROPS,
  TASK_ONGOING_DETAIL_PROP_TYPES,
} from './TaskOngoingDetail.constants';

const TaskOngoingDetail = ({ ...props }) => {
  const { classes, cx } = TaskOngoingDetailStyles({}, { name: 'TaskOngoingDetail' });
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Button
          variant="light"
          size="md"
          compact
          leftIcon={<ChevLeftIcon width={20} height={20} />}
          styles={{ zIndex: 5, color: COLORS.text04 }}
        >
          Back
        </Button>
        <TaskHeader {...mock.taskHeader} styles={{ position: 'absolute', bottom: 0 }} />
      </Box>
      <Box className={classes.mainContent}>
        <Box className={classes.verticalStepper}>
          <VerticalStepper {...mock.verticalStepper} currentStep={3} />
        </Box>
        <Box className={classes.detail}>
          <ContextContainer title={mock.previousTask}>
            <ScoreFeedback {...mock.scoreFeedback}>
              <Box className={classes.comments}>
                <Title order={2} color="secondary">
                  Comentarios
                </Title>
                <Box className={classes.scoreBarWrapper}>
                  <Box className={classes.scoreBarLeftLegend}>
                    <Box className={classes.legend}>
                      <Text role="productive" transform="uppercase" color="soft">
                        Contenidos dominados
                      </Text>
                      <Text role="productive" color="quartiary">
                        Marco historico
                      </Text>
                      <Text role="productive" color="quartiary">
                        Movimiento artistico
                      </Text>
                    </Box>
                    <Box className={classes.legend}>
                      <Text role="productive" transform="uppercase" color="soft">
                        Contenidos a repasar
                      </Text>
                      <Text role="productive" color="quartiary">
                        Marco politico
                      </Text>
                      <Text role="productive" color="quartiary">
                        Fechas clave
                      </Text>
                    </Box>
                  </Box>
                  <ScoresBar {...mock.scoreBar} />
                </Box>
              </Box>
            </ScoreFeedback>
          </ContextContainer>
          <ContextContainer title={mock.video}>
            <AssetPlayer {...mock.assetPlayer} />
          </ContextContainer>
          <ContextContainer title={mock.score}>
            <ScoreInput {...mock.scoreInput} />
          </ContextContainer>
          <ContextContainer title={mock.comments}>
            <TextEditorInput editorStyles={{ minHeight: 156 }} />
          </ContextContainer>
          <Box className={classes.submitButton}>
            <Button style={{ width: 360 }}>Calificar</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

TaskOngoingDetail.defaultProps = TASK_ONGOING_DETAIL_DEFAULT_PROPS;
TaskOngoingDetail.propTypes = TASK_ONGOING_DETAIL_PROP_TYPES;

export { TaskOngoingDetail };
