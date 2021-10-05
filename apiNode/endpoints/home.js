const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        /* Conexión a base de datos */
        const _db = req.body.db;
        let data = [];
        if (_db === "1") { // MySQL
            const connection = require("../config/mysql");
            connection.query("SELECT * FROM COMENTARIO;", function (err, results) {
                if (err) throw err;
                /* Obtener los hashtags de cada registro */
                for (let i = 0; i < results.length; i++) {
                    const element = results[i];
                    let item = element;
                    connection.query(`SELECT h.tag
                    FROM HASHTAG h
                    INNER JOIN COMENTARIO c ON c.id = h.ID_comentario
                    WHERE c.id = ${element.id};`, function (err, result) {
                        if (err) throw err;
                        item['hashtags'] = result;
                        data.push(item);

                        if (i == (results.length - 1)) {
                            res.status(200).send(data);
                        }
                    });
                }
                if (results.length === 0)
                    res.status(200).send([]);
            });
        }
        else { // Cosmos DB
            const cosmos = require("../config/cosmos");
            let querySpec = {
                query: `SELECT c.nombre AS username,
                c.comentario AS content,
                c.avatar,
                c.upvoted,
                c.upvotes AS upvotes_count,
                c.downvoted,
                c.downvotes AS downvotes_count,
                c.fecha,
                c.hashtags,
                c.id
                FROM c
                WHERE IS_DEFINED(c.nombre)`
            }
            const { resources: results } = await cosmos.client
                .database(cosmos.databaseId)
                .container(cosmos.containerId)
                .items.query(querySpec)
                .fetchAll();
            res.status(200).send(results);
        }
    } catch (error) {
        console.log("ERROR: ", error);
        res.sendStatus(500);
    }
})

router.post('/post', async (req, res) => {
    try {
        const post = req.body;
        const io = require('../controllers/sockets').get();
        if (post.db === "1") { // MySQL
            const connection = require("../config/mysql");
            connection.query(`INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
            VALUES ("${post.username}", "${post.content}", 0, 0, 0, 0, "${post.fecha}", "${post.avatar}");`, function (err) {
                if (err) throw err;
                /* Obtener el último comentario ingresado */
                connection.query(`SELECT id
                FROM COMENTARIO
                ORDER BY id DESC
                LIMIT 1;`, function (err, id_comment) {
                    if (err) throw err;
                    /* Insertar hashtags */
                    for (let i = 0; i < post.hashtags.length; i++) {
                        const tag = post.hashtags[i];
                        connection.query(`INSERT INTO HASHTAG (tag, ID_comentario)
                        VALUES ("${tag}", ${id_comment[0].id});`, function (err) {
                            if (err) throw err;

                            if (i == (post.hashtags.length - 1)) {
                                /* Emitir aviso al socket */
                                io.emit('post-added');
                                res.sendStatus(201);
                            }
                        });
                    }
                });
            });
        }
        else { // Cosmos DB
            const cosmos = require("../config/cosmos");
            const database = cosmos.client.database(cosmos.databaseId);
            const container = database.container(cosmos.containerId);
            /* Insertar nuevo item */
            const new_item = {
                nombre: post.username,
                comentario: post.content,
                fecha: post.fecha,
                hashtags: post.hashtags,
                upvoted: 0,
                upvotes: post.upvotes_count,
                downvoted: 0,
                downvotes: post.downvotes_count,
                avatar: post.avatar
            }
            await container.items.create(new_item);
            io.emit('post-added');
            res.sendStatus(201);
        }
    } catch (error) {
        console.log("ERROR: ", error);
        res.sendStatus(500);
    }
})

router.post('/vote', async (req, res) => {
    try {
        const body = req.body;
        const _db = body.db;
        const _id = body.id;
        const io = require('../controllers/sockets').get();
        if (_db === "1") { // MySQL
            const connection = require("../config/mysql");
            connection.query(`UPDATE COMENTARIO
            SET ${body.field} = ${body.val}, ${body.fieldcount} = ${body.newcount}
            WHERE id = ${_id};`, function (err, update) {
                if (err) throw err;
                // console.log(update);
                io.emit('post-voted', update);
                res.sendStatus(201);
            });
        }
        else { // Cosmos DB
            const cosmos = require("../config/cosmos");
            const database = cosmos.client.database(cosmos.databaseId);
            const container = database.container(cosmos.containerId);

            const querySpec = {
                query: `SELECT *
                FROM c
                WHERE c.id = "${_id}"`
            }
            const { resources: results } = await cosmos.client
                .database(cosmos.databaseId)
                .container(cosmos.containerId)
                .items.query(querySpec)
                .fetchAll();

            const item_to_update = results[0];
            if (body.field === "upvoted") {
                item_to_update.upvoted = body.val;
                item_to_update.upvotes = body.newcount;
            }
            else if (body.field === "downvoted") {
                item_to_update.downvoted = body.val;
                item_to_update.downvotes = body.newcount;
            }
            const { resource: updatedItem } = await container
                .item(item_to_update.id)
                .replace(item_to_update);
            // console.log(`Updated item: ${updatedItem.id}`);
            io.emit('post-voted');
            res.sendStatus(201);
        }
    } catch (error) {
        console.log("ERROR: ", error);
        res.sendStatus(500);
    }
})

router.post('/changedb', async (req, res) => {
    try {
        const _db = req.body.db;
        const io = require('../controllers/sockets').get();
        io.emit('db-changed', _db);
        res.sendStatus(200);
    } catch (error) {
        console.log("ERROR: ", error);
        res.sendStatus(500);
    }
})

module.exports = router;
