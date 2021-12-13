import * as _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withTheme } from '@rjsf/core';
import {
  Checkbox,
  FormControl,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
  Toggle,
  UserCard,
} from 'leemons-ui';
import Engine from 'json-rules-engine-simplified';
import applyRules from 'rjsf-conditionals';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import regex from '@common/regex';
import datasetDataTypes from '@dataset/helpers/datasetDataTypes';
import { getContactsRequest } from '@users/request';
import Autosuggest from 'react-autosuggest';

const getId = (props) =>
  props.schema && props.schema.id ? props.schema.id : props.id.replace('root_', '');

const MyCustomFormControl = ({ children, required, rawErrors, schema, descriptionOutside }) => (
  <>
    <div>
      {schema.description && descriptionOutside ? (
        <div className="text-sm pb-2 text-secondary">{schema.description}</div>
      ) : null}
      <div className="flex">
        <FormControl
          formError={rawErrors ? { message: rawErrors[0] } : null}
          label={`${schema.title ? schema.title : ''}${required ? '*' : ''}`}
          className={`${schema.type !== 'boolean' ? 'w-full' : ''}`}
          labelPosition="right"
        >
          {schema.description && !descriptionOutside ? (
            <div className="text-sm pb-2 text-secondary">{schema.description}</div>
          ) : null}
          {children}
        </FormControl>
      </div>
    </div>
  </>
);

const TextareaWidget = (props) => {
  const { className, onChange, disabled, id, autofocus, type, readonly, value } = props;
  return (
    <MyCustomFormControl {...props}>
      {readonly ? (
        <>{value?.value}</>
      ) : (
        <Textarea
          id={id}
          type={type}
          autoFocus={autofocus}
          disabled={disabled}
          className={`mr-10 w-full ${className}`}
          outlined={true}
          value={value?.value}
          onChange={(event) => onChange({ ...value, value: event.target.value })}
        />
      )}
    </MyCustomFormControl>
  );
};

