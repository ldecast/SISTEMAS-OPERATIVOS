import azure.cosmos.cosmos_client as cosmos_client

from flask.typing import StatusCode
from uuid import uuid4
import mysql.connector
import time

# ----------------------------------------------------------------------------------------------------------
# Prerequistes -
#
# Microsoft Azure Cosmos PyPi package -
#    https://pypi.python.org/pypi/azure-cosmos/
# ----------------------------------------------------------------------------------------------------------
# API Python
# ----------------------------------------------------------------------------------------------------------

import config
from flask import Flask, json, request

app = Flask(__name__)


@app.route('/', methods=['GET'])
def root():
    return "Hello from flask!"


HOST_COSMOS = config.settings_cosmos['host']
MASTER_KEY_COSMOS = config.settings_cosmos['master_key']
DATABASE_ID_COSMOS = config.settings_cosmos['database_id']
CONTAINER_ID_COSMOS = config.settings_cosmos['container_id']


@app.route('/iniciarCarga', methods=['GET'])
def iniciarCarga():
    return "Conexión iniciada exitosamente en espera de los datos."


@app.route('/finalizarCarga', methods=['GET'])
def finalizarCarga():
    return "Conexión finalizada exitosamente."


@app.route('/publicar', methods=['POST'])
def publicar():
    print("Realizando las inserciones a las bases de datos...")
    body = request.get_json()
    # print('BODY=', body)
    notifications = {
        "mysql": json.loads(insertToMySQL(json.dumps(body))),
        "cosmos": json.loads(insertToCosmos(json.dumps(body)))
    }
    print("Datos publicados exitosamente.")
    return json.dumps(notifications)


def insertToMySQL(jsonArray):
    mydb = mysql.connector.connect(
        host="34.122.20.143",
        user="root",
        password="123456789",
        database="MYSQLDB"
    )
    cursor = mydb.cursor()
    posts = json.loads(jsonArray)
    counter = 0
    start = time.time()
    for post in posts:
        # print(post["hashtags"])
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
        counter += 1

    mydb.commit()
    cursor.close()
    mydb.close()
    end = time.time()
    notification = {
        "guardados": counter,
        "api": "Python",
        "tiempoDeCarga": int(end-start),
        "bd": "CloudSQL"
    }
    print("Se ha insertado correctamente a la base de MySQL")
    return json.dumps(notification)


def insertToCosmos(jsonArray):
    client = cosmos_client.CosmosClient(
        HOST_COSMOS, {'masterKey': MASTER_KEY_COSMOS})
    try:
        counter = 0
        start = time.time()
        db = client.get_database_client(DATABASE_ID_COSMOS)
        container = db.get_container_client(CONTAINER_ID_COSMOS)
        posts = json.loads(jsonArray)
        for post in posts:
            post["id"] = str(uuid4())
            container.create_item(body=post)
            counter += 1

    except Exception as e:
        print('\nInserting data has caught an error in CosmosDB.', e)

    finally:
        end = time.time()
        notification = {
            "guardados": counter,
            "api": "Python",
            "tiempoDeCarga": int(end-start),
            "bd": "CosmosDB"
        }
        print("Se ha insertado correctamente a la base de CosmosDB")
        return json.dumps(notification)


# if __name__ == '__main__':
app.run()
