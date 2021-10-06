const { PubSub } = require('@google-cloud/pubsub');

/* EXPOSE THE ENV KEY FILENAME !!!!!!!  Importante para poder autenticar:
export GOOGLE_APPLICATION_CREDENTIALS="key.json"
*/
async function startPubSub(
    projectId = 'erudite-justice-328103', // Your Google Cloud Platform project ID
    topicName = 'notifications', // Name for the new topic to create
    subscriptionName = 'notifications-sub' // Name for the new subscription to create
) {
    try {
        // Socket.io
        const io = require('../controllers/sockets').get();

        // Instantiates a client
        const pubsub = new PubSub({ projectId });

        /* // Creates a new topic
        const [topic] = await pubsub.createTopic(topicName);
        console.log(`Topic ${topic.name} created.`);
        // Creates a subscription on that new topic
        const [subscription] = await topic.createSubscription(subscriptionName); */

        const subscription = pubsub.subscription('notifications-sub')

        // Receive callbacks for new messages on the subscription
        subscription.on('message', message => {
            // console.log('Received message:', message.data.toString());
            utf8decoder = new TextDecoder('utf8');
            // console.log(JSON.parse(utf8decoder.decode(message.data)))
            io.emit('notification', JSON.parse(utf8decoder.decode(message.data)));
            message.ack();
        });

        // Receive callbacks for errors on the subscription
        subscription.on('error', error => {
            console.error('Received error:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { pubsub: startPubSub };