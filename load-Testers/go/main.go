package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

const ENDPOINT = "http://localhost:10000/publicar"

func processFile() {
	fmt.Println("Ingresa la ruta del archivo de entrada sin espacios: ")
	// Taking input from user
	var input string
	fmt.Scanln(&input)
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

	/* Enviar el archivo a un endpoint (Google Load Balancer) */
	request, err := http.NewRequest("POST", ENDPOINT, bytes.NewBuffer(byteValue))
	if err != nil {
		fmt.Println(err)
	}
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	fmt.Println("response Status:", response.Status)
	fmt.Println("response Headers:", response.Header)
	body, _ := ioutil.ReadAll(response.Body)
	fmt.Println("response Body:", string(body))
}

func main() {
	// fmt.Println("Load tester initiated on Go")
	processFile()
}
