// require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const kelvinCelsius = require("kelvin-to-celsius");
const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", kelvinCelsius(orgVal.main.temp));
  temperature = temperature.replace("{%tempmin%}", kelvinCelsius(orgVal.main.temp_min));
  temperature = temperature.replace("{%tempmax%}", kelvinCelsius(orgVal.main.temp_max));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
        `http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=36b3bf14860ad743055318c81d0b6a81`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
}); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("listening to port ${PORT}");
});

// server.listen(8000, "127.0.0.1");