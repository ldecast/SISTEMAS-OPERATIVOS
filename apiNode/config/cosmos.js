var config = {}

config.endpoint = 'https://f60ca9b3-0ee0-4-231-b9ee.documents.azure.com:443/';
config.key = 'tCeaMFaNFR5JYO8AMCg2Htk5DC6figWK7M5TNlAKK5VvkxJhYl5HOU6YT0lWiTgtW2oXCByScbgVKusOu6IUDw==';

config.database = {
    id: 'CosmosDB'
}

config.container = {
    id: 'Tweets'
}

const CosmosClient = require('@azure/cosmos').CosmosClient
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ['/pk'] }

const options = {
    endpoint: endpoint,
    key: key,
    // userAgentSuffix: 'Cosmos-DB-Sopes'
};

const client = new CosmosClient(options);

module.exports = { databaseId: databaseId, containerId: containerId, partitionKey: partitionKey, client: client };
