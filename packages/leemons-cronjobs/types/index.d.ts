import { Agenda, Job } from '@hokify/agenda';
import { ServiceSchema } from '@leemons/deployment-manager';

export interface CronJobContext {
  params: { job: Job };
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

export interface LeemonsCronJobsMixinOptions<T> {
  jobs?: Record<string, (ctx: CronJobContext) => Promise<T> | T>;
}

export function LeemonsCronJobsMixin(options: LeemonsCronJobsMixinOptions): Partial<ServiceSchema>;

export interface LeemonsCronJobsService extends Partial<ServiceSchema> {
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
}