const UserSelect = (props) => {
  const {
    className,
    onChange,
    value,
    id,
    required,
    disabled,
    autofocus,
    type,
    schema,
    readonly,
    ...rest
  } = props;

  const [userAgents, setUserAgents] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestionInputValue, setSuggestionInputValue] = useState('');

  useEffect(() => {
    let mounted = true;
    const params = {
      withProfile: true,
      withCenter: true,
    };
    let profileName = true;
    let centerName = true;
    if (props.schema.frontConfig.profile && props.schema.frontConfig.profile.length) {
      params.toProfile = props.schema.frontConfig.profile;
      profileName = props.schema.frontConfig.profile.length !== 1;
    }
    if (props.schema.frontConfig.center && props.schema.frontConfig.center.length) {
      params.toCenter = props.schema.frontConfig.center;
      centerName = props.schema.frontConfig.center.length !== 1;
    }
    getContactsRequest(params).then((response) => {
      if (mounted) {
        const agents = _.map(
          response.userAgents,
          ({
            id,
            user: { name, surnames },
            profile: { name: pName },
            center: { name: cName },
          }) => ({
            id,
            name:
              name +
              (surnames || '') +
              (profileName ? ` - ${pName}` : '') +
              (centerName ? ` - ${cName}` : ''),
          })
        );
        setSuggestions(agents);
        setUserAgents(agents);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (value && userAgents) {
      const agent = _.find(userAgents, { id: state?.value });
      if (agent && agent.name !== suggestionInputValue) {
        setSuggestionInputValue(agent.name);
      }
    }
  }, [value, userAgents]);

  const getSuggestions = (_value) => {
    const inputValue = _value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : userAgents.filter((a) => a.name.toLowerCase().indexOf(inputValue) >= 0);
  };

  const onSuggestionsFetchRequested = ({ value: _value }) => {
    setSuggestions(getSuggestions(_value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <MyCustomFormControl {...props}>
      {suggestions ? (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={(item) => item.name}
          onSuggestionSelected={(e, event) => {
            onChange({ ...value, value: event.suggestion.id });
          }}
          renderSuggestion={(item) => <UserCard className={`minimal`}>{item.name}</UserCard>}
          inputProps={{
            placeholder: schema.selectPlaceholder,
            value: suggestionInputValue,
            disabled,
            onChange: (e, { newValue }) => {
              setSuggestionInputValue(newValue);
            },
          }}
        />
      ) : null}
    </MyCustomFormControl>
  );
};

const BaseInput = (props) => {
  const {
    className,
    onChange,
    value,
    id,
    required,
    disabled,
    autofocus,
    type,
    schema,
    readonly,
    ...rest
  } = props;

  const ignoreTypes = ['email', 'url'];

  if (props.schema.frontConfig.type === datasetDataTypes.user.type) {
    return <UserSelect {...props} />;
  }

  let min = null;
  let max = null;
  if (schema.minDate) min = new Date(schema.minDate).toISOString().slice(0, 10);
  if (schema.maxDate) max = new Date(schema.maxDate).toISOString().slice(0, 10);
  return (
    <MyCustomFormControl {...props}>
      {readonly ? (
        <>{value?.value}</>
      ) : (
        <Input
          id={id}
          type={ignoreTypes.indexOf(type) < 0 ? type : 'text'}
          autoFocus={autofocus}
          disabled={disabled}
          className={`mr-10 w-full ${className}`}
          outlined={true}
          value={value?.value}
          min={min}
          max={max}
          onChange={(event) => {
            onChange({
              ...value,
              value:
                type === 'number'
                  ? event.target.value
                    ? parseFloat(event.target.value)
                    : undefined
                  : event.target.value
                  ? event.target.value
                  : undefined,
            });
          }}
        />
      )}
    </MyCustomFormControl>
  );
};

function FieldTemplate({
  id,
  classNames,
  label,
  help,
  required,
  description,
  errors: _errors,
  children,
  ...rest
}) {
  return (
    <div className={`py-2 ${classNames}`}>
      {children}

      {help ? <div className="text-xs pt-2 text-neutral-content">{help}</div> : null}
    </div>
  );
}

function NumberField({ ...props }) {
  return <BaseInput {...props} type="number" />;
}

function CheckboxesWidget(props) {
  const { options, onChange, schema, rawErrors, required, readonly, ...rest } = props;

  const indexOf = (value) => {
    const values = _.map(rest.value, 'value');
    return values.indexOf(value);
  };

  const onCheckboxChange = (event, value) => {
    if (event.target.checked) {
      if (indexOf(value) < 0) {
        onChange([...rest.value, { value }]);
      }
    } else {
      const index = indexOf(value);
      if (index >= 0) {
        rest.value.splice(index, 1);
        onChange(rest.value);
      }
    }
  };

  return (
    <div>
      <PartTitle {...props} />
      <PartDescription {...props} />
      <div>
        {options.enumOptions
          ? options.enumOptions.map(({ value, label }, index) => (
              <div key={value + label + index} className="flex">
                <FormControl label={label} labelPosition="right">
                  <Checkbox
                    color={rawErrors ? 'error' : 'primary'}
                    checked={indexOf(value) >= 0}
                    readOnly={readonly}
                    onChange={(event) => onCheckboxChange(event, value)}
                  />
                </FormControl>
              </div>
            ))
          : null}
      </div>
      <PartError rawErrors={rawErrors} />
    </div>
  );
}

function transformErrors(errors, t) {
  return errors.map((error) => {
    if (error.name === 'format') {
      error.message = t(`format.${error.params.format}`);
    }
    if (error.name === 'type') {
    }
    const types = ['maxItems', 'minItems', 'minLength', 'maxLength', 'required'];
    if (types.indexOf(error.name) >= 0) {
      error.message = t(error.name, error.params);
    }
    error.stack = `${error.property} ${error.message}`;
    return error;
  });
}

function ErrorList({ errors }) {
  return null;
  /*
  return (
    <Alert color="error">
      <div className="block">
        {errors.map((error) => (
          <div className="text-sm" key={error.stack}>
            {error.stack}
          </div>
        ))}
      </div>
    </Alert>
  );

   */
}

function SelectWidget(props) {
  const {
    disabled,
    onBlur,
    onFocus,
    autofocus,
    readonly,
    onChange,
    options,
    multiple,
    schema,
    ...rest
  } = props;

  return (
    <MyCustomFormControl {...props}>
      <Select
        disabled={disabled}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus={autofocus}
        readOnly={readonly}
        onChange={(e) =>
          multiple
            ? onChange(_.map(e, (d) => ({ value: d })))
            : onChange({ ...props.value, value: e.target.value })
        }
        outlined={true}
        multiple={multiple}
        className="w-full"
        value={multiple ? _.map(props.value, 'value') : props.value?.value}
      >
        {schema.selectPlaceholder ? (
          <option value="-" selected disabled>
            {schema.selectPlaceholder}
          </option>
        ) : null}
        {options.enumOptions
          ? options.enumOptions.map(({ value, label }, index) => (
              <option key={value + label + index} value={value}>
                {label}
              </option>
            ))
          : null}
      </Select>
    </MyCustomFormControl>
  );
}

function RadioWidget(props) {
  const {
    id,
    disabled,
    onBlur,
    onFocus,
    autofocus,
    readonly,
    onChange,
    options,
    schema,
    required,
    value,
    rawErrors,
    ...rest
  } = props;

  return (
    <>
      <PartTitle {...props} />
      <PartDescription {...props} />
      {options.enumOptions
        ? options.enumOptions.map(({ value: _value, label }, index) => (
            <div key={_value + label + index} className="flex">
              <FormControl label={label} labelPosition="right">
                <Radio
                  color={rawErrors ? 'error' : 'primary'}
                  name={id}
                  disabled={disabled}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  autoFocus={autofocus}
                  readOnly={readonly}
                  checked={_value === value?.value}
                  onChange={() => onChange({ ...value, value: _value })}
                  value={_value}
                />
              </FormControl>
            </div>
          ))
        : null}
      <PartError rawErrors={rawErrors} />
    </>
  );
}

function CheckboxWidget(props) {
  const { required, readonly, disabled, autofocus, onChange, value, rawErrors, schema, ...rest } =
    props;

  return (
    <div>
      <PartTitle {...props} />
      <PartDescription {...props} />
      <div className="flex">
        <FormControl label={schema.optionLabel} labelPosition="right">
          <Checkbox
            color={rawErrors ? 'error' : 'primary'}
            autoFocus={autofocus}
            readOnly={readonly}
            checked={value?.value}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, value: event.target.checked })}
          />
        </FormControl>
      </div>
      <PartError rawErrors={rawErrors} />
    </div>
  );
}

function ToggleWidget(props) {
  const { required, readonly, disabled, autofocus, onChange, value, rawErrors, schema, ...rest } =
    props;

  return (
    <div>
      <PartTitle {...props} />
      <PartDescription {...props} />
      <div className="flex">
        <FormControl label={schema.optionLabel} labelPosition="right">
          <Toggle
            color={rawErrors ? 'error' : 'primary'}
            autoFocus={autofocus}
            readOnly={readonly}
            checked={value?.value}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, value: event.target.checked })}
          />
        </FormControl>
      </div>
      <PartError rawErrors={rawErrors} />
    </div>
  );
}

