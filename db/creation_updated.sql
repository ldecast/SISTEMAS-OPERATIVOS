DROP DATABASE IF EXISTS MYSQLDB;

/* Creación de la base de datos */
CREATE DATABASE IF NOT EXISTS MYSQLDB DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;

USE MYSQLDB;

/* Creación de la tabla principal */
CREATE TABLE IF NOT EXISTS COMENTARIO (
	id INT AUTO_INCREMENT,
	username VARCHAR(35) NOT NULL,
	content VARCHAR(255),
    upvoted BOOLEAN,
    upvotes_count INTEGER,
    downvoted BOOLEAN,
    downvotes_count INTEGER,
    fecha VARCHAR(20),
    avatar VARCHAR(255),
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

/* Creación de la tabla hashtag */
CREATE TABLE IF NOT EXISTS HASHTAG (
	ID_hashtag INT AUTO_INCREMENT,
    ID_comentario INT,
    tag VARCHAR(255), -- contenido
    FOREIGN KEY (ID_comentario) REFERENCES COMENTARIO(id),
    PRIMARY KEY (ID_hashtag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

/* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Danniel", "Este es mi primer post con socket.io en mi página de App Engine!\nDesde MySQL💻🤑", 0, 14, 0, 1, "23/09/2021", "https://lh3.googleusercontent.com/pw/AM-JKLU19vwna9NHfhvxIk9rQSMXl_2Gu9f0U_y5pH_mH18vDHmD6uyyMtG5bKK6BnfB9cy8yKrAKsPOTUCg6Lb1uNLYmm7uXdS0asKXN4rCgF_Z1pvZpiu7fNW1GxjTia0PNlqJXC0OnzHRvySLrvWrw3Tc=s940-no");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("twitter", 1);

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("SOPES1", 1);

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("gcloud", 1);

-- /* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Sergio Méndez", "Si pudiera me casaría con kubernetes🤓🤓", 0, 7, 0, 14, "23/08/2021", "");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("cloudNative", 2);

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("openSource", 2);


-- /* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Murphy Paiz", "Estar preso sólo es divertido la primer semana 🤡", 0, 13, 1, 85, "07/09/2021", "");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("sáquenme", 3);

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("TricentenariaxSiempre", 3);

-- /* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Bárbara Raquel", "Miau\n<3", 0, 41, 0, 1, "28/09/2021", "");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("🐱", 4);


-- /* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Sergio Méndez", "Sigan KCD Guatemala, porfa", 0, 13, 0, 22, "23/08/2021", "");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("KCD GT", 5);

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("WOW", 5);


-- /* Post */
-- INSERT INTO COMENTARIO (username, content, upvoted, upvotes_count, downvoted, downvotes_count, fecha, avatar)
-- VALUES ("Alejandro Giamattei", "Se antoja otro préstamo. 💸💸💸", 0, 12, 0, 453, "23/01/2022", "https://pbs.twimg.com/profile_images/1350101221844127750/kdf4XmVr_400x400.jpg");

-- INSERT INTO HASHTAG (tag, ID_comentario)
-- VALUES ("JuntosSaldremosAdelante", 6);


/* Query para obtener el último el ID del último comentario */
-- SELECT id
-- FROM COMENTARIO
-- ORDER BY id DESC
-- LIMIT 1;

SELECT * FROM COMENTARIO;
SELECT * FROM HASHTAG;
