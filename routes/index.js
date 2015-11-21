var express = require('express');
var router = express.Router();
var db = require('../db');
var strain_db = require('../strain_db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Zoombud' });
});

/* ****************** STORE routes ******************* */
router.get('/stores/', function(req, res, next) {
    var allstores;
    db.query('SELECT s.*, (SELECT COUNT(product_id) FROM products WHERE store_id = s.store_id) as products_count FROM stores s ORDER BY s.name ASC', 
        function (err, rows, result) {
            if (err) throw err;
            allstores = rows;
            //console.log(allstores);
            res.render('stores', { title: 'Zoombud Stores', allstores: allstores });
        }
    );
});
router.get('/stores/add', function(req, res, next) {
    res.render('stores-add', { title: 'Add Zoombud Store' });
});
/* POST to Add Store Service */
router.post('/stores/add', function(req, res) {
    query = db.query('INSERT INTO stores SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            console.log(query.sql);
            res.send('Store added to database. <a href="/stores/edit/' + result.insertId + '">Click here to edit</a>');
        }
    );
});
router.get('/stores/edit/:store_id', function(req, res, next) {
    var store_id = req.params.store_id;
    console.log('edit store id: ' + store_id);
    var store;
    db.query('SELECT * FROM stores WHERE store_id = ?', store_id, 
        function (err, rows, result) {
            if (err) throw err;
            store = rows[0];
            console.log(store.name);
            res.render('stores-edit', { title: 'Zoombud Store: ' + store.name, store: store });
        }
    );
});
/* POST to Edit Store Service */
router.post('/stores/edit/:store_id', function(req, res) {
    var store_id = req.params.store_id;
    console.log('edit store id: ' + store_id);
    query = db.query('UPDATE stores SET ? WHERE store_id = ' + store_id, req.body, 
        function (err, result) {
            if (err) throw err;
            console.log(query.sql);
            res.send('Store info updated.');
        }
    );
});

/* ****************** STORE PRODUCTS routes ******************* */
router.get('/stores/products/:store_id', function(req, res, next) {
    var store_id = req.params.store_id;
    var store_name = '';
    db.query('SELECT * FROM stores WHERE store_id = ?', store_id,
    function (err, rows, result) {
            if (err) throw err;
            store = rows[0];
            store_name = store.name;
        }
    );
    var products;
    db.query('SELECT * FROM products WHERE store_id = ? ORDER BY product_name ASC', store_id,
        function (err, rows, result) {
            if (err) throw err;
            products = rows;
            //console.log(products);
            res.render('store-products', { title: store_name + ' Products', products: products, store_id: store_id });
        }
    );
});
router.get('/stores/products/add/:store_id', function(req, res, next) {
    var store_id = req.params.store_id;
    var store_name = '';
    db.query('SELECT * FROM stores WHERE store_id = ?', store_id,
    function (err, rows, result) {
            if (err) throw err;
            store = rows[0];
            store_name = store.name;
            res.render('store-products-add', { title: 'Add Product for ' + store_name, store_id: store_id });
        }
    );
});
/* POST to Add Store Product Service */
router.post('/stores/products/add', function(req, res) {
    query = db.query('INSERT INTO products SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            console.log(query.sql);
            res.send('Product added to database. <a href="/stores/products/edit/' + result.insertId + '">Click here to edit</a>');
        }
    );
});
router.get('/stores/products/edit/:product_id', function(req, res, next) {
    var product_id = req.params.product_id;
    
    db.query('SELECT s.name as store_name, p.* FROM products p LEFT JOIN stores s ON (s.store_id = p.store_id) WHERE product_id = ?', product_id, 
        function (err, rows, result) {
            if (err) throw err;
            var product = rows[0];
            
            if (product.strain_id) {
                var strain_name;
                strain_db.query("SELECT s.* FROM strains s WHERE s.strain_id = ?", product.strain_id, 
                    function (err, rows, result) {
                        if (err) throw err;
                        var strain = rows[0];
                        strain_name = strain.name;
                        res.render('stores-product-edit', { title: 'Edit ' + product.store_name + ' Product: ' + product.product_name, product: product, strain_name: strain_name });
                    }
                );
            } else
                res.render('stores-product-edit', { title: 'Edit ' + product.store_name + ' Product: ' + product.product_name, product: product, strain_name: '' });
        }
    );
});
/* POST to Edit Store Product Service */
router.post('/stores/products/edit/:product_id', function(req, res) {
    var product_id = req.params.product_id;
    query = db.query('UPDATE products SET ? WHERE product_id = ' + product_id, req.body, 
        function (err, result) {
            if (err) throw err;
            console.log(query.sql);
            res.send('Product updated.');
        }
    );
});

/* ****************** STRAIN routes ******************* */
router.get('/strains/lookup/:strain', function(req, res, next) {
    var strain = req.params.strain;
    strain_db.query("SELECT s.* FROM strains s WHERE s.name LIKE ? ORDER BY s.name ASC LIMIT 10", '%' + strain + '%', 
        function (err, rows, result) {
            if (err) throw err;
            strains = rows;
            //console.log(strains);
            res.send(strains);
        }
    );
});

module.exports = router;
