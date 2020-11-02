const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const cookieParser = require('cookie-parser');


//---------------Registration-----------------
router.post('/register', authController.register);

//---------------Login------------------
router.post('/login', authController.login);


module.exports = router;