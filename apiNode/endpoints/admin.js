const express = require('express');

const router = express.Router();

function changeDateFormat(date) {
    let formated = "";
    try {
        var splitDate = String(date).split('-');
        formated = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];
    } catch (error) {
        console.log(error);
    }
    return formated;
}

router.post('/', async (req, res) => {
    try {
        const _db = req.body.db;
        const _date = changeDateFormat(req.body.fecha);
        let data = {
            posts: [],
            noticias: 0,
            hashtags: 0,
            upvotes: 0,
            downvotes: 0,
            vs_upvotes: 0,
            vs_downvotes: 0,
            top_five: []
        };

        if (_db === "1") { // MySQL
            const connection = require("../config/mysql");
            let posts = [];
            connection.query(`SELECT COUNT(*) AS noticias FROM COMENTARIO;`, function (err, result) {
                if (err) throw err;
                data.noticias = result[0].noticias;

                connection.query(`SELECT * FROM COMENTARIO 
                ORDER BY id DESC
                LIMIT 10;`, function (err, results) {
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
                            posts.push(item);
                            if (i == (results.length - 1)) {
                                data.posts = posts;
                                connection.query(`SELECT COUNT(DISTINCT tag) AS "tags_count" FROM HASHTAG;`, function (err, result) {
                                    if (err) throw err;
                                    data.hashtags = result[0].tags_count;

                                    connection.query(`SELECT SUM(upvotes_count) AS "total_upvotes" FROM COMENTARIO;`, function (err, result) {
                                        if (err) throw err;
                                        data.upvotes = result[0].total_upvotes;

                                        connection.query(`SELECT SUM(downvotes_count) AS "total_downvotes" FROM COMENTARIO;`, function (err, result) {
                                            if (err) throw err;
                                            data.downvotes = result[0].total_downvotes;

                                            connection.query(`SELECT SUM(upvotes_count) AS "upvotes_day"
                                            FROM COMENTARIO
                                            WHERE fecha = "${_date}";`, function (err, result) {
                                                if (err) throw err;
                                                data.vs_upvotes = result[0].upvotes_day;

                                                connection.query(`SELECT SUM(downvotes_count) AS "downvotes_day"
                                                FROM COMENTARIO
                                                WHERE fecha = "${_date}";`, function (err, result) {
                                                    if (err) throw err;
                                                    data.vs_downvotes = result[0].downvotes_day;

                                                    connection.query(`SELECT h.tag AS tag, c.upvotes_count AS counter
                                                    FROM HASHTAG h
                                                    INNER JOIN COMENTARIO c ON c.id = h.ID_comentario
                                                    ORDER BY c.upvotes_count DESC;`, function (err, result) {
                                                        if (err) throw err;
                                                        data.top_five = result;

                                                        res.status(200).send(data);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }

        else { // Cosmos DB
            const cosmos = require("../config/cosmos");
            var querySpec = {
                query: `SELECT c.nombre AS username,
                c.comentario AS content,
                c.avatar,
                c.upvoted,
                c.upvotes AS upvotes_count,
                c.downvoted,
                c.downvotes AS downvotes_count,
                c.fecha,
                c.id,
                c.hashtags
                FROM c
                WHERE IS_DEFINED(c.nombre)`
            }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            let j = 0;
            data.noticias = results.length;
            for (let i = data.noticias - 1; (i >= 0 && j < 10); i--) {
                const element = results[i];
                data.posts.push(element);
                j++
            }
            querySpec = { query: `SELECT COUNT(1) AS tags_count FROM (SELECT DISTINCT h FROM c JOIN h IN c.hashtags)` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.hashtags = results[0].tags_count;

            querySpec = { query: `SELECT SUM(c.upvotes) AS total_upvotes FROM c` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.upvotes = results[0].total_upvotes;

            querySpec = { query: `SELECT SUM(c.downvotes) AS total_downvotes FROM c` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.downvotes = results[0].total_downvotes;

            querySpec = { query: `SELECT SUM(c.upvotes) AS upvotes_day FROM c WHERE c.fecha = "${_date}"` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.vs_upvotes = results[0].upvotes_day;

            querySpec = { query: `SELECT SUM(c.downvotes) AS downvotes_day FROM c WHERE c.fecha = "${_date}"` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.vs_downvotes = results[0].downvotes_day;

            querySpec = {
                query: `SELECT c.upvotes AS counter, h AS tag
            FROM c
            JOIN h IN c.hashtags` }
            var { resources: results } = await cosmos.client.database(cosmos.databaseId).container(cosmos.containerId).items.query(querySpec).fetchAll();
            data.top_five = results;

            res.status(200).send(data);
        }

    } catch (error) {
        console.log("ERROR: ", error);
        res.sendStatus(500);
    }
});

module.exports = router;
