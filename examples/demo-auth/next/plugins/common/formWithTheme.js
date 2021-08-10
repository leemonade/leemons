import { withTheme } from '@rjsf/core';
import { FormControl, Input, Label, Textarea } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/solid';
// import applyRules from 'react-jsonschema-form-conditionals';
import Engine from 'json-rules-engine-simplified';
import applyRules from 'rjsf-conditionals';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

const TextareaWidget = ({
  className,
  onChange,
  value,
  id,
  required,
  disabled,
  autofocus,
  type,
}) => {
  return (
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
  );
};

const BaseInput = ({
  className,
  onChange,
  value,
  id,
  required,
  disabled,
  autofocus,
  type,
  ...rest
}) => {
  console.log('BaseInput', rest, type);
  const ignoreTypes = ['email', 'url'];
  return (
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
}) {
  const errors = _errors.props.errors;
  return (
    <div className={`py-2 ${classNames}`}>
      {label ? (
        <FormControl label={`${label}${required ? '*' : ''}`}>
          {description ? <div className="text-sm pb-2 text-secondary">{description}</div> : null}
          {children}
        </FormControl>
      ) : (
        children
      )}

      {errors
        ? errors.map((error, index) => (
            <Label
              key={index}
              text={
                <>
                  <ExclamationIcon className="inline-block mr-1 h-4 text-error fill-current" />
                  {error}
                </>
              }
              helper
            />
          ))
        : null}

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

export default function formWithTheme(schema, ui, conditions) {
  const { t } = useCommonTranslate('forms');
  const Form = withTheme({
    FieldTemplate,
    ErrorList,
    fields: {
      NumberField,
    },
    widgets: {
      BaseInput,
      TextareaWidget,
    },
  });
  const FormWithConditionals = applyRules(schema, ui, conditions, Engine)(Form);

  return ({ ...props }) => {
    return <FormWithConditionals {...props} transformErrors={(e) => transformErrors(e, t)} />;
  };
}
