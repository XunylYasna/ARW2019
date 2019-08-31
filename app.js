const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.PORT || 5000;

// Handlebars
app.set('views', path.join(__dirname,"views"));
app.set('view engine', 'handlebars')


app.get('/', (req,res) =>{
    res.render("main")
})


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

