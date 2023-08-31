import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { DuplicateIcon, SwitchHorizontalIcon, AddCircleIcon } from '@bubbles-ui/icons/outline';
import { Paper, Box, Text, Button, Stack, Select, Menu } from '@bubbles-ui/components';
import { RuleCondition } from '../RuleCondition/';
import { LOGIC_OPERATORS } from '../ProgramRules';
import { RuleGroupStyles } from './RuleGroup.styles';

const PROPTYPES_SHAPE = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

export const RULE_GROUP_DEFAULT_PROPS = {};
export const RULE_GROUP_PROP_TYPES = {
  program: PROPTYPES_SHAPE,
  grades: PropTypes.arrayOf(PROPTYPES_SHAPE),
  sources: PropTypes.arrayOf(PROPTYPES_SHAPE),
  courses: PropTypes.arrayOf(PROPTYPES_SHAPE),
  knowledges: PropTypes.arrayOf(PROPTYPES_SHAPE),
  subjects: PropTypes.arrayOf(PROPTYPES_SHAPE),
  subjectTypes: PropTypes.arrayOf(PROPTYPES_SHAPE),
  subjectGroups: PropTypes.arrayOf(PROPTYPES_SHAPE),
  dataTypes: PropTypes.arrayOf(PROPTYPES_SHAPE),
  operators: PropTypes.arrayOf(PROPTYPES_SHAPE),
  index: PropTypes.number,
  draggableId: PropTypes.string,
  className: PropTypes.string,
  parentOperator: PROPTYPES_SHAPE,
  setParentOperator: PropTypes.func,
  parentGroup: PropTypes.object,
  group: PropTypes.object,
  data: PropTypes.object,
  setData: PropTypes.func,
  edited: PropTypes.array,
  setEdited: PropTypes.func,
  error: PropTypes.bool,
  setError: PropTypes.func,
  errorMessage: PropTypes.string,
  labels: PropTypes.shape({
    newRule: PropTypes.string,
    newRuleGroup: PropTypes.string,
    menuLabels: PropTypes.shape({
      remove: PropTypes.string,
      duplicate: PropTypes.string,
      turnIntoCondition: PropTypes.string,
      turnIntoGroup: PropTypes.string,
    }),
    where: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    selectItem: PropTypes.string,
    selectCourse: PropTypes.string,
    selectKnowledge: PropTypes.string,
    selectSubject: PropTypes.string,
    selectSubjectType: PropTypes.string,
    selectSubjectGroup: PropTypes.string,
    selectDataType: PropTypes.string,
    selectOperator: PropTypes.string,
    selectTargetGrade: PropTypes.string,
  }),
};