function PartTitle({ schema, required }) {
  return schema.title ? (
    <div>
      <Label text={`${schema.title ? schema.title : ''}${required ? '*' : ''}`} />
    </div>
  ) : null;
}

function PartDescription({ schema }) {
  return schema.description ? (
    <div className="text-sm pb-2 text-secondary">{schema.description}</div>
  ) : null;
}

function PartError({ rawErrors }) {
  return <FormControl formError={rawErrors ? { message: rawErrors[0] } : null} />;
}

function columnsObjectFieldTemplate({ properties, uiSchema, ...rest }) {
  return (
    <div className={`flex ${uiSchema['ui:className'] || 'w-full'}`}>
      {properties.map((prop) => (
        <div
          key={prop.content.key}
          className={prop.content.props.uiSchema['ui:className'] || 'w-full'}
        >
          {prop.content}
        </div>
      ))}
    </div>
  );
}

function returnValidJsonSchema(jsonSchema) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: jsonSchema.required,
    properties: {},
  };

  _.forIn(jsonSchema.properties, (value, key) => {
    if (value.type === 'array') {
      schema.properties[key] = {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['value'],
          properties: {
            id: {
              type: 'string',
            },
            value: value.items,
          },
        },
      };
    } else {
      schema.properties[key] = {
        type: 'object',
        additionalProperties: false,
        required: ['value'],
        properties: {
          id: {
            type: 'string',
          },
          value,
        },
      };
    }
  });

  return schema;
}

