const Get = require('./lib/get');
const sms = require('./lib/sms');
const logs = require('./lib/logs');

Get();
sms();
logs();

console.log('ok');
