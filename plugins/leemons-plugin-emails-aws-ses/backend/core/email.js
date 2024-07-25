const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const aws = require('aws-sdk');
const nodemailer = require('nodemailer');
const { getAWSCredentials } = require('@leemons/aws/src');

class Email {
  static async saveConfig({ ctx, config }) {
    if (config.id) {
      return ctx.tx.db.Config.findOneAndUpdate({ id: config.id }, config, {
        new: true,
        lean: true,
      });
    }
    const configDoc = await ctx.tx.db.Config.create(config);
    return configDoc.toObject();
  }

  static async removeConfig({ id, ctx }) {
    const deletedDoc = await ctx.tx.db.Config.findOneAndDelete({ id });
    return deletedDoc.toObject();
  }

  static async getProviders({ ctx }) {
    const credentials = await getAWSCredentials({
      prefix: 'SES',
      ctx,
    });

    if (credentials) {
      return [
        {
          id: 'aws-ses',
          deploymentID: ctx.meta.deploymentID,
          name: 'Amazon SES',
          region: credentials.region,
          accessKey: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
        },
      ];
    }

    console.error('================================================');
    console.error('[EMAIL SES] No credentials found in @leemons/aws');
    console.error('================================================');

    return ctx.tx.db.Config.find().lean();
  }

  static async sendMail({ ctx, provider, ...emailConfig }) {
    const transporter = Email.getTransporterByConfig({ config: provider });
    return transporter.sendMail(emailConfig);
  }

  static getTransporterByConfig({ config }) {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: config.region,
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretAccessKey,
      sessionToken: config.sessionToken,
    });
    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });
    transporter.use('compile', htmlToText());
    transporter.use('compile', inlineBase64());
    return transporter;
  }
}

module.exports = Email;
