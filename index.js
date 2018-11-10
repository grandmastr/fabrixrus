const express = require('express')
,app = express()
,handlebars = require('express3-handlebars').create({ defaultLayout: 'main'})
,mongoose = require('mongoose')
,cookieParser = require('cookie-parser')
,session = require('express-session')
,bodyParser = require('body-parser')
,path = `${__dirname}/public`
,flash = require('connect-flash')
,expressValidator = require('express-validator')
,passport = require('passport')
,localStategy = require('passport-local').Strategy
,csrf = require('csurf')
,csrfProtection = csrf({cookie: true})
,multer = require('multer');

app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: false }));

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
            msg,
            value
        }
    }
}));
app.use(flash());
// app.use((req,res,next) => {
//     //if there is a flash message , transfer it to context and delete
//     res.locals.flash = req.session.flash;
//     delete req.session.flash;
//     next();
// });
app.use(cookieParser());
app.use(session({secret: 'supersecret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path));
app.use('/user',express.static(path));
app.use('/product',express.static(path));
app.set('port', process.env.PORT || 4000);


//handling file uploads
const upload = multer({dest: 'uploads/'})

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
    .catch(err => { console.warn(`The following error occurred: ${err}`); });
    console.log(`${req.ip}`)
});

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About FabrixRus'
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
        let productNumber = 0;
        for (let datum of data) {
            productNumber += 1;
        }
        res.render('products/single', {
            products: data,
            productsTotal: productNumber,
            title: 'Product'
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
    }).status(404);
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