const topic = require("./prueba")

// Send a message to the topic
topic.publish(Buffer.from('Test message!'));
