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
,expressValidator = require('express-validator')
,multer = require('multer')
,{ ensureAuth } = require('./helpers/auth');


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

//using routes
app.use('/user',user);
app.use('/admin',admin);

//models
const Product = require('./models/product');

app.use(express.static(path));
app.use('/user',express.static(path));
app.use('/products',express.static(path));
app.use('/admin',express.static(path));
app.use('/admin/edit', express.static(path));
app.set('port', process.env.PORT || 8082);


//handling file uploads
const upload = multer({dest: 'uploads/'});

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true },err => {
    if (err) console.warn(err);
    console.log('Connected to FabrixRus');
});

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



// app.post('/admin/login',)
require('./helpers/auth');

app.get('/', (req,res) => {
    Product.find((err,products) => {
        let partProducts = [];
        let desiredNumber = 8;
        for (let i = 0; i < desiredNumber; i++) {
            partProducts.push(products[i]);
        }
        res.render('home',{ title: 'Home', partProducts: partProducts, home:'home' });
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

app.get('/cart',(req,res) => {
    res.render('products/cart', {
        shop: 'shop'
    });
})

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


app.get('/products/single/:id', (req,res) => {
    res.render('products/product_detail');
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

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')};`)
});      