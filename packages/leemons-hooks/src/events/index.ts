import { getActionsClone } from "../actions";
import { getFiltersClone } from "../filters";

export async function fireEvent(
  eventName: string,
  ...args: any[]
): Promise<any[]> {
  // Execute all the filters in order, wait for promises to resolve if exists
  const filteredArgs = await [
    ...getFiltersClone(eventName),
    ...getFiltersClone("*"),
  ].reduce<Promise<any[]>>(
    async (params, func) => func({ eventName, args: await params }),
    Promise.resolve(args)
  );

  // Execute all actions in parallel
  await Promise.all(
    [...getActionsClone(eventName), ...getActionsClone("*")].map(
      (f: Function) => f({ eventName, args: filteredArgs })
    )
  );

  return filteredArgs;
}
