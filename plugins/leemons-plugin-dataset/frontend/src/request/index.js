import fetchDatasetValues from './fetchDatasetValues';
import getDatasetSchema from './getDatasetSchema';
import getDatasetSchemaFieldLocale from './getDatasetSchemaFieldLocale';
import getDatasetSchemaLocale from './getDatasetSchemaLocale';
import postDatasetValues from './postDatasetValues';
import removeDatasetField from './removeDatasetField';
import saveDatasetField from './saveDatasetField';
import saveDatasetMultipleFields from './saveDatasetMultipleFields';

export const getDatasetSchemaRequest = getDatasetSchema;
export const saveDatasetFieldRequest = saveDatasetField;
export const saveDatasetMultipleFieldsRequest = saveDatasetMultipleFields;
export const removeDatasetFieldRequest = removeDatasetField;
export const getDatasetSchemaLocaleRequest = getDatasetSchemaLocale;
export const getDatasetSchemaFieldLocaleRequest = getDatasetSchemaFieldLocale;
export const fetchDatasetValuesRequest = fetchDatasetValues;
export const postDatasetValuesRequest = postDatasetValues;
