const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// module.exports = authorize;
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
        console.log("REq body", req.body)

        var headers = {};
        // IE8 n'autorise pas la spécification de domaines, juste le *
        // headers ["Access-Control-Allow-Origin"] = req.headers.origin;
        if (req.body.password === '' || req.body.email === '') {
            console.log("Test 1")
            res.status(405).json({
                message: 'Aucun résultat'
            });
        }



        db.query('SELECT * FROM user WHERE email = ?   ', [email], async(error, results) => {
            console.log("ito", results);
            if (req.method === 'OPTIONS') {
                console.log('! OPTIONS');
                var headers = {};
                // IE8 n'autorise pas la spécification de domaines, juste le *
                // headers ["Access-Control-Allow-Origin"] = req.headers.origin;
                headers["Access-Control-Allow-Origin"] = "*";
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                headers["Access-Control-Allow-Credentials"] = false;
                headers["Access-Control-Max-Age"] = '86400'; // 24 heures
                headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
                res.writeHead(200, en - têtes);
                res.end();

            } else if (email != results.email) {
                console.log("Test 2")
                res.status(406).json({
                    message: 'Aucun résultat'
                });
            } else if (!results || !(bcrypt.compareSync(password, results[0].password))) {
                res.status(401).json({
                    message: 'Email or Password id incorrect'
                });

            } else {
                // const id = results[0].id;

                // const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                //     expiresIn: process.env.JWT_EXPIRES_IN
                // });

                // console.log("The token is:" + token);

                // const cookieOptions = {
                //     expires: new DataCue(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                //     ),
                //     httpOnly: true
                // }
                // res.cookie('jwt', token, cookieOptions);

                // ---------------Valeur à retourner-----------------
                res.json(results[0]);
            }

            //--------------------------------------------------

            //--------------------------------------------
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
        // if (error) {
        //     console.log("L'inscription réfuer", error);
        // }

        if (results.length > 0) {
            // Cette fonction retourne la view register avec le message d'erreur
            // Mais il y a une problème
            return res.render('register', {
                message: 'Email est déja utiliser'
            })
        }

        // let hashedPassword = await bcrypt.hash(password, 8);

        // const encryptPWD = (password) => {
        //     // Hash password and salt with md5 encryption
        //     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        // }

        let encryptPWD = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        // console.log(hashedPassword)

        //-----------INSERTION dans la base de données-------------------
        db.query('INSERT INTO user SET ?', { nom: nom, email: email, password: encryptPWD }, (error, results) => {
            if (results) {
                console.log("Inscription results", results);
                // res.send("user registered");

                //------------Renvoyer le json----------------
                res.json(results);
            } else {
                // Mais il y a une problème
                console.log(error);
                // return res.json({
                //     message: 'user registered'
                // });
                return res.json(results);
            }
        })
    });

}