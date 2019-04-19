const fp = require('fastify-plugin');
const AWS = require('aws-sdk');

module.exports = fp(function(fastify, opts, next) {
  if (!opts.config || typeof opts.config !== 'object') {
    return next(new Error('You need to provide config.'));
  }

  const config = opts.config;
  if (typeof config.region === 'undefined') {
    return next(new Error('Region is not provided.'));
  }

  AWS.config.update({region: config.region});

  fastify.decorate('ses', {
    async send(params) {
      if (typeof params.to !== 'string') {
        throw new Error('Invalid param: to');
      }
      if (typeof params.from !== 'string') {
        throw new Error('Invalid param: from');
      }
      if (typeof params.subject !== 'string') {
        throw new Error('Invalid param: subject');
      }
      if (typeof params.text !== 'string') {
        throw new Error('Invalid param: text');
      }
      var sesParams = {
        Destination: {
          ToAddresses: [
            params.to
          ],
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: params.text
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: params.subject
          }
        },
        Source: params.from,
      };
      // TODO: Add additional params

      var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(sesParams).promise();
      return sendPromise.then(
        function(data) {
          return data.MessageId;
      }).catch(
        function(err) {
          throw err;
      });
    },
  });
  next();
});
