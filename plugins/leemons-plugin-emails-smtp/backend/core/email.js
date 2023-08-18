const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const nodemailer = require('nodemailer');

class Email {
  static async saveConfig({ ctx, config }) {
    if (config.id) {
      return ctx.tx.db.Config.findOneAndUpdate({ id: config.id }, config);
    }
    return ctx.tx.db.Config.create(config);
  }

  static async removeConfig({ id, ctx }) {
    return ctx.tx.db.Config.findOneAndDelete({ id });
  }

  static async getProviders({ ctx }) {
    return ctx.tx.db.Config.find();
  }

  static async sendMail({ ctx, provider, ...emailConfig }) {
    const transporter = Email.getTransporterByConfig({ config: provider });
    return transporter.sendMail(emailConfig);
  }

  static getTransporterByConfig({ config }) {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: parseInt(config.port, 10),
      secure: !!config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    transporter.use('compile', htmlToText());
    transporter.use('compile', inlineBase64());
    return transporter;
  }
}

module.exports = Email;
