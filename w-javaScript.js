const fs = require('fs');
const http = require('http');
const url = require('url');
const requests = require('requests');
const path = require('path');

let home = "";
let pa = "";

try{
   pa = path.join(__dirname,'w-html.html');
    home=fs.readFileSync(pa , 'utf-8');

}catch(err){
  console.log(err);
}

const replaceval = (tempdata , newdata)=>{
    let raw = newdata.main.temp;
    raw = (raw - 273.15);
    raw = raw.toFixed(1);
    let data = tempdata.replace("{%temperature%}",raw);
    data = data.replace("{%location%}",newdata.name);
    return data;
}
const server = http.createServer((request , response)=>{

   if(request.url == "/"){

       requests("https://api.openweathermap.org/data/2.5/weather?q=Ghazipur&appid=a1dc628e8abe98d5e12f3a61249b00ed")
       .on("data" , (chunk)=>{
         const obj = JSON.parse(chunk);
         const aray = [obj];
         const fun = aray.map((val)=>replaceval(home,val)).join("");
            response.write(fun);

       }).on("end" , (error)=>{
            if(error) {
              return console.log('connection issue',error);
             }
            else{
             response.end();
            }
        });
      }else if(request.url == '/w-css.css'){
        let csspath = path.join(__dirname,'/w-css.css');
        let filestream = fs.readFileSync(csspath,'UTF-8');
        response.write(filestream);
        response.end();
      }
});


server.listen(5000,"127.0.0.1",(error)=>{

  if(error){
    console.log(error);
  }else{
    console.log('listening');
  }
});
