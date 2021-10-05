import json
import requests

ENDPOINT = "http://127.0.0.1:5000/publicar"


def cargar_datos(ruta):
    with open(ruta, "r") as contenido:
        data_jsons = json.load(contenido)
        enviarTrafico(data_jsons)


def enviarTrafico(data_jsons):
    # print("DATOS PARA ENVIAR ", data_jsons)
    r = requests.post(ENDPOINT, json=data_jsons)
    print(r.json())


def main():
    print('--------- PYTHON LOAD TESTER---------')
    archivo = input('Ingrese el nombre del archivo a cargar:\n')
    cargar_datos(archivo)


# FUNCION MAIN
main()
