let express = require('express'),
    app = express(),
    handlebars = require('express3-handlebars').create({ defaultLayout: 'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.use(express.static(`${__dirname}/public`));
app.set('port',process.env.PORT || 3000);

app.get('/',(req,res) => {
    res.render('home');
});

let names = [
    'Israel',
    'Tolulope',
    'Akintunde'
];
app.get('/about',(req,res) => {
    let randomName = names[Math.floor(Math.random() * names.length)];
    res.render('about', { name: randomName });
});
app.get('/contact',(req,res) => {
    res.render('contact');
});

//custom 404 page
app.use((req,res) => {
    res.render('404');
    res.status(404);
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')}; press ctrl - C to terminate`)
});