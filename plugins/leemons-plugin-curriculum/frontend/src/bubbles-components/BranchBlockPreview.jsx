import { Box, Button, Collapse, createStyles, Text } from '@bubbles-ui/components';
import { ChevUpIcon, PluginSubjectsIcon } from '@bubbles-ui/icons/outline';
import { CutStarIcon, EditWriteIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = createStyles((theme, { isOpen }) => ({
  container: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    paddingBottom: theme.spacing[6],
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.colors.uiBackground04,
    padding: `${theme.spacing[3]}px ${theme.spacing[5]}px`,
    position: 'relative',
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: theme.spacing[3],
  },
  edit: {
    position: 'absolute',
    right: 80,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  chev: {
    position: 'absolute',
    right: 32,
    top: '50%',
    transform: isOpen ? 'translateY(-50%)' : 'translateY(-50%) rotate(180deg)',
    transition: '300ms',
    cursor: 'pointer',
  },
  content: {
    backgroundColor: theme.colors.uiBackground02,
    padding: `${theme.spacing[3]}px ${theme.spacing[5]}px`,
  },
  table: {
    width: '100%',
  },
  tr: {
    borderBottom: `1px solid ${theme.colors.ui01}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  td: {
    padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
  },
}));

function BranchBlockPreview({ messages, item, onlyCanAdd, selectData, onEdit = () => {} }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { classes } = useStyle({ isOpen });
  const data = item.frontConfig.blockData;

  const icon = React.useMemo(() => {
    switch (data.curricularContent) {
      case 'knowledges':
        return <PluginSubjectsIcon className={classes.icon} />;
      case 'qualifying-criteria':
        return <StarIcon className={classes.icon} />;
      case 'non-qualifying-criteria':
        return <CutStarIcon className={classes.icon} />;
      default:
        return null;
    }
  }, [item]);

  const curricularText = React.useMemo(() => {
    switch (data.curricularContent) {
      case 'knowledges':
        return messages.curricularKnowledges;
      case 'qualifying-criteria':
        return messages.curricularQualifyingCriteria;
      case 'non-qualifying-criteria':
        return messages.curricularNonQualifyingCriteria;
      default:
        return null;
    }
  }, [item]);

  const type = React.useMemo(() => {
    let t = find(selectData.blockType, { value: data.type }).label;
    if (data.type === 'list') {
      t += ` (${find(selectData.blockType, { value: data.listType }).label})`;
    }
    return t;
  }, [item]);

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        {icon}
        <Box>
          <Box>
            <Text stronger size="md" role="productive" color="primary">
              {data.name}
            </Text>
          </Box>
          <Box>
            <Text role="productive" color="primary">
              {curricularText}, {type}
            </Text>
          </Box>
        </Box>
        {!onlyCanAdd ? (
          <Box className={classes.edit}>
            <Button variant="link" leftIcon={<EditWriteIcon />} onClick={onEdit}>
              {messages.tableEdit}
            </Button>
          </Box>
        ) : null}

        {data.type === 'group' ? (
          <Box
            className={classes.chev}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <ChevUpIcon />
          </Box>
        ) : null}
      </Box>
      {data.type === 'group' ? (
        <Collapse in={isOpen}>
          <Box className={classes.content}>
            <table className={classes.table}>
              {data.elements.map((el) => (
                <tr className={classes.tr}>
                  {data.columns.map((col) => (
                    <td className={classes.td}>{el[col.id]}</td>
                  ))}
                </tr>
              ))}
            </table>
          </Box>
        </Collapse>
      ) : null}
    </Box>
  );
}

BranchBlockPreview.propTypes = {
  messages: PropTypes.object,
  item: PropTypes.object,
  selectData: PropTypes.any,
  onlyCanAdd: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default BranchBlockPreview;
