const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path')
const bodyParser = require('body-parser');


// Body Parser
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars
const exphbs  = require('express-handlebars');


app.engine( 'hbs', exphbs( {
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      json: function (content) { return JSON.stringify(content); }
    },
    layoutsDir: path.join(__dirname, "views/layouts/"),
    partialsDir: path.join(__dirname, 'views/partials')
  }));

app.set('view engine', '.hbs');




// Routes
app.use(express.static(__dirname + '/public'));
app.use('/register', require('./routes/registration'))
app.use('/dashboard',require('./routes/dashboard'))

app.get('/s', (req,res) =>{
  res.render('scratch')
})

app.get('/', (req,res) =>{
  res.render('welcome')
})




app.listen(PORT, console.log(`Server started on port ${PORT}`))