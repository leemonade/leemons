const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const aws = require('aws-sdk');
const nodemailer = require('nodemailer');

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
