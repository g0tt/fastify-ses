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
    send(params) {
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

      sendPromise.then(
        function(data) {
          console.log('Email sent: ' + data.MessageId);
        }).catch(
          function(err) {
            console.error(err, err.stack);
        });
      },
    });
    next();
});
