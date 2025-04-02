import { CallingOptions, ServiceBroker } from 'moleculer';

interface CustomCallParams {
  broker: ServiceBroker;
  caller: string;
  actionName: string;
  deploymentId: string;
  payload?: Record<string, any>;
}

interface ActionCallResponse {
  actionToCall: string;
  relationshipID: string;
}

/**
 * Executes a custom call to a broker with the provided parameters.
 *
 * @param broker - The broker to make the call to.
 * @param caller - The caller of the call.
 * @param actionName - The name of the action to call.
 * @param deploymentId - The deployment ID.
 * @param payload - The payload to send with the call.
 * @returns The result of the broker call.
 */
export async function customCall({
  broker,
  caller,
  actionName,
  deploymentId,
  payload = {},
}: CustomCallParams): Promise<any> {
  const callOpts: CallingOptions = {
    caller,
    meta: { deploymentID: deploymentId },
  };

  const manager = await broker.call<ActionCallResponse, { actionName: string }>(
    'deployment-manager.getGoodActionToCall',
    { actionName },
    callOpts
  );

  const finalCallOpts: CallingOptions = {
    caller,
    meta: {
      deploymentID: deploymentId,
      relationshipID: manager.relationshipID,
    },
  };

  return broker.call<any, Record<string, any>>(manager.actionToCall, payload, finalCallOpts);
}
