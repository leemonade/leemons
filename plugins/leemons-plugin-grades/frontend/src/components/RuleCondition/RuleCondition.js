import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { filter } from 'lodash';
import {
  Box,
  Menu,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { DuplicateIcon, SwitchHorizontalIcon } from '@bubbles-ui/icons/outline';
import { LOGIC_OPERATORS } from '../ProgramRules';
import { RuleConditionStyles } from './RuleCondition.styles';

const PROPTYPES_SHAPE = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

export const RULE_CONDITION_DEFAULT_PROPS = {};
export const RULE_CONDITION_PROP_TYPES = {
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
  logicOperator: PROPTYPES_SHAPE,
  setLogicOperator: PropTypes.func,
  index: PropTypes.number,
  draggableId: PropTypes.string,
  data: PropTypes.object,
  setData: PropTypes.func,
  condition: PropTypes.object,
  group: PropTypes.object,
  edited: PropTypes.array,
  setEdited: PropTypes.func,
  error: PropTypes.bool,
  labels: PropTypes.shape({
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

const RuleCondition = ({
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
  logicOperator,
  setLogicOperator,
  index,
  draggableId,
  data,
  setData,
  condition,
  group,
  edited,
  setEdited,
  error,
  setError,
  errorMessage,
  labels,
  placeholders,
  ...props
}) => {
  const { classes, cx } = RuleConditionStyles({}, { name: 'RuleCondition' });

  const [sourceValue, setSourceValue] = useState(condition.source || '');
  const [sourceIdsValue, setSourceIdsValue] = useState(condition.sourceIds || []);
  const [dataType, setDataType] = useState(condition.data || '');
  const [operatorValue, setOperatorValue] = useState(condition.operator || '');
  const [targetValue, setTargetValue] = useState(condition.target || '');
  const isFirstRenderRef = useRef(true);

  const setNewData = (e, field) => {
    if (field === 'source') {
      condition[field] = e;
      condition.sourceIds = [];
      setSourceIdsValue([]);
      if (e === 'program') {
        condition.sourceIds = [program.value];
        setSourceIdsValue([program.value]);
      }
    }
    if (field === 'sourceIds') setSourceIdsValue(e);
    if (field === 'data' && e === 'enrolled') {
      delete condition.target;
      delete condition.operator;
    }
    if ((field === 'operator' || field === 'target') && condition.data === 'enrolled') return;
    condition[field] = e;
    setData({ ...data });
  };

  const getSourceSelect = (value) => {
    switch (value) {
      case 'course':
        return (
          <MultiSelect
            data={courses}
            placeholder={placeholders.selectCourse}
            value={sourceIdsValue}
            onChange={(e) => setNewData(e, 'sourceIds')}
          />
        );
      case 'knowledge':
        return (
          <MultiSelect
            data={knowledges}
            placeholder={placeholders.selectKnowledge}
            value={sourceIdsValue}
            onChange={(e) => setNewData(e, 'sourceIds')}
          />
        );
      case 'subject':
        return (
          <MultiSelect
            data={subjects}
            placeholder={placeholders.selectSubject}
            value={sourceIdsValue}
            onChange={(e) => setNewData(e, 'sourceIds')}
          />
        );
      case 'subject-type':
        return (
          <MultiSelect
            data={subjectTypes}
            placeholder={placeholders.selectSubjectType}
            value={sourceIdsValue}
            onChange={(e) => setNewData(e, 'sourceIds')}
          />
        );
      case 'subject-group':
        return (
          <MultiSelect
            data={subjectGroups}
            placeholder={placeholders.selectSubjectGroup}
            value={sourceIdsValue}
            onChange={(e) => setNewData(e, 'sourceIds')}
          />
        );
      default:
        return null;
    }
  };

  const setGroupOperator = (value) => {
    group.operator = value;
    setData({ ...data });
  };

  const getLogicOperatorSelect = () => {
    if (index === 0) {
      return <Text role="productive">{labels.where}</Text>;
    }
    if (index === 1) {
      return (
        <Select
          data={LOGIC_OPERATORS || []}
          value={logicOperator.value}
          onChange={(e) => {
            setLogicOperator({ label: e.toUpperCase(), value: e });
            setGroupOperator(e);
          }}
        />
      );
    } else {
      return (
        <Box m={10}>
          <Text role="productive">{logicOperator.label}</Text>
        </Box>
      );
    }
  };

  const isTargetValid = () => {
    if (dataType === 'enrolled') return true;
    if (targetValue === '') return false;
    if (targetValue === 0 || targetValue < 0) return false;
    if (targetValue === undefined || targetValue === null) return false;
    if (targetValue === '0') return false;

    return true;
  };

  const removeCondition = () => {
    group.conditions.splice(index, 1);
    setData({ ...data });
  };

  const duplicateCondition = () => {
    group.conditions.push({ ...condition, id: uuidv4() });
    setData({ ...data });
  };

  const turnToGroup = () => {
    group.conditions.splice(index, 1, {
      id: uuidv4(),
      group: { operator: 'and', conditions: [condition] },
    });
    setData({ ...data });
  };

  const resetValues = (withDataType) => {
    if (withDataType) {
      setDataType('');
      setNewData('', 'data');
    }
    setOperatorValue('');
    setTargetValue(0);
    setNewData('', 'operator');
    setNewData(0, 'target');
  };

  const filteredDataTypes = useMemo(() => {
    let results = [];
    if (sourceValue && dataTypes) {
      let filters = [];
      switch (sourceValue) {
        case 'program':
          filters = ['cpp', 'cpc', 'gpa'];
          break;
        case 'course':
          filters = ['cpc', 'gpa'];
          break;
        case 'knowledge':
        case 'subject-type':
          filters = ['cpp', 'cpc', 'gpa', 'cpcg'];
          break;
        case 'subject':
          filters = ['grade', 'enrolled'];
          break;
        case 'subject-group':
          filters = ['gpa', 'credits'];
          break;
        default:
          break;
      }
      results = filter(dataTypes, (item) => filters.includes(item.value));
    }

    return results;
  }, [sourceValue, dataTypes]);

  useEffect(() => {
    if (isFirstRenderRef.current) return;
    setTargetValue(0);
    setNewData(0, 'target');
  }, [gradeSystem]);

  useEffect(() => {
    if (!edited) return;
    setEdited(
      edited.map((item) => {
        if (item.id === draggableId) {
          if (isTargetValid()) {
            item.value = true;
            return item;
          } else {
            item.value = false;
            return item;
          }
        }
        return item;
      })
    );
  }, [targetValue, dataType]);

  useEffect(() => {
    if (edited.filter((item) => item.value === false).length === 0) {
      setError(false);
    }
  }, [edited]);

  useEffect(() => {
    if (sourceValue === 'program' && condition.sourceIds[0] !== program.value) {
      condition.sourceIds = [program.value];
      setSourceIdsValue([program.value]);
      setData({ ...data });
    }
  }, [program, sourceValue]);

  useEffect(() => {
    if (isTargetValid()) {
      setEdited([...edited, { id: draggableId, value: true }]);
    } else {
      setEdited([...edited, { id: draggableId, value: false }]);
    }
    isFirstRenderRef.current = false;
  }, []);

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <Paper
          fullWidth
          padding="none"
          shadow="none"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box className={classes.root}>
            <Box className={classes.logicOperator}>{getLogicOperatorSelect()}</Box>
            <Stack fullWidth spacing={1}>
              {/* <Box className={classes.sourceSelects} skipFlex> */}
              <Select
                data={sources || []}
                placeholder={placeholders.selectItem}
                value={sourceValue}
                onChange={(e) => {
                  setSourceValue(e);
                  setNewData(e, 'source');
                  resetValues(true);
                }}
                disabled={!program}
                skipFlex
              />
              {/* </Box> */}
              {sourceValue && getSourceSelect(sourceValue)}

              <Select
                data={filteredDataTypes || []}
                placeholder={placeholders.selectDataType}
                value={dataType}
                onChange={(e) => {
                  setDataType(e);
                  setNewData(e, 'data');
                  resetValues();
                }}
                disabled={
                  !sourceValue || (sourceValue !== 'program' && sourceIdsValue.length === 0)
                }
                skipFlex
              />
              {dataType !== 'enrolled' && (
                <>
                  <Select
                    data={operators || []}
                    placeholder={placeholders.selectOperator}
                    value={operatorValue}
                    onChange={(e) => {
                      setOperatorValue(e);
                      setNewData(e, 'operator');
                      setTargetValue(0);
                      setNewData(0, 'target');
                    }}
                    disabled={!dataType}
                  />
                  {dataType === 'gpa' || dataType === 'grade' ? (
                    <Select
                      data={grades || []}
                      placeholder={placeholders.selectTargetGrade}
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e);
                        setNewData(e, 'target');
                      }}
                      disabled={!operatorValue || !gradeSystem}
                      error={error ? errorMessage || 'Please select a grade' : null}
                      required
                    />
                  ) : operatorValue === 'contains' ? (
                    <TextInput
                      placeholder={placeholders.enterTarget}
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e);
                        setNewData(e, 'target');
                      }}
                      disabled={!operatorValue || !gradeSystem}
                      error={error ? errorMessage || 'Please select a grade' : null}
                      required
                    />
                  ) : (
                    <NumberInput
                      placeholder={placeholders.enterTarget}
                      defaultValue={0}
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e);
                        setNewData(e, 'target');
                      }}
                      disabled={!operatorValue || !gradeSystem}
                      error={error ? errorMessage || 'Please select a grade' : null}
                      required
                    />
                  )}
                </>
              )}
            </Stack>
            <Menu
              items={[
                {
                  children: labels.menuLabels.remove,
                  icon: <DeleteBinIcon />,
                  onClick: removeCondition,
                },
                {
                  children: labels.menuLabels.duplicate,
                  icon: <DuplicateIcon />,
                  onClick: duplicateCondition,
                },
                {
                  children: labels.menuLabels.turnIntoGroup,
                  icon: <SwitchHorizontalIcon />,
                  onClick: turnToGroup,
                },
              ]}
            />
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

RuleCondition.defaultProps = RULE_CONDITION_DEFAULT_PROPS;
RuleCondition.propTypes = RULE_CONDITION_PROP_TYPES;

export { RuleCondition };
