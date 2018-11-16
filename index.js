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
,LocalStrategy = require('passport-local').Strategy
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

//models
const Product = require('./models/product');
const User = require('./models/user');
passport.serializeUser((user,done) => {
    done(null,user.id);
});
passport.deserializeUser((id,done) => {
    User.getUserById(id, (err,user) => {
        done(err,user);
    });
});
passport.use(new LocalStrategy({ usernameField: 'email',passReqToCallback: true },(req,username,password,done) => {
    User.getUserByEmail(username,(err,user) => {
        if (err) throw err;
        if(!user) {
            console.log('Unknown User');
            return done(null,false,{ message: 'Unknown User' })
        }
        if(user) console.log('Succesful')
    });
}));
app.use(cookieParser());
app.use(session({secret: 'fabrixrusonline', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path));
app.use('/user',express.static(path));
app.use('/product',express.static(path));
app.set('port', process.env.PORT || 8000);


//handling file uploads
const upload = multer({dest: 'uploads/'});

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true })
    .then(() => {
        console.log('Connected to FabrixRus');
    })
    .catch(err => {
        console.warn(err);
});

app.get('/', (req,res) => {
    Product.find((err,data) => {
        let sliderProducts = [];
        let desiredNumber = 8;
        for (let i = 0; i < desiredNumber; i++) {
            sliderProducts.push(data[i]);
        }
        res.render('home',{ title: 'Home', products: data, home:'home' });
    })
    .catch(err => { console.warn(`The following error occurred: ${err}`); });
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

app.get('/user/login', (req,res) => {
    res.render('user/login', {
        title: 'Login'
    });
});


//user authentioation
app.post('/user/login', passport.authenticate('local', {
    failureRedirect:'/user/login', failureFlash: 'Not Succssful'
}), (req, res) => {
    console.log('Authentication Successful');
    req.flash('Success', 'You are successfully logged in');
    res.redirect(306, '/');
});

app.get('/profile', (req,res,next) => {
   res.render('profile');
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
    })
        .catch(err => { console.warn(`The following error occurred ${err}`); });
});

app.get('/user/register', (req,res,next) => {
    res.render('user/signup',{
        title: 'Register'
    });
});

app.post('/user/register', (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password;
    
    //form validation
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Please enter a valid email').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords don\'t match').equals(password2);
    
    //checking for errors
    let errors = req.validationErrors();
    if(errors) {
        res.render('user/signup', {
            errors: errors,
            title: 'Register',
            email: email,
            password: password,
            password2: password2
        });
    } else {
        let newUser = new User({
            email: email,
            password: password
        });

        //create user
        User.createUser(newUser,(err,user) => {
            if(err) throw err;
            console.log(user);
        });
        req.flash('success', 'You are registered');
        res.location('/');
        res.redirect(302,'/');
    }    
});

app.get('/products', (req,res) => {
    res.render('products',{
        title: 'Products'
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

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')};`)
});      