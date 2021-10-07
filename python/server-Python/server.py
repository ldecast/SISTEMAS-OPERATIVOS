from flask import Flask, json, request
import config
import azure.cosmos.cosmos_client as cosmos_client
from google.cloud import pubsub_v1
from flask.typing import StatusCode
from uuid import uuid4
import mysql.connector
import time
import os
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'key.json'

# ----------------------------------------------------------------------------------------------------------
# Prerequistes -
#
# Microsoft Azure Cosmos PyPi package -
#    https://pypi.python.org/pypi/azure-cosmos/
#
# Google Cloud Pub Sub package -
#    https://pypi.org/project/google-cloud-pubsub/
# ----------------------------------------------------------------------------------------------------------
# API Python
# ----------------------------------------------------------------------------------------------------------


HOST_COSMOS = config.settings_cosmos['host']
MASTER_KEY_COSMOS = config.settings_cosmos['master_key']
DATABASE_ID_COSMOS = config.settings_cosmos['database_id']
CONTAINER_ID_COSMOS = config.settings_cosmos['container_id']

app = Flask(__name__)


def pub(data) -> None:
    """Publishes a message to a Pub/Sub topic."""
    # Initialize a Publisher client.
    project_id: str = 'erudite-justice-328103'
    topic_id: str = 'notifications'
    client = pubsub_v1.PublisherClient()
    # Create a fully qualified identifier of form `projects/{project_id}/topics/{topic_id}`
    topic_path = client.topic_path(project_id, topic_id)

    # Data sent to Cloud Pub/Sub must be a bytestring.
    # When you publish a message, the client returns a future.
    api_future = client.publish(topic_path, json.dumps(data).encode('utf-8'))
    message_id = api_future.result()
    print(f"Published {data} to {topic_path}: {message_id}")


@app.route('/', methods=['GET'])
def root():
    return "Hello from Python server!"


#### VARIABLES GLOBALES ####
mysql_counter = 0
mysql_timer = 0
cosmos_counter = 0
cosmos_timer = 0
############################


@app.route('/iniciarCarga', methods=['GET', 'POST'])
def iniciarCarga():
    """ Resetear en 0 """
    global mysql_counter
    mysql_counter = 0

    global mysql_timer
    mysql_timer = 0

    global cosmos_counter
    cosmos_counter = 0

    global cosmos_timer
    cosmos_timer = 0
    print("Carga iniciada.")
    return "Conexión iniciada exitosamente en espera de los datos."


@app.route('/finalizarCarga', methods=['GET', 'POST'])
def finalizarCarga():
    """ Enviar notificaciones al Pub/Sub """
    notification = {
        "guardados": mysql_counter,
        "api": "Python",
        "tiempoDeCarga": mysql_timer,
        "bd": "CloudSQL"
    }
    pub(json.dumps(notification))
    notification = {
        "guardados": cosmos_counter,
        "api": "Python",
        "tiempoDeCarga": cosmos_timer,
        "bd": "CosmosDB"
    }
    pub(json.dumps(notification))
    print("Carga finalizada.\n")
    return "Conexión finalizada exitosamente."


# ENDPOINTS CON LA MISMA FUNCIÓN
@app.route('/endpoint/python', methods=['POST'])  # PARA PYTHON
@app.route('/publicar', methods=['POST'])  # GENERAL
def publicar():
    """ Insertar registro """
    body = request.get_json()  # .get_json() si se mandara un json
    # print('BODY=', body)
    insertToCosmos(body)
    insertToMySQL(body)
    return "Registro ingresado"


def insertToMySQL(post):
    try:
        mydb = mysql.connector.connect(
            host="34.122.20.143",
            user="root",
            password="123456789",
            database="MYSQLDB"
        )
        cursor = mydb.cursor()
        # post = json.loads(jsonArray)
        start = time.time()
        # for post in posts:
        query = """INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
        VALUES ("{0}", "{1}", {2}, {3}, {4}, {5}, "{6}", "{7}")""".format(post["nombre"], post["comentario"], 0,
                                                                          post["upvotes"], 0, post["downvotes"], post["fecha"], "")
        cursor.execute(query)
        mydb.commit()

        cursor.execute("""SELECT id
        FROM COMENTARIO
        ORDER BY id DESC
        LIMIT 1;""")
        id = cursor.fetchall()[0][0]
        for hashtag in post["hashtags"]:
            query = """INSERT INTO HASHTAG (tag, ID_comentario)
            VALUES ("{0}", {1});""".format(hashtag, id)
            cursor.execute(query)
            mydb.commit()
        global mysql_counter
        mysql_counter += 1

        mydb.commit()
        cursor.close()
        mydb.close()

        global mysql_timer
        end = time.time()
        mysql_timer += int(end-start)
        # print("Se ha insertado correctamente a la base de MySQL")
        return "ok"
    except Exception as e:
        print('\nInserting data has caught an error in MySQL.', e)
        return 'An exception occurred in MySQL: {}'.format(e)


def insertToCosmos(post):
    client = cosmos_client.CosmosClient(
        HOST_COSMOS, {'masterKey': MASTER_KEY_COSMOS})
    try:
        start = time.time()
        db = client.get_database_client(DATABASE_ID_COSMOS)
        container = db.get_container_client(CONTAINER_ID_COSMOS)
        # post = json.loads(jsonArray)
        # for post in posts:
        post["id"] = str(uuid4())
        container.create_item(body=post)

    except Exception as e:
        print('\nInserting data has caught an error in CosmosDB.', e)
        return 'An exception occurred in CosmosDB: {}'.format(e)

    finally:
        global cosmos_counter
        cosmos_counter += 1
        global cosmos_timer
        end = time.time()
        cosmos_timer += int(end-start)
        # print("Se ha insertado correctamente a la base de CosmosDB")
        return "ok"


# if __name__ == '__main__':
app.run()
