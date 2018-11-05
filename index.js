const express = require('express');
const app = express();
const handlebars = require('express3-handlebars').create({ defaultLayout: 'main'});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = `${__dirname}/public`;
const flash = require('connect-flash');
const passport = require('passport');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'supersecret', resave: false, saveUninitialized: false}));
app.use(csrfProtection);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path));
app.use('/user',express.static(path));
app.use('/product',express.static(path));
app.set('port', process.env.PORT || 4000);

//models
const Product = require('./models/product');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true })
    .then(() => {
        console.log('Connected to FabrixRus');
    })
    .catch((err) => {
        console.warn(err);
});
require('./config/passport');
app.get('/', (req,res) => {
    Product.find((err,data) => {
        res.render('home',{ title: 'Home', products: data });
    })
    .catch(err => { console.warn(`The following error occurred: ${err}`);});
});

app.get('/about', (req,res) => {
    res.render('about',{
        pageTestScript : '/qa/tests-about.js',
        title: 'About Us'
    });
});
app.get('/contact', (req,res) => {
    res.render('contact', {
        title: 'Contact Us'
    });
});

app.get('/user/login', (req,res) => {
    res.render('user/login', {
        title: 'Login'
    });
});

app.get('/profile', (req,res,next) => {
   res.render('profile');
});

app.get('/product/single', (req,res) => {
    Product.find((err,data) => {
        const productNumber = 0;
        for (const datum of data) {
            productNumber += 1;
        }
        res.render('products/single', {
            products: data,
            productsTotal: productNumber
        });
    })
        .catch(err => { console.warn(`The following error occurred ${err}`); });
});

app.get('/user/register', (req,res,next) => {
    res.render('user/signup',{
        title: 'Register',
        csrfToken: req.csrfToken()
    });
});

app.post('/user/register', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;


});

app.get('/products', (req,res) => {
    res.render('products',{
        title: 'Products'
    });
});
//custom 404 page
app.use((req,res) => {
    res.render('404',{
        title: 'Page Not Found'
    });
    res.status(404);
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500', {
        title: 'Internal server error'
    });
});

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')}; press ctrl - C to terminate`)
});