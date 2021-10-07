package main

import (
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

/***** VARIABLES GLOBALES *****/
var mysql_counter = 0
var mysql_timer = 0

// var cosmos_counter = 0
// var cosmos_timer = 0

/******************************/

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
		return err
	}
	fmt.Printf("Published a message; msg ID: %v\n", id)
	return nil
}

func initConnection(w http.ResponseWriter, r *http.Request) {
	mysql_counter = 0
	mysql_timer = 0
	// cosmos_counter = 0
	// cosmos_timer = 0
	fmt.Println("Se ha iniciado la conexión en espera de la carga.")
}

func insertData(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "root:123456789@tcp(34.122.20.143)/MYSQLDB")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	reqBody, _ := ioutil.ReadAll(r.Body)
	// var b bytes.Buffer
	// b.Write(reqBody)
	// fmt.Println(b.String())
	var post Comentario
	json.Unmarshal(reqBody, &post)
	// fmt.Println(post)

	start := time.Now()
	db.Exec(`INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
	VALUES ("` + post.Nombre + `", "` + post.Comentario + `", 0, ` + strconv.Itoa(post.Upvotes) +
		`, 0, ` + strconv.Itoa(post.Downvotes) + `, "` + post.Fecha + `", "");`)
	// Obtener el id del último comentario ingresado
	var id int
	last_row := db.QueryRow(`SELECT id
		FROM COMENTARIO
		ORDER BY id DESC
		LIMIT 1;`)

	exc := last_row.Scan(&id)
	if exc != nil {
		panic(exc)
	}

	for i := 0; i < len(post.Hashtags); i++ {
		hashtag := post.Hashtags[i]
		db.Exec(`INSERT INTO HASHTAG (tag, ID_comentario)
		    VALUES ("` + hashtag + `", ` + strconv.Itoa(id) + `);`)
	}
	// increment our global variables
	mysql_counter++
	mysql_timer += int(time.Since(start).Seconds())
}

func endConnection(w http.ResponseWriter, r *http.Request) {
	var notif Notification
	notif.Api = "Golang"
	notif.Db = "CloudSQL"
	notif.Guardados = mysql_counter
	notif.Tiempo = mysql_timer
	err := publish(notif)
	if err != nil {
		fmt.Printf("Error publishing message")
	}
	fmt.Println("La conexión se ha finalizado y se ha enviado una notificación a Google PubSub.\n")
}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) { fmt.Println("Hi from GO server!") })
	myRouter.HandleFunc("/iniciarCarga", initConnection).Methods("POST", "GET")
	myRouter.HandleFunc("/publicar", insertData).Methods("POST")
	myRouter.HandleFunc("/endpoint/go", insertData).Methods("POST")
	myRouter.HandleFunc("/finalizarCarga", endConnection).Methods("POST", "GET")
	log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
	fmt.Println("Go server listening on port: 10000")
	handleRequests()
}
