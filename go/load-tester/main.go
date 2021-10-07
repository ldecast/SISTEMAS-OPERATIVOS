package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

// PYTHON SERVER
const ENDPOINT1 = "http://127.0.0.1:5000/iniciarCarga"
const ENDPOINT2 = "http://127.0.0.1:5000/publicar"
const ENDPOINT3 = "http://127.0.0.1:5000/finalizarCarga"
const ENDPOINT4 = "http://127.0.0.1:5000/endpoint/python"

// GO SERVER
const ENDPOINT5 = "http://localhost:10000/iniciarCarga"
const ENDPOINT6 = "http://localhost:10000/publicar"
const ENDPOINT7 = "http://localhost:10000/finalizarCarga"
const ENDPOINT8 = "http://localhost:10000/endpoint/go"

type Comentario struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

func iniciarCarga() {
	/* Iniciar la carga */
	_, err := http.Get(ENDPOINT1)
	if err != nil {
		fmt.Println(err)
	}
}

func publicar() {
	// fmt.Println("Ingresa la ruta del archivo de entrada sin espacios: ")
	var input string = "/home/ldecast/Escritorio/entrada.json"
	// fmt.Scanln(&input)
	// Open the jsonFile
	jsonFile, err := os.Open(input)
	if err != nil {
		fmt.Println(err)
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'Comentario' which we defined above
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var posts []Comentario
	json.Unmarshal(byteValue, &posts)
	for i := 0; i < len(posts); i++ {
		/* Enviar el archivo a un endpoint (Google Load Balancer) */
		post, err := json.Marshal(posts[i])
		if err != nil {
			fmt.Println(err)
		}
		resp, err := http.Post(ENDPOINT2, "application/json", bytes.NewBuffer(post))
		if err != nil {
			fmt.Println(err)
		}
		defer resp.Body.Close()
		//Read the response body
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("STATUS:", resp.Status)
		fmt.Println("response Headers:", resp.Header)
		fmt.Println("response Body:", string(body))
		fmt.Println()
	}
}

func finalizarCarga() {
	/* Cerrar la carga */
	_, err := http.Get(ENDPOINT3)
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	fmt.Println("Load tester initiated on Go")
	iniciarCarga()
	publicar()
	finalizarCarga()
}
