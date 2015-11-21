var express = require('express');
var async = require('async');
var router = express.Router();
var db = require('../db');
var strain_db = require('../strain_db');

router.get('/menu', function(req, res, next) {
    var products = {};
    db.query('SELECT p.* FROM products p ORDER BY p.price ASC', 
        function (err, rows, result) {
            if (err) throw err;
            products = rows;
            res.send(products);
        }
    );
});

router.get('/menu-with-strains', function(req, res, next) {
    getProductTree(function(err, result) {
        res.send(result);
    });
    
    function getProductTree(callback) {
        db.query('SELECT p.* FROM products p ORDER BY p.price ASC', function(error, results, fields) {
            async.map(results, productIterator, callback);
        });
    }
    
    function productIterator(resultItem, callback) {
        var product = resultItem;
        var strain_id = resultItem.strain_id;

        strain_db.query('SELECT * FROM strains WHERE strain_id = ?', strain_id, function(error, results, fields) {
            async.map(results, strainIterator, function(err, strain) {
                product.strain = strain;
                callback(err, { product: product });
            });
        });
    }
    
    function strainIterator(resultItem, callback) {
        var strain = resultItem;
        var strain_id = resultItem.strain_id;
        
        async.series([
            function(callback) {
                strain_db.query('SELECT * FROM strain_photos sp WHERE sp.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { photos: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM categories_strains cs LEFT JOIN categories c ON (c.category_id = cs.category_id) WHERE cs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { categories: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM tags_strains ts LEFT JOIN tags t ON (t.tag_id = ts.tag_id) WHERE ts.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { tags: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM symptoms_strains ss LEFT JOIN symptoms s ON (s.symptom_id = ss.symptom_id) WHERE ss.strain_id = ?', strain_id, function(error, results, fields) {
                    callback(null, { strain_symptoms: results });
                    if (!results)
                        results = '';
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM conditions_strains cs LEFT JOIN conditions c ON (c.condition_id = cs.condition_id) WHERE cs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { conditions: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM poseffects_strains ps LEFT JOIN poseffects p ON (p.poseffect_id = ps.poseffect_id) WHERE ps.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { positive_effects: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM negeffects_strains ns LEFT JOIN negeffects n ON (n.negeffects_id = ns.negeffects_id) WHERE ns.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { negative_effects: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM flavors_strains fs LEFT JOIN flavors f ON (f.flavor_id = fs.flavor_id) WHERE fs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { flavors: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT s.name, rs.* FROM related_strains rs LEFT JOIN strains s ON (s.strain_id = rs.related_id) WHERE rs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { related_strains: results });
                });
            },
        ],
        function(err, results){
            // final callback code
            // append results on to strain.info
            strain.info = results;
            callback(err, strain);
        }
        );
    }
});

router.get('/strain/:strain_id', function(req, res, next) {
    var strain_id = req.params.strain_id;
    getStrainTree(strain_id, function(err, result) {
        res.send(result);
    });
    
    function getStrainTree(strain_id, callback) {
        strain_db.query('SELECT * FROM strains WHERE strain_id = ?', strain_id, function(error, results, fields) {
            async.map(results, strainIterator, function(err, strain) {
                callback(err, {strain: strain});
            });
        });
    }
    
    function strainIterator(resultItem, callback) {
        var strain = resultItem;
        var strain_id = resultItem.strain_id;
        
        async.series([
            function(callback) {
                strain_db.query('SELECT * FROM strain_photos sp WHERE sp.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { photos: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM categories_strains cs LEFT JOIN categories c ON (c.category_id = cs.category_id) WHERE cs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { categories: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM tags_strains ts LEFT JOIN tags t ON (t.tag_id = ts.tag_id) WHERE ts.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { tags: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM symptoms_strains ss LEFT JOIN symptoms s ON (s.symptom_id = ss.symptom_id) WHERE ss.strain_id = ?', strain_id, function(error, results, fields) {
                    callback(null, { strain_symptoms: results });
                    if (!results)
                        results = '';
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM conditions_strains cs LEFT JOIN conditions c ON (c.condition_id = cs.condition_id) WHERE cs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { conditions: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM poseffects_strains ps LEFT JOIN poseffects p ON (p.poseffect_id = ps.poseffect_id) WHERE ps.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { positive_effects: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM negeffects_strains ns LEFT JOIN negeffects n ON (n.negeffects_id = ns.negeffects_id) WHERE ns.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { negative_effects: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT * FROM flavors_strains fs LEFT JOIN flavors f ON (f.flavor_id = fs.flavor_id) WHERE fs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { flavors: results });
                });
            },
            function(callback) {
                strain_db.query('SELECT s.name, rs.* FROM related_strains rs LEFT JOIN strains s ON (s.strain_id = rs.related_id) WHERE rs.strain_id = ?', strain_id, function(error, results, fields) {
                    if (!results)
                        results = '';
                    callback(null, { related_strains: results });
                });
            },
        ],
        function(err, results){
            // final callback code
            // append results on to strain.info
            strain.info = results;
            callback(err, strain);
        }
        );
    }
});


module.exports = router;
