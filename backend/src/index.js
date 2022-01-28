const express = require('express')
const cors = require('cors')
const app = express()
const routes = require("./routes/transactions")


//Settings
app.set('port', process.env.PORT || 3500)

//Middlewares
app.use(express.json());

//Routes
app.use(cors()) // Use this after the variable declaration
app.use("/", routes.transactions)

 //Crear servidor con el puerto
app.listen(app.get('port'), () => {
    console.log('Hola Mundo', app.get('port'))
})

module.exports = app;