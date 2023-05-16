const table = {
  config: leemons.query('providers_leebrary-aws-s3::config'),
  multipartUploads: leemons.query('providers_leebrary-aws-s3::multipart-uploads'),
  multipartEtag: leemons.query('providers_leebrary-aws-s3::multipart-etag'),
};

module.exports = { table };
