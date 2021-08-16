import { withTheme } from '@rjsf/core';
import { Checkbox, FormControl, Input, Label, Radio, Select, Textarea, Toggle } from 'leemons-ui';
import Engine from 'json-rules-engine-simplified';
import applyRules from 'rjsf-conditionals';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

const MyCustomFormControl = ({ children, required, rawErrors, schema, descriptionOutside }) => {
  return (
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
};

const TextareaWidget = (props) => {
  const { className, onChange, value, id, disabled, autofocus, type } = props;
  return (
    <MyCustomFormControl {...props}>
      <Textarea
        id={id}
        type={type}
        autoFocus={autofocus}
        disabled={disabled}
        className={`mr-10 w-full ${className}`}
        outlined={true}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
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
    ...rest
  } = props;
  const ignoreTypes = ['email', 'url'];
  let min = null;
  let max = null;
  if (schema.minDate) min = new Date(schema.minDate).toISOString().slice(0, 10);
  if (schema.maxDate) max = new Date(schema.maxDate).toISOString().slice(0, 10);
  return (
    <MyCustomFormControl {...props}>
      <Input
        id={id}
        type={ignoreTypes.indexOf(type) < 0 ? type : 'text'}
        autoFocus={autofocus}
        disabled={disabled}
        className={`mr-10 w-full ${className}`}
        outlined={true}
        value={value}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(type === 'number' ? parseFloat(event.target.value) : event.target.value)
        }
      />
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
  const { options, onChange, schema, rawErrors, required, ...rest } = props;

  const onCheckboxChange = (event, value) => {
    if (event.target.checked) {
      if (rest.value.indexOf(value) < 0) {
        onChange([...rest.value, value]);
      }
    } else {
      const index = rest.value.indexOf(value);
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
                    checked={rest.value.indexOf(value) >= 0}
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
    console.log('error', error);
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
        onChange={(e) => (multiple ? onChange(e) : onChange(e.target.value))}
        outlined={true}
        multiple={multiple}
        className="w-full"
        value={props.value}
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
            <div className="flex">
              <FormControl label={label} labelPosition="right">
                <Radio
                  color={rawErrors ? 'error' : 'primary'}
                  name={id}
                  disabled={disabled}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  autoFocus={autofocus}
                  readOnly={readonly}
                  checked={_value === value}
                  onChange={() => onChange(_value)}
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
  const {
    required,
    readonly,
    disabled,
    autofocus,
    onChange,
    value,
    rawErrors,
    schema,
    ...rest
  } = props;

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
            checked={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
          />
        </FormControl>
      </div>
      <PartError rawErrors={rawErrors} />
    </div>
  );
}

function ToggleWidget(props) {
  const {
    required,
    readonly,
    disabled,
    autofocus,
    onChange,
    value,
    rawErrors,
    schema,
    ...rest
  } = props;

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
            checked={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
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

export default function formWithTheme(schema, ui, conditions) {
  const { t } = useCommonTranslate('forms');
  const Form = withTheme({
    FieldTemplate,
    ErrorList,
    fields: {
      NumberField,
      //BooleanField,
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
  });
  const FormWithConditionals = applyRules(schema, ui, conditions, Engine)(Form);
  const customFormats = {
    numbers: /^\d+$/,
    phone: /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9\s]{3}[-\s\.]?[0-9\s]{4,8}$/,
  };

  return ({ ...props }) => {
    return (
      <FormWithConditionals
        {...props}
        transformErrors={(e) => transformErrors(e, t)}
        customFormats={customFormats}
      />
    );
  };
}
