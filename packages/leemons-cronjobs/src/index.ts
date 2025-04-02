import { Agenda, type IAgendaConfig, type Job } from '@hokify/agenda';
import type { AnyContext, ServiceSchema } from '@leemons/moleculer';
import type { ServiceBroker } from 'moleculer';

export interface CronJobContext extends AnyContext {
  params: {
    job: Job;
    name?: string;
    jobParams?: Record<string, unknown>;
  } & Record<string, unknown>;
  cronJob: {
    schedule: <T extends Record<string, unknown>>(
      when: string,
      jobName: string,
      params?: T
    ) => void;
    every: <T extends Record<string, unknown>>(
      interval: string,
      jobName: string,
      params?: T
    ) => Promise<void>;
    cancel<T extends Record<string, unknown>>(
      jobName: string,
      params: T & { 'data.deploymentID': string }
    ): Promise<number>;
  };
}

export interface LeemonsCronJobsMixinOptions<T = unknown> {
  jobs?: Record<string, (ctx: CronJobContext) => Promise<T> | T>;
}

export interface LeemonsCronJobsService {
  metadata: {
    mixins: {
      LeemonsCronJobs: true;
    };
    CronJob: Agenda;
  };
  methods: {
    runScheduled<T extends Record<string, unknown>>(when: string, jobName: string, params: T): void;
    runEvery<T extends Record<string, unknown>>(interval: string, jobName: string, params: T): void;
    cancel<T extends Record<string, unknown>>(
      jobName: string,
      params: T & { 'data.deploymentID': string }
    ): Promise<number>;
  };
  actions: {
    LeemonsCronJobExecute: (ctx: CronJobContext) => Promise<unknown>;
  };
  logger: {
    error: (message: string) => void;
    debug: (message: string) => void;
  };
  broker: ServiceBroker;
  fullName: string;
}

interface DeploymentManagerResponse {
  relationshipID: string;
}

export function LeemonsCronJobsMixin<T = unknown>({
  jobs = {},
}: LeemonsCronJobsMixinOptions<T>): Partial<ServiceSchema> {
  return {
    metadata: {
      mixins: {
        LeemonsCronJobs: true,
      },
    },
    methods: {
      runScheduled(
        this: LeemonsCronJobsService,
        when: string,
        jobName: string,
        params: Record<string, unknown> = {}
      ) {
        if (!jobName || !when || !params?.deploymentID) {
          this.logger.error(
            `Missing jobName: ${jobName}, when: ${when} or deploymentID: ${params?.deploymentID}`
          );
          return;
        }

        this.metadata.CronJob.schedule(when, jobName, params);
      },
      runEvery(
        this: LeemonsCronJobsService,
        interval: string,
        jobName: string,
        params: Record<string, unknown> = {}
      ) {
        if (!jobName || !interval || !params?.deploymentID) {
          this.logger.error(
            `Missing jobName: ${jobName}, when: ${interval} or deploymentID: ${params?.deploymentID}`
          );
          return;
        }

        this.metadata.CronJob.every(interval, jobName, params);
      },
      cancelJob(
        this: LeemonsCronJobsService,
        jobName: string,
        params: Record<string, unknown> & { 'data.deploymentID': string }
      ) {
        if (!jobName || !params?.['data.deploymentID']) {
          this.logger.error(
            `Missing jobName: ${jobName} or deploymentID: ${params?.['data.deploymentID']}`
          );
          return;
        }

        return this.metadata.CronJob.cancel({
          $and: [{ name: jobName }, params],
        });
      },
    },
    actions: {
      LeemonsCronJobExecute: async (ctx: CronJobContext) => {
        const { name, jobParams, job } = ctx.params;
        if (!name || !job) {
          return null;
        }

        ctx.params = { ...jobParams, job } as CronJobContext['params'];
        return jobs[name]?.(ctx);
      },
    },

    hooks: {
      before: {
        '*': [
          function (this: LeemonsCronJobsService, ctx: AnyContext): void {
            const { deploymentID } = ctx.meta;

            const CronJob = this.metadata.CronJob;

            (ctx as CronJobContext).cronJob = {
              schedule: (when: string, jobName: string, params: Record<string, unknown> = {}) => {
                if (!jobName || !when) {
                  this.logger.error(`Missing jobName: ${jobName} or when: ${when}`);
                  return;
                }

                CronJob.schedule(when, jobName, {
                  ...params,
                  deploymentID: deploymentID ?? params.deploymentID,
                });
              },
              every: async (
                interval: string,
                jobName: string,
                params: Record<string, unknown> = {}
              ) => {
                if (!jobName || !interval) {
                  this.logger.error(`Missing jobName: ${jobName} or interval: ${interval}`);
                  return;
                }

                await CronJob.create(jobName, {
                  ...params,
                  deploymentID: deploymentID ?? params.deploymentID,
                })
                  .repeatEvery(interval)
                  .save();
              },
              cancel: async (
                jobName: string,
                params: Record<string, unknown> & {
                  'data.deploymentID': string;
                }
              ) => {
                if (!jobName || !params?.['data.deploymentID']) {
                  this.logger.error(
                    `Missing jobName: ${jobName} or deploymentID: ${params?.['data.deploymentID']}`
                  );
                  return 0;
                }

                const result = await CronJob.cancel({
                  $and: [{ name: jobName }, params],
                });
                return result ?? 0;
              },
            };
          },
        ],
      },
    },
    async created(this: LeemonsCronJobsService) {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is required');
      }

      const CronJob = new Agenda({
        db: { collection: 'agendaJobs', address: mongoUri },
        defaultConcurrency: 1,
        maxConcurrency: 20,
        defaultLockLimit: 0,
        lockLimit: 0,
        processEvery: '30 seconds',
      } as unknown as IAgendaConfig);

      const { broker, fullName: caller } = this;

      Object.keys(jobs).forEach((name) => {
        CronJob.define(name, async (job: Job) => {
          const { deploymentID, ...jobParams } = job.attrs.data as {
            deploymentID: string;
            [key: string]: unknown;
          };

          type GetGoodActionToCallResponse = Promise<DeploymentManagerResponse>;
          const manager = await (broker.call(
            'deployment-manager.getGoodActionToCall',
            { actionName: `${caller}.LeemonsCronJobExecute` },
            { caller, meta: { deploymentID } }
          ) as GetGoodActionToCallResponse);

          broker.call(
            `${caller}.LeemonsCronJobExecute`,
            { name, jobParams, job },
            {
              caller,
              meta: { deploymentID, relationshipID: manager.relationshipID },
            }
          );
        });
      });

      await CronJob.start();
      this.metadata.CronJob = CronJob;

      this.logger.debug('LeemonsCronJobsMixin created');
    },
  };
}
