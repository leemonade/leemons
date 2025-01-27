import { Box, Button, createStyles, Paper, Text, useClickOutside } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { useEvaluationData } from '../hooks/useEvaluationData';
import { useOnCloseEvaluation } from '../hooks/useOnCloseEvaluation';
import { StudentEvaluationData, TableData } from '../types';

import { PickRetakeTable } from './PickRetakeTable';

import { prefixPN } from '@scores/helpers';

type Props = {
  tableData: TableData;
  onCancel: () => void;
  onConfirm: (data: Record<string, StudentEvaluationData>) => void;
};

const useStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: globalTheme.content.color.text.emphasis,
      opacity: 0.24,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 16,
    },
    topBar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      justifyContent: 'flex-end',
    },
    title: {
      ...globalTheme.content.typo.heading.md,
    },
  };
});

export default function ModalContent({ tableData, onCancel, onConfirm }: Props) {
  const { classes } = useStyles(null, { name: 'CloseEvaluationModalContent' });
  const ref = useClickOutside(onCancel);
  const [t] = useTranslateLoader(prefixPN('pickRetakeTable'));

  const { students, retakes } = useEvaluationData(tableData);

  const onSubmit = useOnCloseEvaluation({ students, onConfirm });

  return (
    <Box className={classes.root}>
      <Box className={classes.backdrop} />

      <Paper className={classes.content} ref={ref}>
        <Box className={classes.topBar}>
          <Text color="tertiary" className={classes.title}>
            {t('title')}
          </Text>
          <Text>{t('description')}</Text>
        </Box>

        <Box className={classes.body}>
          <PickRetakeTable students={students} retakes={retakes} />
        </Box>

        <Box className={classes.footer}>
          <Button variant="link" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={onSubmit}>{t('confirm')}</Button>
        </Box>
      </Paper>
    </Box>
  );
}
