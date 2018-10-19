let express = require('express'),
    app = express(),
    handlebars = require('express3-handlebars').create({ defaultLayout: 'main'});
app.disable('x-powered-by');
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(express.static(`${__dirname}/public`));
app.set('port',process.env.PORT || 4000);

app.use((req,res,next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/',(req,res) => {
    res.render('home');
});
app.get('/about',(req,res) => {
    res.render('about',{
        pageTestScript : '/qa/tests-about.js'
    });
});
app.get('/contact',(req,res) => {
    res.render('contact');
});

app.get('/services',(req,res) => {
    res.render('services');
});

app.get('/login',(req,res) => {
    res.render('login');
});

app.get('/FAQs',(req,res) => {
    res.render('FAQs');
});
//custom 404 page
app.use((req,res) => {
    res.render('404').status(404);
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).render('500');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')}; press ctrl - C to terminate`)
});