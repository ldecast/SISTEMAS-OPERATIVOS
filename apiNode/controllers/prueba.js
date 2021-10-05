// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
let topic;
async function quickstart(
    projectId = 'erudite-justice-328103', // Your Google Cloud Platform project ID
    topicName = 'notifications', // Name for the new topic to create
    subscriptionName = 'my-sub' // Name for the new subscription to create
) {
    // Instantiates a client
    const pubsub = new PubSub({ projectId });

    // Creates a new topic
    [topic] = await pubsub.createTopic(topicName);
    console.log(`Topic ${topic.name} created.`);
    module.exports = topic;

    // Creates a subscription on that new topic
    const [subscription] = await topic.createSubscription(subscriptionName);

    // Receive callbacks for new messages on the subscription
    subscription.on('message', message => {
        console.log('Received message:', message.data.toString());
        // process.exit(0);
    });

    // Receive callbacks for errors on the subscription
    subscription.on('error', error => {
        console.error('Received error:', error);
        process.exit(1);
    });

}


quickstart()