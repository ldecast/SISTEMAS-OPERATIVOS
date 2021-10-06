import requests


# ENDPOINT = "http://127.0.0.1:5000/endpoint/python"  # Python server
ENDPOINT = "http://localhost:10000/endpoint/go"  # Go server


def cargar_datos(ruta):
    with open(ruta, "rb") as contenido:
        # data_jsons = json.load(contenido)
        data_jsons = contenido.read()
        enviarTrafico(data_jsons)


def enviarTrafico(data_jsons):
    # print("DATOS PARA ENVIAR ", data_jsons)
    r = requests.post(ENDPOINT, data=data_jsons)
    print(r.json())


def main():
    print('--------- PYTHON LOAD TESTER---------')
    # archivo = input('Ingrese el nombre del archivo a cargar:\n')
    cargar_datos("/home/ldecast/Escritorio/MOCK_DATA.json")


# FUNCION MAIN
main()
