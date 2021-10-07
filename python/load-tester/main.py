import requests
import json

""" Python server """
ENDPOINT1 = "http://127.0.0.1:5000/iniciarCarga"
ENDPOINT2 = "http://127.0.0.1:5000/publicar"
ENDPOINT3 = "http://127.0.0.1:5000/finalizarCarga"
ENDPOINT4 = "http://127.0.0.1:5000/endpoint/python"

""" Go server """
ENDPOINT5 = "http://localhost:10000/iniciarCarga"
ENDPOINT6 = "http://localhost:10000/publicar"
ENDPOINT7 = "http://localhost:10000/finalizarCarga"
ENDPOINT8 = "http://localhost:10000/endpoint/go"


def cargar_datos(ruta, endpoint):
    with open(ruta, "r") as contenido:
        data_jsons = json.load(contenido)
        for post in data_jsons:
            publicar(post, endpoint)


def iniciarCarga():
    requests.get(ENDPOINT1)


def publicar(post, endpoint):
    # print("REGISTRO PARA ENVIAR ", post)
    r = requests.post(endpoint, json=post)
    print("STATUS:", r.status_code)


def finalizarCarga():
    requests.get(ENDPOINT3)


def main():
    print(' --------- PYTHON LOAD TESTER --------- ')
    # archivo = input('Ingrese el nombre del archivo a cargar:\n')
    archivo = "/home/ldecast/Escritorio/entrada.json"
    iniciarCarga()
    cargar_datos(archivo, ENDPOINT2)
    finalizarCarga()


# FUNCION MAIN
main()
