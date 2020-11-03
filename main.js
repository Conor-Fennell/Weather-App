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

//gets location from web page and invokes getWeather function
app.get('/weatherFor/:location', getWeather)

//our server will listen on port 5000 for incoming requests
app.listen(port, () => console.log(`Server is listening on port ${port}`))

function openweathermap(url){

    const promise = new Promise((resolve, reject) =>{
        let data= fetch(url); //fetch data at url endpoint
        console.log("Fetching url")
        console.log(data)
        if (data){
            console.log("Resolving");
            resolve(data);
        }
        else{
            console.log("Rejecting");
            reject("No connection established");
        }
    })
        promise.then((data) => {
            weatherData= data.json();
            console.log("Data as json: "+weatherData);
        }).catch((message) =>{
            console.log(message)
        });

}

function getWeather(req, res){
        //location variable is the location string we received
        let location = req.params.location
        //appending our url so we make an api request for the location inputted by the user 
        //changed units to metric so we get temperature in celsius rather than kelvin
        const url = "http://api.openweathermap.org/data/2.5/weather?q="+location+"&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957"
        
        console.log("Location: "+location+", url: "+url)

        fetch(url)
            .then(data => data.json())
            .then(data => res.send(data))
            .then(console.log("Data sent to client"))
        .catch(err => console.log("An error occured"));

        //console.log("Here we are: "+data);
        //res = {
         //   "temperature": data['main']['temp'], 
          //  "humidity": data['main']['humidity'], 
          //  "windSpeed": data['wind']['speed']
      //  }
        //display data in console
        //res = data.body()
        //console.log(res)

    }