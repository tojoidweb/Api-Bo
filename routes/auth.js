const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();


//---------------Registration-----------------
router.post('/register', authController.register);



module.exports = router;