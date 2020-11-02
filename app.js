// On appelle içi les dependance qu'on a besoin
const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config({ path: './.env' });

const app = express();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));

//--Connection avec la base de donnée--
const db = mysql.createConnection({
    //--On a déclarer tous dans .env et l'appelle seulement
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

//--Tester la connection avec la base de donnée
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

app.use('/', require('./routes/page'))

//--------Authentification-------------------
app.use('/auth', require('./routes/auth'));

app.listen(8080, () => {
    console.log("Server started on Port 8080");
})