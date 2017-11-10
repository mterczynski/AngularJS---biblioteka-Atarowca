const ip = 'localhost';
const port = 3000;
const colors = require('colors');
const fs = require('fs');

const express = require('express');
const app = express();
const xml2js = require('xml2js');
const xpath = require('xpath');
const DomParser = require('xmldom').DOMParser;
const xmlToJsonParser = new xml2js.Parser();

const to_json = require('xmljson').to_json;

function getJsonStringFromXpath(xpathString, xmlFile, callback){
    const queryResult = xpath.select(xpathString, xmlFile);
    const queryResultFixed = (queryResult + "").replace(new RegExp(">,<","g"),"><");
    to_json("<WRAPPER>" + queryResultFixed + "</WRAPPER>", function (error, data) {
        callback(JSON.stringify(data.WRAPPER));
    });
}

let xmlFile;

console.log(`----------------- Restarting server ---------------`.cyan);
//Read xml file and convert it to JSON:
fs.readFile('./czasopisma.xml', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    xmlFile = new DomParser().parseFromString(data);
});

app.use(express.static('./static'));

// Start http server:
app.listen(port, ip, ()=>{
    console.log(`Server listening on ${ip}:${port}`.green);
});

app.get("/getMagazines", (req,res)=>{
    getJsonStringFromXpath("//zmienne/*", xmlFile, (jsonString)=>{
        res.send(jsonString);
    });
});

app.get("/getMagazineDetails", (req, res)=>{
    getJsonStringFromXpath(`//lata/${req.query.name}`, xmlFile, (jsonString)=>{
        res.send(jsonString);
    });
});

app.get("/getYear", (req, res)=>{
    try{
        let xstring = `//${req.query.name}/*[@rok='${req.query.year}']`;
        if(req.query.year == 'any'){
            xstring = `//${req.query.name}/*[@rok>0]`;
        } 
        getJsonStringFromXpath(xstring, xmlFile, (jsonString)=>{
            res.send(jsonString);
        });
    } catch(ex) {
        console.log(ex);
        res.send('error');
    }
    
});


(function test(){
})();

/*
    Routes:
    / - lista tytułów
    /m/$mName - magazyn
    /m/$mName/$year - magazyn/rok
    /m/$mName/all - magazyn/wszystkie lata 
*/

/*
    link do img z atarionline:

    http://www.atarionline.pl/biblioteka/czasopisma/img/$mName.jpg
    http://www.atarionline.pl/biblioteka/czasopisma/img/$mName/$uniqueName
*/