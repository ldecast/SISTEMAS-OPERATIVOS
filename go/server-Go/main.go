package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"cloud.google.com/go/pubsub"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Comentario struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

type Notification struct {
	Guardados int    `json:"guardados"`
	Api       string `json:"api"`
	Tiempo    int    `json:"tiempoDeCarga"`
	Db        string `json:"bd"`
}

func publish(msg Notification) error {
	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "key.json")
	os.Setenv("PROJECT", "notifications-sub")
	projectID := "erudite-justice-328103"
	topicID := "notifications"
	ctx := context.Background()
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}
	defer client.Close()

	notif, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("json.Marshal: %v", err)
	}

	t := client.Topic(topicID)
	result := t.Publish(ctx, &pubsub.Message{
		Data: notif,
	})
	// Block until the result is returned and a server-generated
	// ID is returned for the published message.
	id, err := result.Get(ctx)
	if err != nil {
		return fmt.Errorf("Get: %v", err)
	}
	fmt.Printf("Published a message; msg ID: %v\n", id)
	return nil
}

var initiated = false

func initConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: iniciarCarga")
	if initiated {
		fmt.Println("La conexión ya ha sido iniciada.")
	} else {
		/* Simula el endpoint de iniciarCarga, pero realmente lo hace todo en la ruta /publicar */
		initiated = true
		fmt.Println("Se ha conectado a la base de datos en espera de la carga.")
	}
}

func insertData(w http.ResponseWriter, r *http.Request) {
	/* Publicar el Json a la bases de datos */
	fmt.Println("Endpoint Hit: publicar")

	db, err := sql.Open("mysql", "root:123456789@tcp(34.122.20.143)/MYSQLDB")
	if err != nil {
		panic(err.Error())
	}
	var b bytes.Buffer
	reqBody, _ := ioutil.ReadAll(r.Body)
	b.Write(reqBody)
	// fmt.Println(b.String())
	var tmp []Comentario
	json.Unmarshal(b.Bytes(), &tmp)

	counter := 0
	start := time.Now()
	for i := 0; i < len(tmp); i++ {
		post := tmp[i]
		db.Exec(`INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
		VALUES ("` + tmp[i].Nombre + `", "` + post.Comentario + `", 0, ` + strconv.Itoa(post.Upvotes) +
			`, 0, ` + strconv.Itoa(post.Downvotes) + `, "` + post.Fecha + `", "");`)
		// Obtener el id del último comentario ingresado
		var id int
		last_row := db.QueryRow(`SELECT id
		FROM COMENTARIO
		ORDER BY id DESC
		LIMIT 1;`)

		err := last_row.Scan(&id)
		if err != nil {
			panic(err)
		}

		for j := 0; j < len(post.Hashtags); j++ {
			hashtag := post.Hashtags[j]
			db.Exec(`INSERT INTO HASHTAG (tag, ID_comentario)
		    VALUES ("` + hashtag + `", ` + strconv.Itoa(id) + `);`)
		}
		// increment our counter variable
		counter++
	}
	timer_mysql := int(time.Since(start).Seconds())
	fmt.Println("Se han cargado los datos a la base de datos.")

	/* Cerrar la conexión a las bases de datos y mandar notificación a Google PubSub */
	db.Close()
	var notif Notification
	notif.Api = "Golang"
	notif.Db = "CloudSQL"
	notif.Guardados = counter
	notif.Tiempo = timer_mysql
	// Response notification
	err = publish(notif)
	if err != nil {
		fmt.Printf("Error publishing message")
	}
	json.NewEncoder(w).Encode(notif)
}

func endConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: finalizarCarga")
	if initiated {
		/* Simula el endpoint de finalizarCarga, pero realmente lo hace todo en la ruta /publicar */
		initiated = false
		fmt.Println("La conexión se ha finalizado y se ha enviado una notificación a Google PubSub.")
	} else {
		fmt.Println("No se encuentra ninguna conexión iniciada.")
	}
}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) { fmt.Println("Hi from GO server!") })
	myRouter.HandleFunc("/iniciarCarga", initConnection)
	myRouter.HandleFunc("/endpoint/go", insertData).Methods("POST")
	myRouter.HandleFunc("/finalizarCarga", endConnection)
	log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
	fmt.Println("Go server listening on port: 10000")
	handleRequests()
}
