/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import {
  Badge,
  Box,
  Checkbox,
  InputWrapper,
  Stack,
  TAGIFY_TAG_REGEX,
  Text,
  Title,
} from '@bubbles-ui/components';
import { htmlToText, useStore } from '@common';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { getTagRelationSelectData } from '@curriculum/components/FormTheme/TagRelation';
import { getItemTitleNumberedWithParents } from '@curriculum/helpers/getItemTitleNumberedWithParents';
import _, { forEach, forIn, isArray, isNil, isObject, isPlainObject, isString } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

function NewValue({
  keyIndex,
  blockData,
  nodeLevelId,
  baseValue,
  nodeId,
  hideNoSelecteds,
  showCheckboxs,
  store,
  value,
  render,
  onParentNumbering,
  baseValueId,
}) {
  const key = `curriculum.${store.curriculum.id}|nodeLevel.${
    nodeLevelId || store.selectedNode.nodeLevel
  }|node.${nodeId || store.selectedNode.id}|property.${baseValueId}`;

  const flatNodes = React.useMemo(() => {
    const result = [];

    function flatten(childrens) {
      _.forEach(childrens, (child) => {
        result.push(child);
        if (_.isArray(child.childrens)) {
          flatten(child.childrens);
        }
      });
    }

    flatten(store.curriculum.nodes);
    return result;
  }, [store.curriculum]);

  const tags = React.useMemo(() => {
    const results = [];
    if (value.metadata?.tagRelated?.length) {
      const tagValues = getTagRelationSelectData(
        store.curriculum,
        blockData,
        store.selectedNode.id
      );
      const tagValuesByValue = _.keyBy(tagValues, 'value');
      forEach(value.metadata.tagRelated, (tag) => {
        if (tagValuesByValue[tag]) {
          results.push(tagValuesByValue[tag].label);
        }
      });
    }
    return results.map((tag, index) => (
      <Box key={index} sx={(theme) => ({ margin: theme.spacing[1], display: 'inline-block' })}>
        <Badge color="stroke" closable={false} label={tag} />
      </Box>
    ));
  }, [value, flatNodes]);

  function onChange(id) {
    if (!isArray(store.value)) store.value = [];
    const index = store.value.indexOf(id);
    if (index >= 0) {
      store.value.splice(index, 1);
    } else {
      store.value.push(id);
    }
    render();
  }

  function getNumbering(index, item, v) {
    const va = v || value;
    onParentNumbering(
      getItemTitleNumberedWithParents(
        store.curriculum,
        blockData,
        nodeId,
        {
          ...va,
          metadata: {
            ...va?.metadata,
            parentRelated: baseValue?.metadata?.parentRelated || va?.metadata?.parentRelated,
          },
        },
        index,
        item,
        true
      )
    );

    return getItemTitleNumberedWithParents(
      store.curriculum,
      blockData,
      nodeId,
      {
        ...va,
        metadata: {
          ...va?.metadata,
          parentRelated: baseValue?.metadata?.parentRelated || va?.metadata?.parentRelated,
        },
      },
      index,
      item
    );
  }

  function CheckBoxComponent(id, item, title, label) {
    return (
      <Box>
        <Stack fullWidth alignItems="start">
          {showCheckboxs ? (
            <Checkbox checked={store.value?.indexOf(id) >= 0} onChange={() => onChange(id)} />
          ) : null}
          <Stack sx={() => ({ marginTop: 6 })} alignItems="center">
            {item.metadata?.index ? (
              <Text role="productive" color="primary" strong>{`${item.metadata?.index}`}</Text>
            ) : null}
            <Box sx={(theme) => ({ flex: 1 })}>
              <Text
                strong
                color="primary"
                role="productive"
                dangerouslySetInnerHTML={{
                  __html: title || label || item?.value || item,
                }}
              />
            </Box>
          </Stack>
        </Stack>
        {title ? (
          <Box
            sx={(theme) => ({
              paddingLeft: theme.spacing[2],
              marginTop: -2,
              marginBottom: theme.spacing[1],
            })}
          >
            <Text
              role="productive"
              dangerouslySetInnerHTML={{
                __html: label || item?.value || item,
              }}
            />
          </Box>
        ) : null}
      </Box>
    );
  }

  function getGroupItem(itemId) {
    return _.find(blockData.elements, { id: itemId });
  }

  function getGroupTitle(itemId) {
    let finalText = blockData.showAs;
    let array;
    const item = getGroupItem(itemId);
    // eslint-disable-next-line no-cond-assign
    while ((array = TAGIFY_TAG_REGEX.exec(blockData.showAs)) !== null) {
      const json = JSON.parse(array[0])[0][0];
      finalText = finalText.replace(array[0], item[json.id]);
    }
    return finalText;
  }

  function isInValues(id) {
    let hi = false;
    _.forEach(store.value, (sv) => {
      if (sv.indexOf(id) >= 0) {
        hi = true;
        return false;
      }
    });
    return hi;
  }

  if (isObject(value)) {
    if (value.id) {
      // Listado
      const numbering = getNumbering(keyIndex, null, baseValue);

      if (value.childrens?.length) {
        const ch = [];
        _.forEach(value.childrens, (child) => {
          if (child.childrens?.length) {
            const c = [];
            _.forEach(child.childrens, (child2) => {
              let canAdd = true;
              if (hideNoSelecteds) {
                if (!isInValues(child2.id)) {
                  canAdd = false;
                }
              }
              if (canAdd)
                c.push(
                  <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>
                    {CheckBoxComponent(
                      `${key}|value.${value.id}|value1.${child.id}|value2.${child2.id}`,
                      child2,
                      undefined,
                      `${htmlToText(child2.value)}`
                    )}
                  </Box>
                );
            });
            if (c.length) {
              ch.push(
                <Box
                  sx={(theme) => ({ paddingLeft: theme.spacing[4], marginTop: theme.spacing[2] })}
                >
                  <Text
                    strong
                    color="primary"
                    role="productive"
                    dangerouslySetInnerHTML={{
                      __html: `${htmlToText(child.value)}`,
                    }}
                  />
                  {c}
                </Box>
              );
            }
          } else {
            let canAdd = true;
            if (hideNoSelecteds) {
              if (!isInValues(child.id)) {
                canAdd = false;
              }
            }
            if (canAdd)
              ch.push(
                <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>
                  {CheckBoxComponent(
                    `${key}|value.${value.id}|value1.${child.id}`,
                    child,
                    undefined,
                    `${htmlToText(child.value)}`
                  )}
                </Box>
              );
          }
        });

        if (ch.length) {
          return (
            <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
              <Text
                strong
                color="primary"
                role="productive"
                dangerouslySetInnerHTML={{
                  __html: `${numbering ? `${numbering} ` : ''}${htmlToText(value.value)}`,
                }}
              />
              {ch}
            </Box>
          );
        }
      } else {
        return (
          <Box>
            {CheckBoxComponent(
              `${key}|value.${value.id}`,
              value,
              undefined,
              `${numbering ? `${numbering} ` : ''}${htmlToText(value.value)}`
            )}
            <Box sx={(theme) => ({ paddingLeft: theme.spacing[8] })}>{tags}</Box>
          </Box>
        );
      }
    }
    // Grupo
    const toReturn = [];
    forIn(value, (val, k) => {
      const checks = [];
      if (isArray(val.value)) {
        const che = [];
        forEach(val.value, (v, i) => {
          if (v.childrens?.length) {
            const ch = [];
            _.forEach(v.childrens, (child) => {
              let canAdd = true;
              if (hideNoSelecteds) {
                if (!isInValues(child.id)) {
                  canAdd = false;
                }
              }
              if (canAdd)
                ch.push(
                  <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>
                    {CheckBoxComponent(
                      `${key}|value.${val.id}|value2.${v.id}|value3.${child.id}`,
                      child,
                      undefined,
                      `${htmlToText(child.value)}`
                    )}
                  </Box>
                );
            });
            if (ch.length) {
              che.push(
                <Box
                  sx={(theme) => ({ paddingLeft: theme.spacing[4], marginTop: theme.spacing[2] })}
                >
                  <Text
                    strong
                    color="primary"
                    role="productive"
                    dangerouslySetInnerHTML={{
                      __html: `${getNumbering(i, getGroupItem(k), val)} ${htmlToText(v.value)}`,
                    }}
                  />
                  {ch}
                </Box>
              );
            }
          } else {
            let canAdd = true;
            if (hideNoSelecteds) {
              if (!isInValues(v.id)) {
                canAdd = false;
              }
            }
            if (canAdd)
              che.push(
                <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>
                  {CheckBoxComponent(
                    `${key}|value.${val.id}|value2.${v.id}`,
                    v,
                    undefined,
                    `${getNumbering(i, getGroupItem(k), val)} ${htmlToText(v.value)}`
                  )}
                </Box>
              );
          }
        });
        if (che.length) {
          checks.push(
            <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
              <Text
                strong
                color="primary"
                role="productive"
                dangerouslySetInnerHTML={{
                  __html: getGroupTitle(k),
                }}
              />
              {che}
            </Box>
          );
        }
      } else {
        let canAdd = true;
        if (hideNoSelecteds) {
          if (!isInValues(val.id)) {
            canAdd = false;
          }
        }
        if (canAdd) checks.push(CheckBoxComponent(`${key}|value.${val.id}`, val, getGroupTitle(k)));
      }
      toReturn.push(
        <Box>
          {checks}
          {tags}
        </Box>
      );
    });
    return toReturn;
  }
  // Texto
  return (
    <Box>
      {CheckBoxComponent(key, value)}
      {tags}
    </Box>
  );
}

