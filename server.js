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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})