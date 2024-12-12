import { Box, ActionButton, Stack, Table, Text } from '@bubbles-ui/components';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';

import prefixPN from '@tests/helpers/prefixPN';

function DetailQuestionsList({ questions, onEditQuestion, onDeleteQuestion }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  const tableColumns = [
    {
      Header: t('questionLabel'),
      accessor: 'question',
      className: 'text-left',
    },
    {
      Header: t('responsesLabel'),
      accessor: 'responses',
      className: 'text-left',
    },
    {
      Header: t('typeLabel'),
      accessor: 'type',
      className: 'text-left',
    },
    {
      Header: t('actionsHeader'),
      accessor: 'actions',
      style: { textAlign: 'right' },
    },
  ];

  return (
    <Box>
      {questions?.length ? (
        <Table
          columns={tableColumns}
          data={map(questions, (question, i) => ({
            ...getQuestionForTable(question, t),
            actions: (
              <Stack justifyContent="end" fullWidth>
                <ActionButton
                  icon={<EditWriteIcon width={18} height={18} />}
                  onClick={() => onEditQuestion(i)}
                />
                <ActionButton
                  icon={<DeleteBinIcon width={18} height={18} />}
                  onClick={() => onDeleteQuestion(i)}
                />
              </Stack>
            ),
          }))}
        />
      ) : (
        <Stack
          spacing={8}
          justifyContent="center"
          alignItems="center"
          fullWidth
          sx={(theme) => ({
            padding: theme.spacing[8],
            backgroundColor: theme.other.global.background.color.surface.muted,
          })}
        >
          <Stack spacing={3} alignItems="flex-start">
            🧐
            <Text color="primary">{t('questionListEmpty')}</Text>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

DetailQuestionsList.propTypes = {
  questions: PropTypes.array.isRequired,
  onEditQuestion: PropTypes.func.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
};

export { DetailQuestionsList };
