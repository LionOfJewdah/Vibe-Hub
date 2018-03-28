const app_dispatcher = require('./frontEndHandler');
const mqtt_module = require('./barDataReceiver');

const mqtt_receiver = mqtt_module((num) => app_dispatcher.updateCount(num));
