//Building a simple express server
const express = require('express')
const { get } = require('http')
const app = express()

//set our port to be 5000
const port = 5000 

//will serve our html files out of the "public" directory
const path=require("path")
let publicPath= path.resolve(__dirname,"public")
app.use(express.static(publicPath))

//allows us to fetch data from the openweathermap api
const fetch = require('node-fetch');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants')

//gets location from web page and invokes getWeather function
app.get('/weatherFor/:location', getWeather)

//our server will listen on port 5000 for incoming requests
app.listen(port, () => console.log(`Server is listening on port ${port}`))

function getWeather(req, res){
        //location variable is the location string we received
        let location = req.params.location
        //appending our url so we make an api request for the location inputted by the user 
        //changed units to metric so we get temperature in celsius rather than kelvin
        const url = "http://api.openweathermap.org/data/2.5/forecast?q="+location+"&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957"
        
        console.log("Location: "+location+", url: "+url) //for development purposes

        fetch(url)
            .then(data => data.json()) //return data as json
            .then(data => {
                //We will parse the data and add to a new array so we only send the client relevent data
                //we will do this by summarising the data by only sending the client a weather update once a day
                //this will make it easier to give a concise report on the data
                let i=0; //initialise counter
                let relevantData = []; //initilise empty array to store the data we will send
                while(i<40){ //we get 8 updates a day, over 5 days is 40 total updates
                    relevantData.push(data['list'][i]); //add data to new array
                    i = i+8; //iterate by 8, we will have 1 weather report per day
                }
                relevantData.push(data['city']['country']); //Send the country code to the user as well
                //This is to avoid them mixing up same city names in different countries

                res.send(relevantData); //send this new relevent data to the client
            })
            .then(console.log("Data for "+location+" sent to client")) //for development purposes
        .catch(err => {
            res.send(err); //if we cannot fetch the data, send error to client
            console.log("An error occured")}); //for development purposes

    }