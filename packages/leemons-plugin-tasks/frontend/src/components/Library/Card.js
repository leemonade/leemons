import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { addSuccessAlert } from '@layout/alert';
import { DuplicateIcon, EditIcon, StudyDeskIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import getFakeImage from '../../helpers/getFakeImage';

export default function Card({ refresh, ...task }) {
  const history = useHistory();

  const handleClick =
    (url, target = 'self', callback) =>
    () => {
      if (target === 'self') {
        history.push(url);
        return typeof callback === 'function' && callback('redirected', url);
      }

      if (target === 'api') {
        const [method, uri] = url.split('://');
        return leemons
          .api(uri, {
            method,
            allAgents: true,
          })
          .then((v) => typeof callback === 'function' && callback(v));
      }

      return null;
    };

  const menuItems = useMemo(
    () => [
      {
        icon: <EditIcon />,
        children: 'Edit',
        onClick: handleClick(`/private/tasks/library/edit/${task.id}`),
      },
      // {
      //   icon: <DuplicateIcon />,
      //   children: 'Duplicate',
      //   onClick: handleClick(`/private/tasks/library/edit/${task.id}`),
      // },
      {
        icon: <StudyDeskIcon />,
        children: 'Assign',
        onClick: handleClick(`/private/tasks/library/assign/${task.id}`),
      },
      {
        icon: <DeleteBinIcon />,
        children: 'Delete',
        onClick: handleClick(`DELETE://tasks/tasks/${task.id}`, 'api', () => {
          addSuccessAlert('Task deleted');
          refresh();
        }),
      },
    ],
    [task]
  );

  return (
    <>
      <Box style={{ width: 322 }}>
        <LibraryCard
          dashboard={false}
          asset={{
            ...task,
            // TODO: Remove image
            cover: getFakeImage(task?.cover),
            subtitle: task.tagline,
            description: task.summary,
            type: 'task',
          }}
          menuItems={menuItems}
          showImage
          variant="task"
        />
      </Box>
    </>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
};
