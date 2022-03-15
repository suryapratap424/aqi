require('dotenv').config()
const express  =require('express')
const app = express()
const path = require('path')
const port = process.env.PORT||81;
const axios = require("axios")
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());
app.use(express.static(path.join(__dirname, 'public')))
app.get('/data',async(req,res)=>{
    // console.log(req.query)
    axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.APIKEY}`)
    .then(re=>res.send(re.data))
    .catch(e=>res.send(e))
    // if(re)
    // res.send(re.data)
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});