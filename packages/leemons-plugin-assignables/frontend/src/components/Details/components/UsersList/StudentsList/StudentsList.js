import sendReminder from '@assignables/requests/assignableInstances/sendReminder';
import { Box, Button, PaginatedList, RadioGroup } from '@bubbles-ui/components';
import { SendEmailEnvelopeIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

export default function StudentsList({ labels, instance, students }) {
  const { openConfirmationModal } = useLayout();
  const [store, render] = useStore({
    rememberType: 'open',
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  async function reminder() {
    openConfirmationModal({
      title: labels?.rememberModal?.title,
      description: (
        <Box>
          <RadioGroup
            direction="column"
            data={[
              { label: labels?.rememberModal?.notOpen, value: 'open' },
              {
                label: labels?.rememberModal?.notEnd,
                value: 'end',
              },
            ]}
            fullWidth
            onChange={(page) => {
              store.rememberType = page;
              render();
            }}
            value={store.rememberType}
          />
        </Box>
      ),
      labels: {
        confirm: labels?.rememberModal?.send,
      },
      onConfirm: async () => {
        try {
          const { rememberType } = store;
          // console.log(instance);
          await sendReminder({
            assignableInstanceId: instance.id,
            type: rememberType,
          });
          addSuccessAlert(labels?.rememberModal?.sended);
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
      },
    })();
  }

  const columns = useMemo(() => {
    const cols = [
      {
        Header: labels?.studentListcolumns?.student || '',
        accessor: 'student',
      },
      {
        Header: labels?.studentListcolumns?.status || '',
        accessor: 'status',
      },
      {
        Header: labels?.studentListcolumns?.completed || '',
        accessor: 'completed',
      },
      {
        Header: labels?.studentListcolumns?.avgTime || '',
        accessor: 'avgTime',
      },
      !!instance?.requiresScoring && {
        Header: labels?.studentListcolumns?.score || '',
        accessor: 'score',
      },
      !!instance?.requiresScoring && {
        Header: labels?.studentListcolumns?.unreadMessages || '',
        accessor: 'unreadMessages',
      },
      {
        Header: (
          <Button variant="link" leftIcon={<SendEmailEnvelopeIcon />} onClick={reminder}>
            {labels?.studentListcolumns?.sendReminder}
          </Button>
        ),
        accessor: 'actions',
      },
    ];

    return cols.filter(Boolean);
  }, [labels, instance?.requiresScoring]);

  const headerStyles = {
    position: 'sticky',
    top: '224px',
    backgroundColor: 'white',
    zIndex: 10,
  };

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [students]);

  return (
    <PaginatedList
      columns={columns}
      items={students.slice((page - 1) * size, page * size)}
      page={page}
      size={size}
      totalCount={students.length}
      totalPages={students.length / size}
      onPageChange={setPage}
      onSizeChange={setSize}
      selectable
      onStyleRow={({ row, theme }) => {
        if (row.original.userAgentIsDisabled) {
          return {
            backgroundColor: theme.other.core.color.neutral['100'],
          };
        }
      }}
      labels={labels?.pagination}
      headerStyles={headerStyles}
    ></PaginatedList>
  );
}

StudentsList.propTypes = {
  students: PropTypes.array,
  instance: PropTypes.object,
  labels: PropTypes.shape({
    studentListcolumns: PropTypes.shape({
      student: PropTypes.string,
      status: PropTypes.string,
      completed: PropTypes.string,
      avgTime: PropTypes.string,
      score: PropTypes.string,
      unreadMessages: PropTypes.string,
      sendReminder: PropTypes.string,
    }),
    rememberModal: PropTypes.shape({
      title: PropTypes.string,
      notOpen: PropTypes.string,
      notEnd: PropTypes.string,
      send: PropTypes.string,
      sended: PropTypes.string,
    }),
    pagination: PropTypes.object,
  }),
};
