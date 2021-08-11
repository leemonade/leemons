import { withTheme } from '@rjsf/core';
import { Checkbox, FormControl, Input, Textarea } from 'leemons-ui';
// import applyRules from 'react-jsonschema-form-conditionals';
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
  const { className, onChange, value, id, required, disabled, autofocus, type, ...rest } = props;
  const ignoreTypes = ['email', 'url'];
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

function transformErrors(errors, t) {
  return errors.map((error) => {
    console.log('error', error);
    if (error.name === 'format') {
      error.message = t(`format.${error.params.format}`);
    }
    if (error.name === 'type') {
    }
    if (error.name === 'minLength' || error.name === 'maxLength' || error.name === 'required') {
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

function BooleanField(props) {
  const { required, readonly, disabled, autofocus, onChange, formData, ...rest } = props;
  return (
    <MyCustomFormControl descriptionOutside={true} {...props}>
      <Checkbox
        color="primary"
        autoFocus={autofocus}
        readOnly={readonly}
        required={required}
        checked={formData}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </MyCustomFormControl>
  );
}

export default function formWithTheme(schema, ui, conditions) {
  const { t } = useCommonTranslate('forms');
  const Form = withTheme({
    FieldTemplate,
    ErrorList,
    fields: {
      NumberField,
      BooleanField,
    },
    widgets: {
      BaseInput,
      TextareaWidget,
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
