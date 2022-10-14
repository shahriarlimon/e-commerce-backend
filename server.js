const express = require('express')
const app = express()
const port = 5000
const connectDb = require("./Db/db.js")
const { errorHandler } = require('./middlewares/error.js')
const apiRoutes = require("./Routes/apiRoutes")
require("express-async-errors");
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/v1", apiRoutes)

/* mongodb connection */
connectDb()

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})