const RuleGroup = ({
  program,
  grades,
  gradeSystem,
  sources,
  courses,
  knowledges,
  subjects,
  subjectTypes,
  subjectGroups,
  dataTypes,
  operators,
  index,
  draggableId,
  className,
  parentOperator,
  setParentOperator,
  parentGroup,
  group,
  data,
  setData,
  edited,
  setEdited,
  error,
  setError,
  errorMessage,
  labels,
  placeholders,
  ...props
}) => {
  const { classes, cx } = RuleGroupStyles({}, { name: 'RuleGroup' });

  const [logicOperator, setLogicOperator] = useState(LOGIC_OPERATORS[0]);

  const addCondition = () => {
    group.conditions.push({
      id: uuidv4(),
      source: '',
      sourceIds: [],
      data: '',
      operator: '',
      target: 0,
    });
    setData({ ...data });
  };

  const addGroup = () => {
    group.conditions.push({
      id: uuidv4(),
      group: {
        operator: LOGIC_OPERATORS[0].value,
        conditions: [
          {
            id: uuidv4(),
            source: '',
            sourceIds: [],
            data: '',
            operator: '',
            target: 0,
          },
        ],
      },
    });
    setData({ ...data });
  };

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const [removed] = group.conditions.splice(source.index, 1);
    group.conditions.splice(destination.index, 0, removed);

    setData({ ...data });
  };

  const setGroupOperator = (value) => {
    parentGroup.operator = value;
    setData({ ...data });
  };

  const getLogicOperatorSelect = () => {
    if (index === 0) {
      return <Text role="productive">{labels.where}</Text>;
    }
    if (index === 1) {
      return (
        <Select
          className={classes.input}
          data={LOGIC_OPERATORS}
          value={parentOperator.value}
          onChange={(e) => {
            setParentOperator({ label: e.toUpperCase(), value: e });
            setGroupOperator(e);
          }}
        />
      );
    } else {
      return (
        <Box m={10}>
          <Text role="productive">{parentOperator.label}</Text>
        </Box>
      );
    }
  };

  const removeGroup = () => {
    parentGroup.conditions.splice(index, 1);
    setData({ ...data });
  };

  const duplicateGroup = () => {
    parentGroup.conditions.push({
      id: uuidv4(),
      group: {
        operator: group.operator,
        conditions: group.conditions.map((condition) => ({ ...condition, id: uuidv4() })),
      },
    });
    setData({ ...data });
  };

  const turnToCondition = () => {
    parentGroup.conditions.splice(index, 1);
    parentGroup.conditions.push(...group.conditions);
    setData({ ...data });
  };

  const uuid = uuidv4();
  const ruleGroup = (
    <Box className={classes.root}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={uuid}>
          {(provided, snapshot) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {group.conditions.map((condition, index) =>
                condition.group ? (
                  <RuleGroup
                    program={program}
                    grades={grades}
                    gradeSystem={gradeSystem}
                    sources={sources}
                    courses={courses}
                    knowledges={knowledges}
                    subjects={subjects}
                    subjectTypes={subjectTypes}
                    subjectGroups={subjectGroups}
                    dataTypes={dataTypes}
                    operators={operators}
                    key={condition.id}
                    draggableId={condition.id}
                    index={index}
                    className={classes.draggableGroup}
                    parentOperator={logicOperator}
                    setParentOperator={setLogicOperator}
                    parentGroup={group}
                    group={condition.group}
                    data={data}
                    setData={setData}
                    edited={edited}
                    setEdited={setEdited}
                    error={error}
                    setError={setError}
                    errorMessage={errorMessage}
                    labels={labels}
                    placeholders={placeholders}
                  />
                ) : (
                  <RuleCondition
                    program={program}
                    grades={grades}
                    gradeSystem={gradeSystem}
                    sources={sources}
                    courses={courses}
                    knowledges={knowledges}
                    subjects={subjects}
                    subjectTypes={subjectTypes}
                    subjectGroups={subjectGroups}
                    dataTypes={dataTypes}
                    operators={operators}
                    logicOperator={logicOperator}
                    setLogicOperator={setLogicOperator}
                    index={index}
                    draggableId={condition.id}
                    key={condition.id}
                    data={data}
                    setData={setData}
                    group={group}
                    condition={condition}
                    edited={edited}
                    setEdited={setEdited}
                    error={error}
                    setError={setError}
                    errorMessage={errorMessage}
                    labels={{
                      menuLabels: labels.menuLabels,
                      where: labels.where,
                    }}
                    placeholders={placeholders}
                  />
                )
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Stack direction={'column'} alignItems={'start'}>
        <Button
          variant="light"
          compact
          size="xs"
          leftIcon={<AddCircleIcon />}
          onClick={addCondition}
        >
          {labels.newRule}
        </Button>
        <Button variant="light" compact size="xs" leftIcon={<AddCircleIcon />} onClick={addGroup}>
          {labels.newRuleGroup}
        </Button>
      </Stack>
    </Box>
  );
  return draggableId ? (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <Box {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Box className={classes.ruleGroup}>
            {<Box className={classes.logicOperator}>{getLogicOperatorSelect()}</Box>}
            <Paper fullWidth className={className} padding={3}>
              {ruleGroup}
            </Paper>
            <Menu
              items={[
                {
                  children: labels.menuLabels.remove,
                  icon: <DeleteBinIcon />,
                  onClick: removeGroup,
                },
                {
                  children: labels.menuLabels.duplicate,
                  icon: <DuplicateIcon />,
                  onClick: duplicateGroup,
                },
                {
                  children: labels.menuLabels.turnIntoCondition,
                  icon: <SwitchHorizontalIcon />,
                  onClick: turnToCondition,
                },
              ]}
            />
          </Box>
        </Box>
      )}
    </Draggable>
  ) : (
    ruleGroup
  );
};

RuleGroup.defaultProps = RULE_GROUP_DEFAULT_PROPS;
RuleGroup.propTypes = RULE_GROUP_PROP_TYPES;

export { RuleGroup };
