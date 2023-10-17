import { isArray } from 'lodash';

const transformErrorsFromAjv = (errors) => {
  if (!isArray(errors)) {
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
};

export default transformErrorsFromAjv;
export { transformErrorsFromAjv };
