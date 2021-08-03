import { withTheme } from 'react-jsonschema-form';
import { FormControl, Input } from 'leemons-ui';

const BaseInput = ({ className, ...props }) => {
  return <Input className={`mr-10 w-full ${className}`} outlined={true} {...props} />;
};

function FieldTemplate({ id, classNames, label, help, required, description, errors, children }) {
  return (
    <div className={`py-2 ${classNames}`}>
      {label ? (
        <FormControl label={`${label}${required ? '*' : ''}`}>{children}</FormControl>
      ) : (
        children
      )}
      {description}
      {errors}
      {help}
    </div>
  );
}

export default function formWithTheme() {
  return withTheme({
    FieldTemplate,
    widgets: {
      BaseInput,
    },
  });
}
