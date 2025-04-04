import { LeemonsError } from "@leemons/error";
import type { ActionSchema, Context } from "@leemons/moleculer";
import { LeemonsValidator } from "@leemons/validator";
import { cloneDeep, isString } from "lodash";

interface AddCustomTranslationKeysParams {
  id: string;
  prefix: string;
  localizations: {
    [locale: string]: {
      [key: string]: string;
    };
  };
}

interface GetAddCustomTranslationKeysActionParams {
  middlewares?: ActionSchema["middlewares"];
}

interface AddCustomTranslationKeysResponse {
  status: number;
  data: any;
}

/**
 * Creates an action schema for adding custom translation keys
 * @param {GetAddCustomTranslationKeysActionParams} params - The parameters for creating the action
 * @returns {Record<string, ActionSchema>} The action schema
 */
export function getAddCustomTranslationKeysAction({
  middlewares,
}: GetAddCustomTranslationKeysActionParams = {}): Record<string, ActionSchema> {
  return {
    addCustomTranslationKeys: {
      rest: {
        method: "POST",
        path: "/custom-keys",
      },
      middlewares,
      async handler(ctx: Context): Promise<AddCustomTranslationKeysResponse> {
        const validator = new LeemonsValidator({
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            prefix: {
              type: "string",
            },
            localizations: {
              type: "object",
              properties: {
                en: { type: "object", additionalProperties: true }, // { key1: 'value1', key2: 'value2' }
                es: { type: "object", additionalProperties: true }, // { key1: 'value1', key2: 'value2' }
              },
              additionalProperties: true,
            },
          },
          required: ["localizations", "id", "prefix"],
          additionalProperties: false,
        });

        if (validator.validate(ctx.params)) {
          const params = ctx.params as AddCustomTranslationKeysParams;
          const { id, prefix, localizations } = params;
          const localizationsToSave = cloneDeep(localizations);

          Object.keys(localizationsToSave).forEach((language) => {
            Object.keys(localizationsToSave[language]).forEach((key) => {
              const newKey = `${prefix}.${id}.${key}`;
              localizationsToSave[language][newKey] =
                localizationsToSave[language][key];
              delete localizationsToSave[language][key];
            });
          });

          const data = await ctx.tx.call(
            "multilanguage.contents.setManyByJSON",
            {
              data: localizationsToSave,
            }
          );

          return { status: 200, data };
        }

        throw new LeemonsError(ctx, {
          message: isString(validator.error)
            ? validator.error
            : "Validation failed",
          httpStatusCode: 400,
        });
      },
    },
  };
}
