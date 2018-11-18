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
,multer = require('multer');


app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'fabrixrusonline', resave: false, saveUninitialized: false }));
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
            msg,
            value
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
app.use('/product',express.static(path));
app.use('/admin',express.static(path));
app.set('port', process.env.PORT || 4000);


//handling file uploads
const upload = multer({dest: 'uploads/'});

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true },err => {
    if (err) console.warn(err);
    console.log('Connected to FabrixRus');
});

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect(302, '/user/login');
    }
}

app.get('*', (req, res,next) => {
    res.locals.user = req.user || null;
    next();
});


// app.post('/admin/login',)

app.get('/', ensureAuth, (req,res) => {
    Product.find((err,data) => {
        let sliderProducts = [];
        let desiredNumber = 8;
        for (let i = 0; i < desiredNumber; i++) {
            sliderProducts.push(data[i]);
        }
        res.render('home',{ title: 'Home', products: data, home:'home' });
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

app.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products'
    });
});

app.get('/product/single', (req,res) => {
    Product.find((err,data) => {
        let productNumber = 0;
        for (let datum of data) {
            productNumber ++;
        }
        res.render('products/single', {
            products: data,
            productsTotal: productNumber,
            title: 'Product'
        });
    }, err => { console.warn(`The following error occurred: ${err}`); })
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