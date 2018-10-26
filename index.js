let express = require('express');
let app = express();
let handlebars = require('express3-handlebars').create({ defaultLayout: 'main'});
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Product = require('./models/product');
app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(express.static(`${__dirname}/public`));
app.set('port',process.env.PORT || 4000);

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true })
    .then(() => {
        console.log('Connected to FabrixRus');
    })
    .catch((err) => {
    console.warn(err);
});

app.use((req,res,next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/',(req,res) => {
    Product.find((err,data) => {
        res.render('home',{ title: 'Home', products: data });
    })
        .catch(err => {
            console.warn(err);
    });
});
app.get('/about',(req,res) => {
    res.render('about',{
        pageTestScript : '/qa/tests-about.js',
        title: 'About Us'
    });
});
app.get('/contact',(req,res) => {
    res.render('contact',{
        title: 'Contact Us'
    });
});

app.get('/login',(req,res) => {
    res.render('login',{
        title: 'Login'
    });
});
app.get('/products',(req,res) => {
    res.render('products',{
        title: 'Products'
    });
});
//custom 404 page
app.use((req,res) => {
    res.render('404');
    res.status(404);
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).render('500');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')}; press ctrl - C to terminate`)
});