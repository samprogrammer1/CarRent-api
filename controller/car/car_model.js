const route = require('express').Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();


route.post('/',(req, res, next)=>{
    console.log(req.body);
    return res.send(req.body)
})

module.exports = route;