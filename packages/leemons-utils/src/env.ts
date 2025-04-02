import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import _ from 'lodash';

/**
 * Gets an environment variable value
 * @param key - The environment variable key
 * @param defaultValue - The default value if the key doesn't exist
 * @returns The environment variable value or the default value
 */
function env(key: string, defaultValue?: string): string | undefined {
  return _.get(process.env, key, defaultValue);
}

/**
 * Generates environment variables from a file
 * @param filename - The path to the environment file
 * @param useProcessEnv - Whether to include process.env variables
 * @returns A promise that resolves to an object containing the environment variables
 */
async function generateEnv(
  filename: string | undefined,
  useProcessEnv: boolean = false
): Promise<Record<string, string>> {
  if (!filename) {
    return {};
  }

  let _filename = filename;
  if (!path.isAbsolute(_filename)) {
    _filename = path.join(process.cwd(), _filename);
  }

  try {
    const exists = await fs.exists(_filename);
    if (exists) {
      try {
        const file = await fs.readFile(_filename);
        let config = dotenv.parse(file);

        if (useProcessEnv) {
          // Filter out undefined values from process.env
          const processEnvWithoutUndefined: Record<string, string> = {};
          Object.entries(process.env).forEach(([key, value]) => {
            if (value !== undefined) {
              processEnvWithoutUndefined[key] = value;
            }
          });
          config = { ...processEnvWithoutUndefined, ...config };
        }

        return config;
      } catch (error) {
        throw new Error(`The .env file ${_filename} can not be read`);
      }
    } else if (useProcessEnv) {
      // Filter out undefined values from process.env
      const processEnvWithoutUndefined: Record<string, string> = {};
      Object.entries(process.env).forEach(([key, value]) => {
        if (value !== undefined) {
          processEnvWithoutUndefined[key] = value;
        }
      });
      return processEnvWithoutUndefined;
    }
    return {};
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error accessing .env file ${_filename}: ${error.message}`);
    }
    throw new Error(`Error accessing .env file ${_filename}`);
  }
}

export { env, generateEnv };
