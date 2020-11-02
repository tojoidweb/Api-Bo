const mysql = require("mysql");

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

    db.query('SELECT email FROM kenza user WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        }
        //  else if(password !== passwordconfirm) {
        //     return res.render('register', {
        //         message: 'Passwords do not math'
        //     });
        // }
    })

    res.send("From submitted");
}