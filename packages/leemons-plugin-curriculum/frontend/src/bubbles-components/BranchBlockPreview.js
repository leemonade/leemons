import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Box, Button, createStyles, Text } from '@bubbles-ui/components';
import { CutStarIcon, EditWriteIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { PluginSubjectsIcon } from '@bubbles-ui/icons/outline';

const useStyle = createStyles((theme) => ({
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
}));

function BranchBlockPreview({ messages, item, selectData, onEdit = () => {} }) {
  const { classes } = useStyle();
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
        <Box className={classes.edit}>
          <Button variant="link" leftIcon={<EditWriteIcon />} onClick={onEdit}>
            {messages.tableEdit}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

BranchBlockPreview.propTypes = {
  messages: PropTypes.object,
  item: PropTypes.object,
  selectData: PropTypes.any,
  onEdit: PropTypes.func,
};

export default BranchBlockPreview;
