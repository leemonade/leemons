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
    },
    actions: {
      LeemonsCronJobExecute: async (ctx) => {
        const { name } = ctx.params;

        ctx.params = ctx.params.jobParams;
        return jobs[name]?.(ctx);
      },
    },

    hooks: {
      before: {
        '*': [
          function (ctx) {
            const { deploymentID } = ctx.meta;
            const { CronJob } = this.metadata;

            ctx.cronJob = {
              schedule: (when, jobName, params = {}) => {
                if (!jobName || !when) {
                  return;
                }

                CronJob.schedule(when, jobName, {
                  ...params,
                  deploymentID: deploymentID ?? params.deploymentID,
                });
              },
              every: (interval, jobName, params = {}) => {
                if (!jobName || !interval) {
                  return;
                }

                CronJob.every(interval, jobName, {
                  ...params,
                  deploymentID: deploymentID ?? params.deploymentID,
                });
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
            { name, jobParams },
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
