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
        console.log("Password", password)

        // if (!email || !password) {
        //     return res.status(400).json('Please provide an email and password')
        // }

        var headers = {};
        // IE8 n'autorise pas la spécification de domaines, juste le *
        // headers ["Access-Control-Allow-Origin"] = req.headers.origin;



        db.query('SELECT * FROM user WHERE email = ?', [email], async(error, results) => {
            console.log("ito", results);
            // let hashedPassword = await bcrypt.hash(password, 8);
            // console.log("crypter", hashedPassword);
            // console.log("crypter 1", hashedPassword);
            // const salt = await bcrypt.genSaltSync(10);
            // const password = await req.body.password;
            //-------------Il y a une problème sur cette ligne code-----------------
            // if (!results || results[0].password !== password) {

            //-------------Solution n'est pas fiable-----------------
            // if (!results || !(await bcrypt.compare(password, hashedPassword))) {

            console.log("Result test", results[0].password);

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
            } else if (!results || !(await bcrypt.compare(password, results[0].password))) {

                //---------cette ligne marche si le mot de passe n'est pas crypter----------
                // if (!results || password != results[0].password) {
                res.status(401).json({
                        message: 'Email or Password id incorrect'
                    })
                    // res.send("Email or Password id incorrect");
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is:" + token);

                const cookieOptions = {
                    expires: new DataCue(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);

                // ---------------Valeur à retourner-----------------
                res.json(results[0]);
            }

            //--------------------------------------------------

            //--------------------------------------------
        })

    } catch (err) {
        console.log(err);
    }

    //     db.query('SELECT * FROM user WHERE email = ?', [email], async(err, results) => {

    //         if (results.length < 1) {
    //             return res.status(401).render({
    //                 message: 'Enter valid email or password'
    //             });
    //         } else if (!(await bcrypt.compare(password, results[0].password))) {

    //             return res.status(401).render({
    //                 message: 'Enter valid email or password'

    //             });

    //         } else {

    //             req.session.email = req.body.email;
    //             var email = req.session.email;

    //             // res.status(200).redirect('/home')  
    //             res.json(results[0]);

    //         }
    //     });

    // } catch (err) {
    //     console.log(err);
    // }


}

//-------------Inscription---------------------
exports.register = (req, res) => {
    console.log("Inscriptio 1", req.body);

    const { nom, email, password } = req.body;

    db.query('SELECT email FROM user user WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log("L'inscription réfuer", error);
        }

        if (results.length > 0) {
            // Cette fonction retourne la view register avec le message d'erreur
            // Mais il y a une problème
            return res.render('register', {
                message: 'Email est déja utiliser'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword)

        //-----------INSERTION dans la base de données-------------------
        db.query('INSERT INTO user SET ?', { nom: nom, email: email, password: hashedPassword }, (error, results) => {
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
                // res.send("Register user failed");
            }
        })
    });

}