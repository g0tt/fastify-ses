# fastify-ses
## Usage
```javascript
fastify.register(plugin, {
  config: {
    region: 'us-east-1',
  },
});
```

```javascript
// in fastify.get
const params = {
  to: 'mail@example.com',
  from: 'support@yourdomain.jp',
  subject: 'Test email from fastify',
  text: 'Hello from fastify!!',
};
fastify.ses.send(params)
  .then(messageId => {
    console.log("Success!");
    console.log("message id: " + messageId);
  }).catch(err => {
    console.log("Error!");
    console.error(err);
  });
```
