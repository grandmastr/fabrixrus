let express = require('express'),
    app = express(),
    handlebars = require('express3-handlebars').create({ defaultLayout: 'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 3000);

app.get('/',(req,res) => {
    res.type('text/plain');
    res.send('Welcome to MeadowLake Travels Website');
});
app.get('/about',(req,res) => {
    res.type('text/plain');
    res.send('About Meadowlake services')
});
app.get('/contact',(req,res) => {
    res.type('text/plain');
    res.send('Contact page for MeadowLake Travels')
});
//custom 404 page
app.use((req,res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//custom error 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Internal Server Error');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on localhost:${app.get('port')}; press ctrl - C to terminate`)
});