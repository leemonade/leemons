export type StringSchema = {
  type: "string";
  minLength: number;
  maxLength: number;
};

export type TextSchema = {
  type: "string";
  minLength: number;
  maxLength: number;
};

export type ArrayStringRequiredSchema = {
  type: "array";
  items: {
    type: "string";
  };
  minItems: number;
};

export const string: StringSchema = {
  type: "string",
  minLength: 1,
  maxLength: 255,
};

export const text: TextSchema = {
  type: "string",
  minLength: 1,
  maxLength: 65000,
};

export const arrayStringRequired: ArrayStringRequiredSchema = {
  type: "array",
  items: {
    type: "string",
  },
  minItems: 1,
};

export const validateSchema = {
  text,
  string,
  arrayStringRequired,
};
