from requests import get, post


def run_python(request):
    ENDPOINT_INICIAR = "https://server-python-cxwhp2bmda-uc.a.run.app/iniciarCarga"
    ENDPOINT_PUBLICAR = "https://server-python-cxwhp2bmda-uc.a.run.app/publicar_python"
    ENDPOINT_FINALIZAR = "https://server-python-cxwhp2bmda-uc.a.run.app/finalizarCarga"
    request_json = request.get_json()
    ruta = request.path
    if ruta == "/":
        return f'Hi from Cloud Functions - Python!'
    elif ruta == "/iniciarCarga":
        # Iniciar la carga
        get(ENDPOINT_INICIAR)
        return f'Carga iniciada desde Cloud Functions - Python!'
    elif ruta == "/publicar_python_f":
        # Publicar registro
        post(ENDPOINT_PUBLICAR, json=request_json)
        return f'Registro enviado desde Cloud Functions - Python!'
    elif ruta == "/finalizarCarga":
        # Finalizar la carga
        get(ENDPOINT_FINALIZAR)
        return f'Carga finalizada desde Cloud Functions - Python!'
    else:
        return f'404 Not Found :('
