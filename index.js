require('dotenv').config()
const express  =require('express')
const app = express()
const path = require('path')
const port = process.env.PORT||80;
const axios = require("axios")
app.use(express.static(path.join(__dirname, 'public')))
app.get('/data',async(req,res)=>{
    // console.log(req.query)
    let re = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.APIKEY}`)
    .catch(e=>console.log(e))
    // console.log(re.data)
    res.send(re.data)
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});