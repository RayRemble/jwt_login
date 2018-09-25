
const express = require('express');
const router = express.Router();
const request = require("request");
const yargs = require("yargs");

var URL = "https://www.ipapi.co/";
var userLocationCity;
var userTimezone;
// --ip "122.1.1.1" URL + ip + /json

const argv = yargs.options({
    ip: {
        describe: "IP address to which you want to find location",
        alias: "i",
        string: true
    }
})
.help()
.alias('help', 'h')
.argv;

if(argv.ip){
    URL += argv.ip + "/json";
} else {
    URL += "json";
}

console.log(URL);

request({
    url: URL,
    json: true
}, (err, response, body) => {
    if(!err && response.statusCode == 200){
        console.log(body);
        userLocationCity = body.city;
        userTimezone = body.timezone;
    }
});


router.post('/', (req, res) => {
    
    return res.json({
        success: true,
        timezone: 'GMT',
        userLocationCity: userLocationCity,
        userTimezone: userTimezone 
    })

    
});

module.exports = router;