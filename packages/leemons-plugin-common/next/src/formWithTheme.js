import { withTheme } from 'react-jsonschema-form';
import { FormControl, Input, Label, Textarea } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/solid';
import applyRules from 'react-jsonschema-form-conditionals';
import Engine from 'json-rules-engine-simplified';
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
      autofocus={autofocus}
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
  console.log('BaseInput', type, rest);
  return (
    <Input
      id={id}
      type={type}
      autofocus={autofocus}
      disabled={disabled}
      className={`mr-10 w-full ${className}`}
      outlined={true}
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
        ? errors.map((error) => (
            <Label
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

function transformErrors(errors, t) {
  return errors.map((error) => {
    console.log(error);
    if (error.name === 'type') {
    }
    if (error.name === 'minLength' || error.name === 'maxLength' || error.name === 'required') {
      error.message = t(error.name, error.params);
      error.stack = `${error.property} ${error.message}`;
    }
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
