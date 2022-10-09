const express = require('express')
const app = express()
const port = 5000
const connectDb = require("./Db/db.js")
const apiRoutes = require("./Routes/apiRoutes")
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/v1", apiRoutes)
/* mongodb connection */
connectDb()

app.use((error, req, res, next) => {
  console.log(error)
  next(error)
})
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})