NewValue.propTypes = {
  value: PropTypes.any,
  store: PropTypes.object,
  render: PropTypes.func,
  nodeId: PropTypes.string,
  baseValue: PropTypes.any,
  blockData: PropTypes.any,
  keyIndex: PropTypes.any,
  hideNoSelecteds: PropTypes.bool,
  nodeLevelId: PropTypes.string,
  baseValueId: PropTypes.string,
  showCheckboxs: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export function CurriculumProp({ hideNoSelecteds, t2, store, render, item, showCheckboxs = true }) {
  const [_store, _render] = useStore({
    parentNumber: {},
  });
  const [parentProperty, setParentProperty] = React.useState(null);

  let values;
  if (store.selectedNode?.formValues) {
    values = store.selectedNode?.formValues[item.id];
  }

  const hide = React.useMemo(() => {
    const arrayValues = _.compact(_.isArray(values) ? values : [values]);

    if (hideNoSelecteds) {
      const hi = [];

      _.forEach(arrayValues, () => {
        hi.push(true);
      });

      _.forEach(arrayValues, (val, i) => {
        if (isString(val.value)) {
          _.forEach(store.value, (sv) => {
            if (sv.indexOf(val.id) >= 0) {
              hi[i] = false;
              return false;
            }
          });
        } else if (isPlainObject(val?.value)) {
          _.forIn(val?.value, ({ id }) => {
            _.forEach(store.value, (sv) => {
              if (sv.indexOf(id) >= 0) {
                hi[i] = false;
                return false;
              }
            });
          });
        } else if (isArray(val?.value)) {
          _.forEach(val?.value, ({ id }) => {
            _.forEach(store.value, (sv) => {
              if (sv.indexOf(id) >= 0) {
                hi[i] = false;
                return false;
              }
            });
            if (!hi[i]) return false;
          });
        } else {
          _.forEach(store.value, (sv) => {
            if (sv.indexOf(val?.value.id) >= 0) {
              hi[i] = false;
              return false;
            }
          });
        }
        if (!hi[i]) return false;
      });

      return hi;
    }
    return _.map(arrayValues, () => false);
  }, [store.value]);

  const hideAll = React.useMemo(() => {
    let r = true;
    _.forEach(hide, (h) => {
      if (!h) {
        r = false;
        return false;
      }
    });
    return r;
  }, [hide]);

  function onParentFound(show, { property } = {}) {
    if (show && property) setParentProperty(property);
  }

  function onParentNumbering(e, id) {
    if (_store.parentNumber[id] !== e) {
      _store.parentNumber[id] = e;
      _render();
    }
  }

  function newArrayValues(val) {
    return val?.value.map((value, index) => {
      if (hideNoSelecteds) {
        let hi = true;
        _.forEach(store.value, (sv) => {
          if (sv.indexOf(value.id) >= 0) {
            hi = false;
            return false;
          }
        });
        if (hi) return null;
      }
      return (
        <NewValue
          key={index}
          keyIndex={index}
          render={render}
          store={store}
          baseValueId={val.id}
          value={value}
          baseValue={val}
          hideNoSelecteds={hideNoSelecteds}
          nodeId={values._nodeId}
          nodeLevelId={values._nodeLevelId}
          blockData={values._blockData || item.frontConfig.blockData}
          onParentNumbering={(e) => {
            if (index === 0) onParentNumbering(e, val.id);
          }}
          showCheckboxs={showCheckboxs}
        />
      );
    });
  }

  function newValues(val) {
    if (hideNoSelecteds) {
      let hi = true;
      if (isString(val.value)) {
        _.forEach(store.value, (sv) => {
          if (sv.indexOf(val.id) >= 0) {
            hi = false;
            return false;
          }
        });
      } else if (!isPlainObject(val.value)) {
        _.forEach(store.value, (sv) => {
          if (sv.indexOf(val.value.id) >= 0) {
            hi = false;
            return false;
          }
        });
      } else {
        hi = false;
      }
      if (hi) return null;
    }
    return (
      <NewValue
        render={render}
        store={store}
        baseValueId={val.id}
        baseValue={val}
        value={val.value}
        nodeId={values._nodeId}
        hideNoSelecteds={hideNoSelecteds}
        nodeLevelId={values._nodeLevelId}
        blockData={values._blockData || item.frontConfig.blockData}
        onParentNumbering={(e) => onParentNumbering(e, val.id)}
        showCheckboxs={showCheckboxs}
      />
    );
  }

  if (hideAll) return null;

  const arrayValues = _.compact(_.isArray(values) ? values : [values]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
      <InputWrapper
        label={
          <Title
            order={6}
            sx={(theme) => ({ marginTop: theme.spacing[2], marginBottom: theme.spacing[2] })}
          >
            {parentProperty ? `${parentProperty.title} & ` : ''}
            {item.title}
          </Title>
        }
      >
        {isNil(values) ? (
          '-'
        ) : (
          <>
            {arrayValues.map((val, i) => {
              if (hide[i]) {
                return null;
              }
              return (
                <ParentRelation
                  key={val.id}
                  curriculum={store.curriculum}
                  blockData={values.blockData || item.frontConfig.blockData}
                  value={val}
                  onChange={() => {}}
                  isShow={onParentFound}
                  isEditMode={false}
                  id={values._nodeId || store.selectedNode.id}
                  hideLabel
                  numbering={_store.parentNumber[val.id]}
                  t={t2}
                >
                  {isArray(val.value) ? newArrayValues(val) : newValues(val)}
                </ParentRelation>
              );
            })}
          </>
        )}
      </InputWrapper>
    </Box>
  );
}

CurriculumProp.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  item: PropTypes.object,
  showCheckboxs: PropTypes.bool,
  t2: PropTypes.func,
  hideNoSelecteds: PropTypes.bool,
};
