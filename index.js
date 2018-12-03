const express = require('express')
,app = express()
,handlebars = require('express3-handlebars').create({ defaultLayout: 'main'})
,mongoose = require('mongoose')
,cookieParser = require('cookie-parser')
,session = require('express-session')
,bodyParser = require('body-parser')
,path = `${__dirname}/public`
,flash = require('connect-flash')
,passport = require('passport')
,dotenv = require('dotenv')
,expressValidator = require('express-validator');

require('dotenv').config();
app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'fabrixrusonline', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//express validator
app.use(expressValidator({
    errorFormatter: (param,msg,value) => {
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root
        while(namespace.length) {
            formParam += `[${namespace.shift()}]`;
        }
        return {
            param: formParam,
            msg:msg,
            value:value
        }
    }
}));

//routes
let admin = require('./routes/admin');
let user = require('./routes/user');
let cart = require('./routes/cart');

//using routes
app.use('/user',user);
app.use('/admin',admin);
app.use('/cart',cart);

//models
const Product = require('./models/product');


app.use(express.static(path));
app.use('/user',express.static(path));
app.use('/products',express.static(path));
app.use('/admin',express.static(path));
app.use('/cart', express.static(path));
app.set('port', process.env.PORT || 3000);


mongoose.connect(process.env.MONGODB, { useNewUrlParser:true },err => {
    if (err) console.warn(err);
    console.log('Connected to FabrixRus');
});

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req,res) => {
    Product.find((err,products) => {
        if (err) throw err;
        let partProducts = [];
        let desiredNumber = 8;
        let userName;
        if(req.user && req.user.isAdmin === 'admin') {
            userName = 'Admin' 
        } else if ( req.user && req.user.isAdmin !== 'admin') {
            userName = req.user.name;
        }
        if (products.length >= desiredNumber) {
            for (let i = 0; i < desiredNumber; i++) {                
                partProducts.push(products[i]);
            }
            console.log(products);
        } else {
            partProducts = products;
        }
        partProducts.map(product => {
            product.description = `${product.description.substring(0, 25)}...`;
        });
        res.render('home',{ title: 'Home', partProducts: partProducts, userName: userName, home:'home' });
    }, err => { console.warn(`The following error occurred: ${err}`); })
});

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About FabrixRus',
        about: 'about'
    });
});
app.get('/contact', (req,res) => {
    res.render('contact', {
        title: 'Contact Us',
        contact: 'contact'
    });
});

app.get('/products/store', (req, res) => {
    Product.find((err, data) => {
        let productNumber = 0;
        for (let datum of data) {
            productNumber++;
        }
        res.render('products/product_list', {
            products: data,
            productsTotal: productNumber,
            title: 'Product',
            shop: 'shop'
        });
    }, err => { console.warn(`The following error occurred: ${err}`); })
});

app.get('/products/single-recheck/:id/:qty', (req,res) => {
    Product.findOne({
        _id: req.params.id
    }, (err,product) => {
        if (err) throw err;
        console.log(product);
        console.log(req.params.qty);
        product.qty = req.params.qty;
        res.render('products/product_detail_edit', {
            carted: product
        });
    });
});
app.get('/products/single/:id', (req,res) => {
    Product.findOne({
        _id: req.params.id
    },(err,product) => {
        if (err) throw err;
        console.log(product);
        Product.find({
            color: product.color
        }, (error, relatedProducts) => {
            if (error) throw error;
            let relProducts = [];
            // relatedProducts.filter(relProduct => {
            //     relProduct._id !== product._id
            // }).map(realRelProducts => {
            //     console.log(realRelProducts);
            //     relProducts.push(realRelProducts);
            // });
            for (let i = 0; i < relatedProducts.length; i++) {
                if (relatedProducts[i]._id !== product._id) {
                    relProducts.push(relatedProducts[i]);
                }
            }
            console.log(relProducts);
            res.render('products/product_detail', {
                title: product.title,
                thisProduct: product
                // relatedProducts: relProducts
            });
        });
    });
});


//custom 404 page
app.use((req,res) => {
    res.status(404).render('404', {
        title: 'Page Not Found'
    });
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500)
    .render('500', {
        title: 'Internal server error'
    });
});

//basic linear search algorithm, nothing fancy
app.post('/search/:id', (req,res) => {
    Product.find((err,results) => {
        if (err) throw err;
        let allResults = [];
        Product.findOne({
            _id: req.params.id
        }, (err,result) => {
            if (err) throw err;
            if (result) {
                let colorSearchString = result.color;
                if (results.includes(result)) {
                    results.filter(single => {
                        single.color === colorSearchString;
                    }).map(slimmedDownResult => {
                        allResults.push(slimmedDownResult);
                    });
                    res.render('search-result', {
                        searchResult: allResults
                    });
                } else {

                }
            } else {
                searchResults = 'No result available';
            }
        })
    });
});


app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')};`)
});      
