const express = require('express')
const app = express()
const port = 5000
const apiRoutes = require("./Routes/apiRoutes")
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/v1", apiRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})