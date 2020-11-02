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

//-------------Login-------------------
exports.login = (req, res) => {
    try {
        // passport.authenticate('local');
        const { email, password } = req.body;
        console.log("Password", password)

        if (!email || !password) {
            return res.status(400).render('', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM user WHERE email = ?', [email], async(error, results) => {
            console.log("ito", results);
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log("crypter", hashedPassword);
            // const salt = await bcrypt.genSaltSync(10);
            // const password = await req.body.password;
            //-------------Il y a une problème sur cette ligne code-----------------
            // if (!results || results[0].password !== password) {
            //-------------Solution-----------------
            if (!results || !(await bcrypt.compare(password, hashedPassword))) {
                res.status(401).json({
                        message: 'Email or Password id incorrect'
                    })
                    // res.send("Email or Password id incorrect");
            } else {
                // const id = results[0].id;

                // const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
                //     expiresIn: process.env.JWT_EXPIRES_IN
                // });

                // console.log("The token is:" + token);

                // const cookieOptions = {
                //     expires: new DataCue(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                //     ),
                //     httpOnly: true
                // }
                // await res.cookie('jwt', token, cookieOptions);
                // ---------------Valeur à retourner-----------------
                res.json(results[0]);
            }
        })

    } catch (err) {
        console.log(err);
    }

}

//-------------Inscription---------------------
exports.register = (req, res) => {
    console.log("Inscriptio 1", req.body);

    const { nom, email, password } = req.body;

    db.query('SELECT email FROM user user WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log("Inscriptio é error", error);
        }

        if (results.length > 0) {
            // Cette fonction retourne la view register avec le message d'erreur
            // Mais il y a une problème
            return res.render('register', {
                    message: 'That email is already in use'
                })
                // res.send("That email is already in use");
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
                // Mais il y a une problème
                console.log(error);
                return res.json({
                    message: 'user registered'
                });
                // res.send("Register user failed");
            }
        })
    });

    // res.send("Test");
}