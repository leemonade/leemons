import _ from "lodash";

interface SettledResponse {
  status: "fulfilled" | "rejected";
  value?: any;
  reason?: any;
}

interface ManyResponse {
  items: SettledResponse[];
  count: number;
  warnings: { errors: any[] } | null;
}

/**
 * Converts a Promise.allSettled response to a ManyResponse format
 * @param response - The settled response array from Promise.allSettled
 * @returns A ManyResponse object containing fulfilled items and any errors
 */
function settledResponseToManyResponse(
  response: SettledResponse[]
): ManyResponse {
  const value: ManyResponse = { items: [], count: 0, warnings: null };
  const errors: any[] = [];

  _.forEach(response, (res) => {
    if (res.status === "fulfilled") {
      value.items.push(res);
    } else {
      errors.push(res.reason);
    }
  });

  value.count = value.items.length;
  if (errors.length) {
    value.warnings = { errors };
  }
  return value;
}

export { settledResponseToManyResponse };
