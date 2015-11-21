var express = require('express');
var router = express.Router();
var db = require('../db');
var strain_db = require('../strain_db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Zoombud' });
});

module.exports = router;
