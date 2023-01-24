const http=require("http");
const fs=require("fs");
var requests =require("requests");


const homeFile=fs.readFileSync("index.html","utf-8");

const replaceVal=(tempVal,curVal)=>{
 let temperature=tempVal.replace("{%tempval%}",curVal.main.temp);
     temperature=temperature.replace("{%tempmin%}",curVal.main.temp_min);
     temperature=temperature.replace("{%tempmax%}",curVal.main.temp_max);
     temperature=temperature.replace("{%location%}",curVal.name);
     temperature=temperature.replace("{%country%}",curVal.sys.country);
     temperature=temperature.replace("{%tempstatus%}",curVal.weather[0].main);
     return temperature;
}

const server=http.createServer((req,resp)=>{
    if(req.url="/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=ranchi&appid=e3b30f950cd85ec0da53255ac2ce8f4e", )
        .on('data',  (chunk)=> {
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
            resp.write(realTimeData);
            // console.log(realTimeData);
            
        })  
        .on('end',  (err) =>{ 
          if (err) return console.log('connection closed due to errors', err);
             resp.end();
        //   console.log('end');
        });
    }

});

const port = process.env.PORT || 3000

server.listen(port)