export default function index(schema, ui, conditions, props) {
  const { t } = useCommonTranslate('forms');
  const [r, setR] = useState(null);
  const FormWithConditionals = useRef(null);
  const Form = useRef(null);
  const ref = useRef(null);
  const liveValidate = useRef(false);

  const render = () => setR(new Date().getTime());

  const getForm = () => {
    if (FormWithConditionals.current) {
      return (
        <FormWithConditionals.current
          {...props}
          ref={ref}
          schema={schema}
          uiSchema={ui}
          liveValidate={liveValidate.current}
          transformErrors={(e) => transformErrors(e, t)}
          customFormats={customFormats}
          ObjectFieldTemplate={columnsObjectFieldTemplate}
        >
          <></>
        </FormWithConditionals.current>
      );
    }
    return null;
  };

  useEffect(() => {
    if (schema && ui) {
      FormWithConditionals.current = withTheme({
        FieldTemplate,
        ErrorList,
        fields: {
          NumberField,
          // BooleanField,
        },
        widgets: {
          BaseInput,
          TextareaWidget,
          CheckboxesWidget,
          SelectWidget,
          RadioWidget,
          CheckboxWidget,
          toggle: ToggleWidget,
        },
        validateSchema: returnValidJsonSchema(schema),
        transformAjvErrors: (errors) => {
          if (errors === null) {
            return [];
          }

          return errors.map((e) => {
            const { dataPath, keyword, message, params, schemaPath } = e;
            const property = `${dataPath.split('.')[1]}`;

            // put data in expected format
            return {
              name: keyword,
              property,
              message,
              params, // specific to ajv
              stack: `${property} ${message}`.trim(),
              schemaPath,
            };
          });
        },
      });
      /*
        schema && ui
          ? applyRules(
              _.cloneDeep(schema),
              _.cloneDeep(ui),
              _.cloneDeep(conditions || []),
              Engine
            )(_form)
          : () => null;

       */
      Form.current = getForm();
      render();
    }
  }, [JSON.stringify(schema), JSON.stringify(ui), JSON.stringify(conditions)]);

  useEffect(() => {
    Form.current = getForm();
  }, [JSON.stringify(props)]);

  const customFormats = {
    numbers: regex.numbers,
    phone: regex.phone,
  };

  const form = Form.current ? Form.current : null;

  return [
    form,
    {
      isLoaded: () => !!ref.current,
      submit: () => {
        ref.current.formElement.dispatchEvent(
          new Event('submit', {
            cancelable: true,
            bubbles: true,
          })
        );
        if (!liveValidate.current) {
          liveValidate.current = true;
          Form.current = getForm();
          render();
        }
      },
      getRef: () => ref.current,
      getErrors: () => ref.current.state.errors || [],
      getValues: () => ref.current.props.formData,
      setValue: (key, value) =>
        ref.current.onChange({
          ...ref.current.props.formData,
          [key]: value,
        }),
    },
  ];
}
