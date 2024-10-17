export type TranslateLoaderFunction = (
  key?: string,
  replaces?: { [key: string]: string },
  returnFullKey?: boolean,
  fallback?: string
) => string;

type translations = {
  items: {
    [key: string]: string;
  };
} | null;

export default function useTranslateLoader(
  prefix: string
): [TranslateLoaderFunction, translations, Error, boolean];
