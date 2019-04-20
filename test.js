'use strict';

const Fastify = require('fastify');
const request = require('request');
const plugin = require('./index.js');
const t = require('tap');
const params = require('./config.json');

t.only("Register plugin without config", t => {
  const fastify = Fastify();
  fastify.register(plugin, {});
  fastify.ready((err) => {
    if (err === null) {
      t.fail();
    } else {
      t.pass();
    }
    t.end();
  });
});

t.only("Register plugin without region", t => {
  t.plan(1);
  const fastify = Fastify();
  fastify.register(plugin, {
    config: {},
  });
  fastify.ready((err) => {
    if (err === null) {
      t.fail();
    } else {
      t.pass();
    }
    t.end();
  });
});

t.only("Register plugin", t => {
  const fastify = Fastify();
  fastify.register(plugin, {
    config: {
      region: 'us-east-1',
    },
  });
  fastify.ready((err) => {
    if (err !== null) {
      t.fail(err);
    } else {
      t.pass();
    }
    t.end();
  });
});

t.test("Send email", t => {
  t.plan(2);
  const fastify = Fastify();
  fastify.register(plugin, {
    config: {
      region: 'us-east-1',
    },
  });
  fastify.get('/', function(req, reply) {
    fastify.ses.send(params)
      .then(messageId => {
        t.pass("message id: " + messageId);
        t.end();
        process.exit();
      }).catch(err => {
        t.fail(err);
        t.end();
        process.exit();
      });
    reply.send({message: params});
  });

  fastify.listen(8081, '127.0.0.1', ()=> {
    request({
      url: "http://localhost:8081",
      method: "GET",
    }, (err) => {
      if (err !== null) {
        t.fail(err);
      } else {
        t.pass();
      }
    });
  });
});
