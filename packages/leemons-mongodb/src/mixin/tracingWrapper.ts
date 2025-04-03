import type { Context } from '@leemons/moleculer';
import { getActionNameFromCTX } from '@leemons/service-name-parser';
import type { Span } from 'moleculer';
import { Query } from 'mongoose';

interface ModelParams {
  model: any;
  modelKey: string;
  ignoreTransaction?: boolean;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ctx: Context;
}

export function tracingWrapper(f: Function, modelParams: ModelParams) {
  const { ctx } = modelParams;

  return (...params: any[]) => {
    if (!ctx?.span) {
      return f(modelParams)(...params);
    }
    const span = ctx.broker.tracer.startSpan(`mongoose ${f.name}`, {
      parentSpan: ctx.span,
      service: 'mongoose',
      type: 'mongoose',
      tags: {
        model: modelParams.model.modelName,
        action: getActionNameFromCTX(ctx),
        method: f.name,
        params,
      },
    }) as Span;

    const response = f(modelParams)(...params);

    // Check if is a mongoose query
    if (response instanceof Query) {
      // Logic to handle mongoose query object
      const oldExec = response.exec;
      response.exec = () =>
        oldExec
          .call(response)
          .then((res: any) => {
            span.finish();
            return res;
          })
          .catch((error: Error) => {
            span.setError(error);
            span.finish();
            throw error;
          });

      return response;
    }

    return response
      .then((res: any) => {
        ctx.finishSpan(span);
        return res;
      })
      .catch((error: Error) => {
        span.setError(error);
        ctx.finishSpan(span);
        throw error;
      });
  };
}
