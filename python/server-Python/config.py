import os

settings_cosmos = {
    'host': os.environ.get('ACCOUNT_HOST', 'https://f60ca9b3-0ee0-4-231-b9ee.documents.azure.com:443/'),
    'master_key': os.environ.get('ACCOUNT_KEY', 'tCeaMFaNFR5JYO8AMCg2Htk5DC6figWK7M5TNlAKK5VvkxJhYl5HOU6YT0lWiTgtW2oXCByScbgVKusOu6IUDw=='),
    'database_id': os.environ.get('COSMOS_DATABASE', 'CosmosDB'),
    'container_id': os.environ.get('COSMOS_CONTAINER', 'Tweets'),
}

settings_mysql = {
    'ip': os.environ.get('IP', '34.122.20.143'),
    'user': os.environ.get('USER', 'root'),
    'database': os.environ.get('DATABASE', 'MYSQLDB'),
    'password': os.environ.get('PASSWORD', '123456789'),
    'charset': os.environ.get('CHARSET', 'utf8mb4'),
}
