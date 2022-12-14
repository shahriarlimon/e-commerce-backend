const express = require('express');
const cookieParser = require('cookie-parser')
const fileUpload = require("express-fileupload")
const app = express()
const port = 4000
const connectDb = require("./Db/db.js")
const { errorHandler } = require('./middlewares/error.js')
const apiRoutes = require("./Routes/apiRoutes")
require("express-async-errors");

/* mongodb connection */
connectDb()


app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/v1", apiRoutes);




app.use((error,req,res,next)=>{
  if(process.env.NODE_ENV==="development"){
    console.log(error)
  }
  next(error)
})
app.use((error,req,res,next)=>{
  if(process.env.NODE_ENV==="development"){
    res.status(500).json({
      message:error.message,
      stack:error.stack
    })
  }else{
    res.status(500).json({
      message:error.message
    })
  }
  next(error)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})