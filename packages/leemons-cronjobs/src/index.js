const { Agenda } = require('@hokify/agenda');

function LeemonsCronJobsMixin({ jobs = {} }) {
  return {
    metadata: {
      mixins: {
        LeemonsCronJobs: true,
      },
    },
    methods: {
      runScheduled(when, jobName, params = {}) {
        if (!jobName || !when || !params?.deploymentID) {
          this.logger.error(
            `Missing jobName: ${jobName}, when: ${when} or deploymentID: ${params?.deploymentID}`
          );
          return;
        }

        this.metadata.CronJob.schedule(when, jobName, params);
      },
      runEvery(interval, jobName, params = {}) {
        if (!jobName || !interval || !params?.deploymentID) {
          this.logger.error(
            `Missing jobName: ${jobName}, when: ${interval} or deploymentID: ${params?.deploymentID}`
          );
          return;
        }

        this.metadata.CronJob.every(interval, jobName, params);
      },
      cancelJob(jobName, params = {}) {
        if (!jobName || !params?.['data.deploymentID']) {
          this.logger.error(
            `Missing jobName: ${jobName} or deploymentID: ${params?.['data.deploymentID']}`
          );
          return;
        }

        this.metadata.CronJob.cancel({ $and: [{ name: jobName }, params] });
      },
    },
    actions: {
      LeemonsCronJobExecute: async (ctx) => {
        const { name, jobParams, job } = ctx.params;

        ctx.params = { ...jobParams, job };
        return jobs[name]?.(ctx);
      },
    },

    hooks: {
      before: {
        '*': [
          function (ctx) {
            const { deploymentID } = ctx.meta;

            /** @type { Agenda } */
            const CronJob = this.metadata.CronJob;

            ctx.cronJob = {
              schedule: (when, jobName, params = {}) => {
                if (!jobName || !when) {
                  this.logger.error(`Missing jobName: ${jobName} or when: ${when}`);
                  return;
                }

                CronJob.schedule(when, jobName, {
                  ...params,
                  deploymentID: deploymentID ?? params.deploymentID,
                });
              },
              every: async (interval, jobName, params = {}) => {
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
              cancel: (jobName, params = {}) => {
                if (!jobName || !params?.['data.deploymentID']) {
                  this.logger.error(
                    `Missing jobName: ${jobName} or deploymentID: ${params?.['data.deploymentID']}`
                  );
                  return;
                }

                return CronJob.cancel({ $and: [{ name: jobName }, params] });
              },
            };
          },
        ],
      },
    },
    async created() {
      const CronJob = new Agenda({ db: { address: process.env.MONGO_URI } });
      const { broker, fullName: caller } = this;

      Object.keys(jobs).forEach((name) => {
        CronJob.define(name, async (job) => {
          const { deploymentID, ...jobParams } = job.attrs.data;

          const manager = await broker.call(
            'deployment-manager.getGoodActionToCall',
            { actionName: `${caller}.LeemonsCronJobExecute` },
            { caller, meta: { deploymentID } }
          );

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

module.exports = { LeemonsCronJobsMixin };
