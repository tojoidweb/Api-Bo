const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//--Connection avec la base de donnée--
const db = mysql.createConnection({
    //--On a déclarer tous dans .env et l'appelle seulement
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

//-------------Inscription---------------------
exports.register = (req, res) => {
    console.log(req.body);

    const { nom, email, password } = req.body;

    db.query('SELECT email FROM user user WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            // return res.render('', {
            //     message: 'That email is already in use'
            // })
            res.send("That email is already in use");
        }
        //  else if(password !== passwordconfirm) {
        //     return res.render('register', {
        //         message: 'Passwords do not math'
        //     });
        // }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword)

        //-----------INSERTION dans la base de données-------------------
        db.query('INSERT INTO user SET ?', { nom: nom, email: email, password: hashedPassword }, (error, results) => {
            if (results) {
                console.log(results);
                res.send("user registered");
            } else {
                console.log(error);
                // return res.render('', {
                //     message: 'user registered'
                // });
                res.send("Register user failed");
            }
        })
    });

    // res.send("Test");
}