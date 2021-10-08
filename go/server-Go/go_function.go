package main

import (
	"fmt"
	"net/http"
)

func RunGo(w http.ResponseWriter, r *http.Request) {
	const ENDPOINT_INICIAR = "https://server-python-cxwhp2bmda-uc.a.run.app/iniciarCarga"
	const ENDPOINT_PUBLICAR = "https://server-python-cxwhp2bmda-uc.a.run.app/publicar_python"
	const ENDPOINT_FINALIZAR = "https://server-python-cxwhp2bmda-uc.a.run.app/finalizarCarga"
	ruta := r.URL.Path
	if ruta == "/" {
		fmt.Fprintf(w, "Hi from Cloud Functions - Go :)")
	} else if ruta == "/iniciarCarga" {
		/* Iniciar la carga */
		_, err := http.Get(ENDPOINT_INICIAR)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Fprintf(w, "La conexión se ha iniciado desde Cloud Functions - Go!")
	} else if ruta == "/publicar_go_f" {
		/* Publicar registro */
		resp, err := http.Post(ENDPOINT_PUBLICAR, "application/json", r.Body)
		if err != nil {
			fmt.Println(err)
		}
		defer resp.Body.Close()
		fmt.Fprintf(w, "Registro insertado desde Cloud Functions - Go!")
	} else if ruta == "/finalizarCarga" {
		/* Cerrar la carga */
		_, err := http.Get(ENDPOINT_FINALIZAR)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Fprintf(w, "La conexión se ha finalizado desde Cloud Functions - Go!")
	} else {
		fmt.Fprintf(w, "404 Not Found :/")
	}
}
