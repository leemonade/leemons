import React from 'react';
import { clone, cloneDeep, findIndex, isArray, keyBy } from 'lodash';
import { useId, Box, InputWrapper, TextInput } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';

const GroupField = (props) => {
  const {
    options,
    uiSchema,
    schema,
    readonly,
    canAdd,
    formData,
    disabled,
    rawErrors,
    required,
    title,
    onChange,
  } = props;

  const uuid = useId();
  const regex = /(?:\[{2}\{).*?(?:\}\]{2})/g;
  const formDataById = keyBy(formData, 'id');
  const fieldType = props.schema.frontConfig.blockData.groupTypeOfContents;

  function getLabel(element) {
    let array;
    let finalText = clone(props.schema.frontConfig.blockData.showAs);

    while ((array = regex.exec(props.schema.frontConfig.blockData.showAs)) !== null) {
      const confObj = JSON.parse(array[0].slice(2, -2));
      finalText = finalText.replace(array[0], element[confObj.id]);
    }

    if (props.readonly) {
      finalText = `${formDataById[element.id]?.metadata.index} ${finalText}`;
    }
    return finalText;
  }

  return (
    <InputWrapper
      label={uiSchema['ui:title'] || title}
      help={options?.help}
      uuid={uuid}
      error={rawErrors ? rawErrors[0] : null}
      required={required}
    >
      <Box sx={(theme) => ({ padding: theme.spacing[4] })}>
        {props.schema.frontConfig.blockData.elements.map((element) => {
          let Element = () => <></>;
          if (fieldType === 'field') {
            Element = TextInput;
          } else if (fieldType === 'textarea') {
            Element = TextEditor;
          }

          return (
            <Element
              disabled={disabled}
              required={required}
              readonly={readonly}
              value={formDataById[element.id]?.value}
              label={getLabel(element)}
              error={rawErrors ? rawErrors[0] : null}
              onChange={(event) => {
                let data = cloneDeep(formData);
                if (!isArray(data)) {
                  data = [];
                }
                const index = findIndex(data, { id: element.id });
                if (index >= 0) {
                  data[index].value = event;
                } else {
                  data.push({ id: element.id, value: event });
                }

                onChange([...data]);
              }}
            />
          );
        })}
      </Box>
    </InputWrapper>
  );
};

export { GroupField };
